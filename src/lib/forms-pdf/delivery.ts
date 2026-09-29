import { auth } from '@wix/essentials';
import { emailTransmissions } from '@wix/email-transmissions';
import { claimUnique, findOne, updateItem, type StoredItem } from './storage';
import { getPrivateDownloadUrl, getWixContext } from './wix';
import type { NormalizedAnswer } from './normalize';

export interface DeliveryConfig {
  emailOwner?: boolean;
  emailSubmitter?: boolean;
  recipients?: string[];
  webhookUrl?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDelivery(input: unknown): DeliveryConfig {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('DELIVERY_INVALID');
  const data = input as Record<string, unknown>;
  const allowed = ['emailOwner', 'emailSubmitter', 'recipients', 'webhookUrl'];
  if (Object.keys(data).some((key) => !allowed.includes(key))) throw new Error('DELIVERY_FIELD_INVALID');
  if (data.emailOwner !== undefined && typeof data.emailOwner !== 'boolean') throw new Error('DELIVERY_OWNER_INVALID');
  if (data.emailSubmitter !== undefined && typeof data.emailSubmitter !== 'boolean') throw new Error('DELIVERY_SUBMITTER_INVALID');
  if (data.recipients !== undefined && (!Array.isArray(data.recipients) || data.recipients.length > 5 || data.recipients.some((email) => typeof email !== 'string' || !emailPattern.test(email) || email.length > 254))) throw new Error('DELIVERY_RECIPIENTS_INVALID');
  if (data.webhookUrl !== undefined && (typeof data.webhookUrl !== 'string' || data.webhookUrl.length > 2048 || !isSafeWebhookUrl(data.webhookUrl))) throw new Error('WEBHOOK_URL_INVALID');
  return {
    emailOwner: data.emailOwner as boolean | undefined,
    emailSubmitter: data.emailSubmitter as boolean | undefined,
    recipients: data.recipients as string[] | undefined,
    webhookUrl: data.webhookUrl as string | undefined,
  };
}

export function isSafeWebhookUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port && url.port !== '443') return false;
    const host = url.hostname.toLowerCase().replace(/\.$/, '');
    if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.test') || host.endsWith('.example')) return false;
    if (!host.includes('.') || /^\d+(\.\d+){3}$/.test(host) || host.includes(':')) return false;
    return true;
  } catch { return false; }
}

function emailFromAnswers(answers: NormalizedAnswer[]): string | null {
  for (const answer of answers) {
    if (answer.kind !== 'text' || !/email|e-mail/i.test(`${answer.target} ${answer.label}`)) continue;
    const value = answer.text?.trim();
    if (value && value.length <= 254 && emailPattern.test(value)) return value;
  }
  return null;
}

async function stableGuid(key: string): Promise<string> {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key)));
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = Array.from(hash.slice(0, 16), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function performAction(instanceId: string, submissionId: string, actionType: string, task: (key: string) => Promise<string>) {
  const uniqueKey = `${instanceId}:${submissionId}:${actionType}`;
  let record = await claimUnique('automation-actions', instanceId, uniqueKey, {
    submissionId, actionType, status: 'processing', attemptCount: 1, lastAttemptAt: new Date(),
  });
  if (!record) {
    const existing = await findOne('automation-actions', instanceId, 'uniqueKey', uniqueKey);
    if (!existing || existing.status !== 'failed') return existing;
    record = await updateItem('automation-actions', instanceId, existing._id, { status: 'processing', attemptCount: Number(existing.attemptCount ?? 1) + 1, lastAttemptAt: new Date() });
  }
  try {
    const externalId = await task(uniqueKey);
    return await updateItem('automation-actions', instanceId, record._id, { status: 'completed', externalId, errorCode: '', processedAt: new Date() });
  } catch (error) {
    await updateItem('automation-actions', instanceId, record._id, { status: 'failed', errorCode: error instanceof Error ? error.message.slice(0, 100) : 'UNKNOWN', processedAt: new Date() });
    throw error;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}

export async function deliverPdf(input: {
  instanceId: string; submissionId: string; formId: string; record: StoredItem;
  answers: NormalizedAnswer[]; delivery: DeliveryConfig;
}): Promise<Array<{ action: string; status: string }>> {
  const { instanceId, submissionId, formId, record, answers, delivery } = input;
  if (typeof record.fileId !== 'string') throw new Error('PDF_NOT_READY');
  const actions: Array<{ type: string; recipient?: string; webhookUrl?: string }> = [];
  const context = await getWixContext();
  if (delivery.emailOwner) {
    if (!context.ownerEmail || !emailPattern.test(context.ownerEmail)) throw new Error('OWNER_EMAIL_UNAVAILABLE');
    actions.push({ type: 'email-owner', recipient: context.ownerEmail });
  }
  if (delivery.emailSubmitter) {
    const email = emailFromAnswers(answers);
    if (!email) throw new Error('SUBMITTER_EMAIL_UNAVAILABLE');
    actions.push({ type: 'email-submitter', recipient: email });
  }
  for (const [index, recipient] of (delivery.recipients ?? []).entries()) actions.push({ type: `email-custom-${index}`, recipient });
  if (delivery.webhookUrl) actions.push({ type: 'webhook', webhookUrl: delivery.webhookUrl });
  if (!actions.length) return [];
  const pdfUrl = await getPrivateDownloadUrl(record.fileId, false, 7 * 24 * 60);
  const results = await Promise.allSettled(actions.map(async (action) => {
    const item = await performAction(instanceId, submissionId, `${record._id}:${action.type}`, async (key) => {
      if (action.recipient) {
        const send = auth.elevate(emailTransmissions.sendEmailTransmission);
        const response = await send({
          emailSubject: `PDF for form submission ${submissionId}`,
          emailHtmlContent: `<p>Your PDF is ready.</p><p><a href="${escapeHtml(pdfUrl)}">Download the PDF</a></p><p>This private link expires in 7 days.</p>`,
          senderName: 'Forms PDF', toRecipients: [{ emailAddress: action.recipient }], type: 'TRANSACTIONAL',
        }, { idempotencyKey: await stableGuid(key) });
        const transmissionId = response.emailTransmission?._id;
        if (!transmissionId) throw new Error('EMAIL_TRANSMISSION_ID_MISSING');
        return transmissionId;
      }
      const response = await fetch(action.webhookUrl!, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': await stableGuid(key) },
        body: JSON.stringify({ event: 'pdf.ready', submissionId, formId, pdfUrl, recordId: record._id }),
      });
      if (!response.ok) throw new Error(`WEBHOOK_HTTP_${response.status}`);
      return String(response.status);
    });
    return { action: action.type, status: String(item?.status ?? 'processing') };
  }));
  if (results.some((result) => result.status === 'rejected')) throw new Error('DELIVERY_PARTIAL_FAILURE');
  return results.map((result) => (result as PromiseFulfilledResult<{ action: string; status: string }>).value);
}
