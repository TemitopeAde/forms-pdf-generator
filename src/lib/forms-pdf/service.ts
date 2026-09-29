import { auth } from '@wix/essentials';
import { billing } from '@wix/app-management';
import { countItems, createItem, findOne, listItems, updateItem, claimUnique, removeItem } from './storage';
import { normalizeAnswers } from './normalize';
import { renderPdf, type PdfTemplateConfig } from './render-pdf';
import { getPrivateDownloadUrl, getWixContext, getWixForm, getWixSubmission, listWixForms, listWixSubmissions, readPrivateFile, resolveWixMedia, uploadPrivateFile, uploadPrivatePdf } from './wix';
import { makeZip } from './zip';
import { deliverPdf, validateDelivery } from './delivery';

export type Feature = 'pdf_generation' | 'bulk_pdf' | 'automation' | 'email_pdf' | 'webhooks' | 'remove_branding';
export type Plan = 'free' | 'pro' | 'business';

export const PLAN_LIMITS: Record<Plan, number> = { free: 25, pro: 1000, business: 10000 };
const FEATURE_PLANS: Record<Feature, Plan[]> = {
  pdf_generation: ['free', 'pro', 'business'],
  bulk_pdf: ['pro', 'business'],
  automation: ['pro', 'business'],
  email_pdf: ['pro', 'business'],
  webhooks: ['business'],
  remove_branding: ['pro', 'business'],
};

export function planFromWix(isFree: boolean, packageName: string): Plan {
  if (isFree) return 'free';
  if (packageName === import.meta.env.BUSINESS_PLAN_ID) return 'business';
  if (packageName === import.meta.env.PRO_PLAN_ID) return 'pro';
  return 'free';
}

export function canUseFeature(plan: Plan, feature: Feature): boolean {
  return FEATURE_PLANS[feature].includes(plan);
}

export async function getOverview(instanceId: string) {
  const context = await getWixContext();
  const plan = planFromWix(context.isFree, context.planName);
  if (!context.installed) {
    const settings = await findOne('app-settings', instanceId, 'instanceId', instanceId);
    return { context, plan, forms: [], recentSubmissions: [], formSettings: [], templates: [], pdfRecords: [], exportJobs: [], logs: [], actions: [], usage: 0, settings };
  }
  const [forms, recentSubmissions, formSettings, templates, pdfRecords, exportJobs, logs, actions, usage, settings] = await Promise.all([
    listWixForms(),
    listWixSubmissions(undefined, 10),
    listItems('form-settings', instanceId),
    listItems('pdf-templates', instanceId),
    listItems('pdf-records', instanceId),
    listItems('export-jobs', instanceId),
    listItems('processed-events', instanceId),
    listItems('automation-actions', instanceId),
    countItems('usage-records', instanceId, 'period', new Date().toISOString().slice(0, 7)),
    findOne('app-settings', instanceId, 'instanceId', instanceId),
  ]);
  return { context, plan, forms, recentSubmissions: recentSubmissions.items, formSettings, templates, pdfRecords, exportJobs, logs, actions, usage, settings };
}

export async function setAppLocale(instanceId: string, locale: string) {
  const allowed = ['en','es','fr','de','pt','it','nl','pl','sv','da','no','fi','ja','ko','zh-CN','zh-TW','ar','he','tr','id'];
  if (!allowed.includes(locale)) throw new Error('LOCALE_UNSUPPORTED');
  const existing = await findOne('app-settings', instanceId, 'instanceId', instanceId);
  return existing ? updateItem('app-settings', instanceId, existing._id, { locale }) : createItem('app-settings', instanceId, { locale });
}

export async function browseSubmissions(instanceId: string, formId?: string) {
  if (formId) await getWixForm(formId);
  const [result, records] = await Promise.all([listWixSubmissions(formId), listItems('pdf-records', instanceId)]);
  return { submissions: result.items, records };
}

export async function submissionDetails(instanceId: string, submissionId: string) {
  const submission = await getWixSubmission(submissionId);
  if (!submission.formId) throw new Error('FORM_ID_MISSING');
  const [form, records] = await Promise.all([getWixForm(submission.formId), listItems('pdf-records', instanceId)]);
  const answers = normalizeAnswers(form, submission);
  let mediaCount = 0;
  for (const answer of answers) {
    if (answer.kind !== 'image' && answer.kind !== 'signature') continue;
    for (const file of answer.files ?? []) {
      if (mediaCount++ >= 8) break;
      try {
        const url = await getPrivateDownloadUrl(file.reference, true);
        if (new URL(url).protocol === 'https:') (file as typeof file & { previewUrl?: string }).previewUrl = url;
      } catch { /* A missing or private file stays visible by name. */ }
    }
  }
  return { submission, form, answers, records: records.filter((item) => item.submissionId === submissionId) };
}

export const STARTER_TEMPLATES: PdfTemplateConfig[] = [
  { name: 'Minimal', pageSize: 'A4', imageColumns: 1 },
  { name: 'Professional', title: '{{formName}}', pageSize: 'LETTER', imageColumns: 2 },
  { name: 'Modern', pageSize: 'A4', imageColumns: 2 },
  { name: 'Legal / Agreement', pageSize: 'LETTER', imageColumns: 1, signatureWidth: 300 },
  { name: 'Photo Report', pageSize: 'A4', imageColumns: 2 },
  { name: 'Application', pageSize: 'LETTER', imageColumns: 1 },
  { name: 'Inspection Report', pageSize: 'A4', imageColumns: 3 },
];

export async function saveTemplate(instanceId: string, input: PdfTemplateConfig & { id?: string }) {
  if (!input.name?.trim()) throw new Error('TEMPLATE_NAME_REQUIRED');
  if (input.name.length > 100) throw new Error('TEMPLATE_NAME_TOO_LONG');
  if (input.pageSize && !['A4', 'LETTER'].includes(input.pageSize)) throw new Error('PAGE_SIZE_INVALID');
  if (input.imageColumns && ![1, 2, 3].includes(input.imageColumns)) throw new Error('IMAGE_COLUMNS_INVALID');
  if (input.signatureWidth && (input.signatureWidth < 60 || input.signatureWidth > 500)) throw new Error('SIGNATURE_WIDTH_INVALID');
  for (const value of [input.title, input.subtitle, input.footer]) if (value && value.length > 300) throw new Error('TEMPLATE_TEXT_TOO_LONG');
  const config: PdfTemplateConfig = {
    name: input.name.trim(), title: input.title, subtitle: input.subtitle, footer: input.footer,
    pageSize: input.pageSize ?? 'A4', imageColumns: input.imageColumns ?? 1,
    signatureWidth: input.signatureWidth, hideEmpty: input.hideEmpty,
    accent: input.accent && /^#[0-9a-fA-F]{6}$/.test(input.accent) ? input.accent : undefined,
  };
  if (input.id) {
    const existing = await findOne('pdf-templates', instanceId, '_id', input.id);
    if (!existing) throw new Error('TEMPLATE_NOT_FOUND');
    return await updateItem('pdf-templates', instanceId, input.id, { name: config.name, version: Number(existing.version ?? 0) + 1, config });
  }
  const context = await getWixContext();
  const plan = planFromWix(context.isFree, context.planName);
  if (plan === 'free' && await countItems('pdf-templates', instanceId) >= 1) throw new Error('TEMPLATE_PLAN_LIMIT');
  return await createItem('pdf-templates', instanceId, { name: config.name, version: 1, isDefault: false, config });
}

export async function duplicateTemplate(instanceId: string, templateId: string, newName?: string) {
  const existing = await findOne('pdf-templates', instanceId, '_id', templateId);
  if (!existing) throw new Error('TEMPLATE_NOT_FOUND');
  const config = existing.config as PdfTemplateConfig;
  return saveTemplate(instanceId, { ...config, name: newName?.trim() || `${config.name} copy` });
}

export async function deleteTemplate(instanceId: string, templateId: string) {
  const existing = await findOne('pdf-templates', instanceId, '_id', templateId);
  if (!existing) throw new Error('TEMPLATE_NOT_FOUND');
  const settings = await findOne('app-settings', instanceId, 'instanceId', instanceId);
  if (settings?.defaultTemplateId === templateId || await countItems('form-settings', instanceId, 'templateId', templateId) > 0) throw new Error('TEMPLATE_IN_USE');
  await removeItem('pdf-templates', instanceId, templateId);
  return { deleted: true };
}

export async function setDefaultTemplate(instanceId: string, templateId: string) {
  if (templateId !== 'starter-minimal' && !await findOne('pdf-templates', instanceId, '_id', templateId)) throw new Error('TEMPLATE_NOT_FOUND');
  const existing = await findOne('app-settings', instanceId, 'instanceId', instanceId);
  return existing ? updateItem('app-settings', instanceId, existing._id, { defaultTemplateId: templateId }) : createItem('app-settings', instanceId, { defaultTemplateId: templateId });
}

export async function configureForm(instanceId: string, formId: string, input: { templateId?: string; automatic?: boolean; configured?: boolean; delivery?: Record<string, unknown> }) {
  await getWixForm(formId);
  if (input.templateId && input.templateId !== 'starter-minimal' && !await findOne('pdf-templates', instanceId, '_id', input.templateId)) throw new Error('TEMPLATE_NOT_FOUND');
  if (input.automatic) {
    const context = await getWixContext();
    if (!canUseFeature(planFromWix(context.isFree, context.planName), 'automation')) throw new Error('PLAN_REQUIRED');
  }
  const delivery = input.delivery === undefined ? undefined : validateDelivery(input.delivery);
  if (delivery) {
    const context = await getWixContext();
    const plan = planFromWix(context.isFree, context.planName);
    if ((delivery.emailOwner || delivery.emailSubmitter || delivery.recipients?.length) && !canUseFeature(plan, 'email_pdf')) throw new Error('PLAN_REQUIRED');
    if (delivery.webhookUrl && !canUseFeature(plan, 'webhooks')) throw new Error('PLAN_REQUIRED');
  }
  const existing = await findOne('form-settings', instanceId, 'formId', formId);
  const data = { uniqueKey: `${instanceId}:${formId}`, formId, ...input, ...(delivery === undefined ? {} : { delivery }) };
  return existing ? updateItem('form-settings', instanceId, existing._id, data) : createItem('form-settings', instanceId, data);
}

export async function generateSubmissionPdf(instanceId: string, submissionId: string, mode: 'manual' | 'automatic' = 'manual') {
  const context = await getWixContext();
  const plan = planFromWix(context.isFree, context.planName);
  if (mode === 'automatic' && !canUseFeature(plan, 'automation')) throw new Error('PLAN_REQUIRED');
  const usagePeriod = new Date().toISOString().slice(0, 7);

  const submission = await getWixSubmission(submissionId);
  if (submission.status !== 'CONFIRMED') throw new Error('SUBMISSION_NOT_CONFIRMED');
  if (!submission.formId) throw new Error('FORM_ID_MISSING');
  const [form, formSettings, appSettings] = await Promise.all([
    getWixForm(submission.formId),
    findOne('form-settings', instanceId, 'formId', submission.formId),
    findOne('app-settings', instanceId, 'instanceId', instanceId),
  ]);
  const templateId = String(formSettings?.templateId ?? appSettings?.defaultTemplateId ?? 'starter-minimal');
  const templateRecord = templateId === 'starter-minimal' ? null : await findOne('pdf-templates', instanceId, '_id', templateId);
  const template = (templateRecord?.config as PdfTemplateConfig | undefined) ?? STARTER_TEMPLATES[0];
  const version = Number(templateRecord?.version ?? 1);
  const uniqueKey = `${instanceId}:${submissionId}:${templateId}:${version}`;
  const existing = await findOne('pdf-records', instanceId, 'uniqueKey', uniqueKey);
  if (existing && ['ready', 'uploading', 'processing'].includes(String(existing.status))) return existing;
  const usage = await countItems('usage-records', instanceId, 'period', usagePeriod);
  if (usage >= PLAN_LIMITS[plan]) throw new Error('MONTHLY_PDF_LIMIT');
  const claimed = existing ? await updateItem('pdf-records', instanceId, existing._id, { status: 'processing', errorCode: '' }) : await claimUnique('pdf-records', instanceId, uniqueKey, {
    formId: submission.formId, submissionId, templateId, templateVersion: version,
    status: 'processing', mode, usagePeriod, createdAt: new Date(),
  });
  if (!claimed) return await findOne('pdf-records', instanceId, 'uniqueKey', uniqueKey);

  try {
    const answers = normalizeAnswers(form, submission);
    const imageCount = answers.reduce((sum, answer) => sum + (answer.kind === 'image' || answer.kind === 'signature' ? answer.files?.length ?? 0 : 0), 0);
    if (imageCount > 8) throw new Error('IMAGE_LIMIT');
    const pdf = await renderPdf({
      formName: form.name || 'Form submission',
      submissionId, submittedAt: submission._createdDate?.toISOString(), answers, template,
      resolveFile: resolveWixMedia,
    });
    const fileId = await uploadPrivatePdf(pdf, `form-${submissionId}.pdf`, claimed._id);
    const current = await findOne('pdf-records', instanceId, '_id', claimed._id);
    const saved = current?.status === 'ready' ? current : await updateItem('pdf-records', instanceId, claimed._id, { status: 'uploading', fileId, errorCode: '' });
    return saved;
  } catch (error) {
    await updateItem('pdf-records', instanceId, claimed._id, { status: 'failed', errorCode: error instanceof Error ? error.message.slice(0, 100) : 'UNKNOWN' });
    throw error;
  }
}

export async function downloadPdf(instanceId: string, recordId: string, inline = false) {
  const record = await findOne('pdf-records', instanceId, '_id', recordId);
  if (!record || record.status !== 'ready' || typeof record.fileId !== 'string') throw new Error('PDF_NOT_READY');
  return await getPrivateDownloadUrl(record.fileId, inline);
}

export async function createExportZip(instanceId: string, recordIds: string[]) {
  if (!Array.isArray(recordIds) || recordIds.length < 1 || recordIds.length > 5 || new Set(recordIds).size !== recordIds.length) throw new Error('ZIP_SELECTION_INVALID');
  const context = await getWixContext();
  if (!canUseFeature(planFromWix(context.isFree, context.planName), 'bulk_pdf')) throw new Error('PLAN_REQUIRED');
  const records = await Promise.all(recordIds.map((id) => findOne('pdf-records', instanceId, '_id', id)));
  if (records.some((record) => !record || record.status !== 'ready' || typeof record.fileId !== 'string')) throw new Error('PDF_NOT_READY');
  const job = await createItem('export-jobs', instanceId, { status: 'processing', recordIds, createdAt: new Date() });
  try {
    const files = await Promise.all(records.map(async (record, index) => ({
      name: `submission-${index + 1}-${String(record!.submissionId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50)}.pdf`,
      bytes: await readPrivateFile(String(record!.fileId), 9 * 1024 * 1024),
    })));
    const zip = makeZip(files);
    const fileId = await uploadPrivateFile(zip, `forms-pdf-export-${job._id}.zip`, 'application/zip', job._id);
    const current = await findOne('export-jobs', instanceId, '_id', job._id);
    return current?.status === 'ready' ? current : updateItem('export-jobs', instanceId, job._id, { status: 'uploading', fileId });
  } catch (error) {
    await updateItem('export-jobs', instanceId, job._id, { status: 'failed', errorCode: error instanceof Error ? error.message.slice(0, 100) : 'UNKNOWN', completedAt: new Date() });
    throw error;
  }
}

export async function downloadExportZip(instanceId: string, jobId: string) {
  const job = await findOne('export-jobs', instanceId, '_id', jobId);
  if (!job || job.status !== 'ready' || typeof job.fileId !== 'string') throw new Error('ZIP_NOT_READY');
  return getPrivateDownloadUrl(job.fileId);
}

export async function getExportJob(instanceId: string, jobId: string) {
  const job = await findOne('export-jobs', instanceId, '_id', jobId);
  if (!job) throw new Error('ZIP_JOB_NOT_FOUND');
  return job;
}

export async function getBillingStatus(instanceId: string) {
  const context = await getWixContext();
  const plan = planFromWix(context.isFree, context.planName);
  const usage = await countItems('usage-records', instanceId, 'period', new Date().toISOString().slice(0, 7));
  return { plan, usage, monthlyLimit: PLAN_LIMITS[plan], proAvailable: Boolean(import.meta.env.PRO_PLAN_ID), businessAvailable: Boolean(import.meta.env.BUSINESS_PLAN_ID) };
}

export async function getCheckoutUrl(plan: 'pro' | 'business') {
  const productId = plan === 'pro' ? import.meta.env.PRO_PLAN_ID : import.meta.env.BUSINESS_PLAN_ID;
  if (!productId || !/^[\w-]{6,128}$/.test(productId)) throw new Error('BILLING_PLAN_NOT_CONFIGURED');
  const response = await auth.elevate(billing.getUrl)(productId);
  if (!response.checkoutUrl || new URL(response.checkoutUrl).protocol !== 'https:') throw new Error('CHECKOUT_URL_UNAVAILABLE');
  return response.checkoutUrl;
}

export async function processSubmissionEvent(event: unknown, type: 'created' | 'updated') {
  const token = await auth.getTokenInfo();
  if (!token.active || !token.instanceId) throw new Error('INSTANCE_MISSING');
  const instanceId = token.instanceId;
  const envelope = event as Record<string, any>;
  const eventId = String(envelope.id ?? envelope.metadata?.id ?? '');
  const entity = envelope.createdEvent?.entity ?? envelope.updatedEvent?.entity ?? envelope.entity;
  const submissionId = String(entity?.id ?? envelope.entityId ?? '');
  if (!eventId || !submissionId) throw new Error('EVENT_INVALID');
  const key = `${instanceId}:${eventId}`;
  let claimed = await claimUnique('processed-events', instanceId, key, {
    eventId, eventType: type, submissionId, formId: entity?.formId ?? '', status: 'processing', attemptCount: 1, receivedAt: new Date(),
  });
  if (!claimed) {
    const previous = await findOne('processed-events', instanceId, 'uniqueKey', key);
    if (!previous || previous.status !== 'failed') return;
    claimed = await updateItem('processed-events', instanceId, previous._id, { status: 'processing', attemptCount: Number(previous.attemptCount ?? 1) + 1, errorCode: '' });
  }
  try {
    const submission = entity?.namespace === 'wix.form_app.form' ? entity : await getWixSubmission(submissionId);
    if (submission.namespace !== 'wix.form_app.form' || submission.status !== 'CONFIRMED' || !submission.formId) {
      await updateItem('processed-events', instanceId, claimed._id, { status: 'skipped', processedAt: new Date() });
      return;
    }
    const settings = await findOne('form-settings', instanceId, 'formId', submission.formId);
    if (!settings?.automatic) {
      await updateItem('processed-events', instanceId, claimed._id, { status: 'skipped', processedAt: new Date() });
      return;
    }
    await generateSubmissionPdf(instanceId, submissionId, 'automatic');
    await updateItem('processed-events', instanceId, claimed._id, { status: 'completed', processedAt: new Date() });
  } catch (error) {
    await updateItem('processed-events', instanceId, claimed._id, { status: 'failed', errorCode: error instanceof Error ? error.message.slice(0, 100) : 'UNKNOWN', processedAt: new Date() });
    throw error;
  }
}

type MediaEvent = { data?: { file?: { _id?: string }; externalInfo?: { origin?: string; externalIds?: string[] }; error?: { code?: string } } };

async function mediaTarget(event: MediaEvent) {
  const info = event.data?.externalInfo;
  const origin = info?.origin;
  if (origin !== 'forms-pdf-pdf' && origin !== 'forms-pdf-zip') return null;
  const id = info?.externalIds?.[0];
  if (!id || !/^[\w-]{6,128}$/.test(id)) return null;
  const token = await auth.getTokenInfo();
  if (!token.active || !token.instanceId) throw new Error('INSTANCE_MISSING');
  const name = origin === 'forms-pdf-pdf' ? 'pdf-records' : 'export-jobs';
  const record = await findOne(name, token.instanceId, '_id', id);
  return record ? { instanceId: token.instanceId, name, record } : null;
}

export async function processMediaReady(event: MediaEvent) {
  const target = await mediaTarget(event);
  if (!target) return;
  const fileId = event.data?.file?._id;
  if (!fileId) throw new Error('MEDIA_FILE_ID_MISSING');
  const { instanceId, name, record } = target;
  if (record.fileId && record.fileId !== fileId) return;
  const ready = await updateItem(name, instanceId, record._id, { status: 'ready', fileId, errorCode: '', completedAt: new Date() });
  if (name !== 'pdf-records') return;
  const usagePeriod = typeof ready.usagePeriod === 'string' ? ready.usagePeriod : new Date().toISOString().slice(0, 7);
  await claimUnique('usage-records', instanceId, String(ready.uniqueKey), { period: usagePeriod, pdfCount: 1 });
  if (ready.mode !== 'automatic') return;
  const formSettings = await findOne('form-settings', instanceId, 'formId', String(ready.formId));
  if (!formSettings?.delivery) return;
  const delivery = validateDelivery(formSettings.delivery);
  const submission = await getWixSubmission(String(ready.submissionId));
  const form = await getWixForm(String(ready.formId));
  await deliverPdf({ instanceId, submissionId: String(ready.submissionId), formId: String(ready.formId), record: ready, answers: normalizeAnswers(form, submission), delivery });
}

export async function processMediaFailed(event: MediaEvent) {
  const target = await mediaTarget(event);
  if (!target) return;
  await updateItem(target.name, target.instanceId, target.record._id, { status: 'failed', errorCode: event.data?.error?.code?.slice(0, 100) || 'MEDIA_PROCESSING_FAILED', completedAt: new Date() });
}

export async function retryAutomation(instanceId: string, kind: 'event' | 'action', recordId: string) {
  if (kind === 'event') {
    const record = await findOne('processed-events', instanceId, '_id', recordId);
    if (!record || record.status !== 'failed') throw new Error('EVENT_NOT_RETRYABLE');
    await processSubmissionEvent({ id: record.eventId, entityId: record.submissionId }, record.eventType === 'updated' ? 'updated' : 'created');
    return await findOne('processed-events', instanceId, '_id', recordId);
  }
  const action = await findOne('automation-actions', instanceId, '_id', recordId);
  if (!action || action.status !== 'failed') throw new Error('ACTION_NOT_RETRYABLE');
  const pdfRecordId = String(action.actionType ?? '').split(':')[0];
  const pdf = await findOne('pdf-records', instanceId, '_id', pdfRecordId);
  if (!pdf || pdf.status !== 'ready' || typeof pdf.fileId !== 'string') throw new Error('PDF_NOT_READY');
  await processMediaReady({ data: { file: { _id: pdf.fileId }, externalInfo: { origin: 'forms-pdf-pdf', externalIds: [pdfRecordId] } } });
  return await findOne('automation-actions', instanceId, '_id', recordId);
}
