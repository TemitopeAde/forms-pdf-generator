export interface DeliveryConfig {
  emailOwner?: boolean;
  emailSubmitter?: boolean;
  recipients?: string[];
  webhookUrl?: string;
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDelivery(input: unknown): DeliveryConfig {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('DELIVERY_INVALID');
  const data = input as Record<string, unknown>;
  const allowed = ['emailOwner', 'emailSubmitter', 'recipients', 'webhookUrl'];
  if (Object.keys(data).some((key) => !allowed.includes(key))) throw new Error('DELIVERY_FIELD_INVALID');
  if (data.emailOwner !== undefined && typeof data.emailOwner !== 'boolean') throw new Error('DELIVERY_OWNER_INVALID');
  if (data.emailSubmitter !== undefined && typeof data.emailSubmitter !== 'boolean') throw new Error('DELIVERY_SUBMITTER_INVALID');
  if (data.recipients !== undefined && (!Array.isArray(data.recipients) || data.recipients.length > 2 || data.recipients.some((email) => typeof email !== 'string' || !emailPattern.test(email) || email.length > 254))) throw new Error('DELIVERY_RECIPIENTS_INVALID');
  if (Number(data.emailOwner === true) + Number(data.emailSubmitter === true) + (Array.isArray(data.recipients) ? data.recipients.length : 0) > 2) throw new Error('DELIVERY_RECIPIENT_LIMIT');
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
