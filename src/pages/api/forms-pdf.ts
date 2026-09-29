import type { APIRoute } from 'astro';
import { auth } from '@wix/essentials';
import { browseSubmissions, configureForm, createExportZip, deleteTemplate, downloadExportZip, downloadPdf, duplicateTemplate, generateSubmissionPdf, getBillingStatus, getCheckoutUrl, getExportJob, getOverview, retryAutomation, saveTemplate, setAppLocale, setDefaultTemplate, submissionDetails } from '../../lib/forms-pdf/service';

function id(value: unknown): string {
  if (typeof value !== 'string' || !/^[\w-]{6,128}$/.test(value)) throw new Error('ID_INVALID');
  return value;
}

async function tenant() {
  const info = await auth.getTokenInfo();
  if (!info.active || info.subjectType !== 'USER' || !info.instanceId) throw new Error('UNAUTHORIZED');
  return info.instanceId;
}

function errorResponse(error: unknown) {
  const code = error instanceof Error ? error.message : 'UNKNOWN';
  return Response.json({ error: code }, { status: code === 'UNAUTHORIZED' ? 401 : 400 });
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const instanceId = await tenant();
    const url = new URL(request.url);
    const op = url.searchParams.get('op');
    if (op === 'overview') return Response.json(await getOverview(instanceId));
    if (op === 'submissions') return Response.json(await browseSubmissions(instanceId, url.searchParams.get('formId') || undefined));
    if (op === 'submission') {
      const id = url.searchParams.get('id');
      if (!id) throw new Error('SUBMISSION_ID_REQUIRED');
      return Response.json(await submissionDetails(instanceId, id));
    }
    if (op === 'download') {
      const recordId = id(url.searchParams.get('id'));
      return Response.json({ url: await downloadPdf(instanceId, recordId, url.searchParams.get('inline') === '1') });
    }
    if (op === 'zip-download') return Response.json({ url: await downloadExportZip(instanceId, id(url.searchParams.get('id'))) });
    if (op === 'zip-status') return Response.json(await getExportJob(instanceId, id(url.searchParams.get('id'))));
    if (op === 'billing') return Response.json(await getBillingStatus(instanceId));
    throw new Error('UNKNOWN_OPERATION');
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const instanceId = await tenant();
    const body = await request.json() as Record<string, unknown>;
    if (body.op === 'generate') return Response.json(await generateSubmissionPdf(instanceId, id(body.submissionId)));
    if (body.op === 'template' && body.template && typeof body.template === 'object') return Response.json(await saveTemplate(instanceId, body.template as Parameters<typeof saveTemplate>[1]));
    if (body.op === 'template-duplicate') return Response.json(await duplicateTemplate(instanceId, id(body.templateId), typeof body.name === 'string' ? body.name : undefined));
    if (body.op === 'template-delete') {
      if (body.confirmed !== true) throw new Error('CONFIRMATION_REQUIRED');
      return Response.json(await deleteTemplate(instanceId, id(body.templateId)));
    }
    if (body.op === 'template-default') return Response.json(await setDefaultTemplate(instanceId, id(body.templateId)));
    if (body.op === 'form' && body.settings && typeof body.settings === 'object') {
      const settings = body.settings as Record<string, unknown>;
      if ((settings.automatic === true || settings.delivery) && body.confirmed !== true) throw new Error('CONFIRMATION_REQUIRED');
      return Response.json(await configureForm(instanceId, id(body.formId), settings as Parameters<typeof configureForm>[2]));
    }
    if (body.op === 'locale' && typeof body.locale === 'string') return Response.json(await setAppLocale(instanceId, body.locale));
    if (body.op === 'zip') return Response.json(await createExportZip(instanceId, body.recordIds as string[]));
    if (body.op === 'retry' && (body.kind === 'event' || body.kind === 'action')) {
      if (body.confirmed !== true) throw new Error('CONFIRMATION_REQUIRED');
      return Response.json(await retryAutomation(instanceId, body.kind, id(body.id)));
    }
    if (body.op === 'checkout' && (body.plan === 'pro' || body.plan === 'business')) return Response.json({ url: await getCheckoutUrl(body.plan) });
    throw new Error('UNKNOWN_OPERATION');
  } catch (error) {
    return errorResponse(error);
  }
};
