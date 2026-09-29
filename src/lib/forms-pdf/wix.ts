import { appInstances } from '@wix/app-management';
import { forms, submissions } from '@wix/forms';
import { files } from '@wix/media';
import { auth } from '@wix/essentials';

export const NATIVE_FORMS_NAMESPACE = 'wix.form_app.form';

export async function getWixContext() {
  const getInstance = auth.elevate(appInstances.getAppInstance);
  const response = await getInstance();
  return {
    installed: response.site?.installedWixApps?.includes('wix_forms') ?? false,
    siteId: response.site?.siteId ?? '',
    ownerEmail: response.site?.ownerEmail ?? '',
    locale: response.site?.locale ?? 'en',
    planName: response.instance?.billing?.packageName ?? 'free',
    isFree: response.instance?.isFree ?? true,
  };
}

export async function listWixForms() {
  const list = auth.elevate(forms.listForms);
  const response = await list(NATIVE_FORMS_NAMESPACE, { paging: { limit: 100 } });
  return (response.forms ?? []).filter((form) => form.namespace === NATIVE_FORMS_NAMESPACE);
}

export async function getWixForm(formId: string) {
  const get = auth.elevate(forms.getForm);
  const form = await get(formId);
  if (form.namespace !== NATIVE_FORMS_NAMESPACE) throw new Error('NOT_NATIVE_WIX_FORM');
  return form;
}

export async function getWixSubmission(submissionId: string) {
  const get = auth.elevate(submissions.getSubmission);
  const submission = await get(submissionId);
  if (submission.namespace !== NATIVE_FORMS_NAMESPACE) throw new Error('NOT_NATIVE_WIX_SUBMISSION');
  return submission;
}

export async function listWixSubmissions(formId?: string, limit = 25) {
  const query = auth.elevate(submissions.querySubmissionsByNamespace);
  let builder = query().eq('namespace', NATIVE_FORMS_NAMESPACE);
  if (formId) builder = builder.eq('formId', formId);
  return await builder.descending('_createdDate').limit(Math.min(limit, 100)).find();
}

export async function resolveWixMedia(reference: string): Promise<{ bytes: Uint8Array; mimeType?: string } | null> {
  if (!reference.startsWith('wix:') && !/^[a-z0-9][a-z0-9_.~-]{5,180}$/i.test(reference)) return null;
  const getUrl = auth.elevate(files.generateFileDownloadUrl);
  const result = await getUrl(reference, { expirationInMinutes: 5 });
  const url = result.downloadUrls?.[0]?.url;
  if (!url) return null;
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') return null;
  const response = await fetch(url, { redirect: 'error' });
  if (!response.ok) return null;
  const size = Number(response.headers.get('content-length') ?? '0');
  if (size > 8 * 1024 * 1024) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
  return bytes.length <= 8 * 1024 * 1024 ? { bytes, mimeType: response.headers.get('content-type') ?? undefined } : null;
}

export async function uploadPrivateFile(bytes: Uint8Array, fileName: string, mimeType: 'application/pdf' | 'application/zip', ownerId?: string): Promise<string> {
  if (bytes.length > 10 * 1024 * 1024) throw new Error('FILE_SIZE_LIMIT');
  const generate = auth.elevate(files.generateFileUploadUrl);
  const { uploadUrl } = await generate(mimeType, { fileName, sizeInBytes: String(bytes.length), private: true,
    externalInfo: ownerId ? { origin: mimeType === 'application/pdf' ? 'forms-pdf-pdf' : 'forms-pdf-zip', externalIds: [ownerId] } : undefined });
  if (!uploadUrl) throw new Error('UPLOAD_URL_UNAVAILABLE');
  const response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': mimeType }, body: new Uint8Array(bytes).buffer, redirect: 'error' });
  if (!response.ok) throw new Error('FILE_UPLOAD_FAILED');
  const payload = await response.json() as Record<string, unknown>;
  const file = payload.file as Record<string, unknown> | undefined;
  const fileId = file?.id ?? file?.fileId ?? payload.fileId;
  if (typeof fileId !== 'string') throw new Error('FILE_UPLOAD_NO_FILE_ID');
  return fileId;
}

export const uploadPrivatePdf = (bytes: Uint8Array, fileName: string, recordId?: string) => uploadPrivateFile(bytes, fileName, 'application/pdf', recordId);

export async function getPrivateDownloadUrl(fileId: string, inline = false, expirationInMinutes = 5): Promise<string> {
  const getUrl = auth.elevate(files.generateFileDownloadUrl);
  const result = await getUrl(fileId, { expirationInMinutes, contentDisposition: inline ? 'INLINE' : 'ATTACHMENT' });
  const url = result.downloadUrls?.[0]?.url;
  if (!url) throw new Error('DOWNLOAD_URL_UNAVAILABLE');
  return url;
}

export async function readPrivateFile(fileId: string, maxBytes = 9 * 1024 * 1024): Promise<Uint8Array> {
  const url = await getPrivateDownloadUrl(fileId);
  if (new URL(url).protocol !== 'https:') throw new Error('FILE_URL_INVALID');
  const response = await fetch(url, { redirect: 'error' });
  if (!response.ok) throw new Error('FILE_DOWNLOAD_FAILED');
  if (Number(response.headers.get('content-length') ?? 0) > maxBytes) throw new Error('FILE_SIZE_LIMIT');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > maxBytes) throw new Error('FILE_SIZE_LIMIT');
  return bytes;
}
