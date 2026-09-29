import { toolsProvider } from '@wix/app-tools/service-plugins';
import { browseSubmissions, canUseFeature, configureForm, createExportZip, deleteTemplate, downloadExportZip, downloadPdf, duplicateTemplate, generateSubmissionPdf, getBillingStatus, getCheckoutUrl, getOverview, saveTemplate, setAppLocale, setDefaultTemplate, STARTER_TEMPLATES, submissionDetails } from '../../../../lib/forms-pdf/service';

function id(value: unknown, name: string): string {
  if (typeof value !== 'string' || !/^[\w-]{6,128}$/.test(value)) throw new Error(`${name}_INVALID`);
  return value;
}

function confirmed(payload: Record<string, unknown>): void {
  if (payload.confirmed !== true) throw new Error('CONFIRMATION_REQUIRED');
}

toolsProvider.provideHandlers({
  runTool: async ({ request, metadata }) => {
    if (!metadata.instanceId || metadata.identity?.identityType !== 'WIX_USER' || !metadata.identity.wixUserId) throw new Error('UNAUTHORIZED');
    const instanceId = id(metadata.instanceId, 'INSTANCE');
    const payload = request.payload ?? {};
    if (typeof payload !== 'object' || Array.isArray(payload)) throw new Error('PAYLOAD_INVALID');
    const method = request.methodName;
    if (method === 'getSetupStatus') {
      const overview = await getOverview(instanceId);
      return { response: { wixFormsInstalled: overview.context.installed, formCount: overview.forms.length, templateCount: overview.templates.length, activeAutomations: overview.formSettings.filter((item) => item.automatic).length, plan: overview.plan, usage: overview.usage, limits: { maxImages: 8, maxPages: 40, maxPdfBytes: 10_485_760 } } };
    }
    if (method === 'listForms') return { response: { forms: (await getOverview(instanceId)).forms } };
    if (method === 'listSubmissions') {
      const formId = payload.formId === undefined ? undefined : id(payload.formId, 'FORM_ID');
      return { response: await browseSubmissions(instanceId, formId) };
    }
    if (method === 'getSubmission') return { response: await submissionDetails(instanceId, id(payload.submissionId, 'SUBMISSION_ID')) };
    if (method === 'listTemplates') {
      const overview = await getOverview(instanceId);
      return { response: { templates: overview.templates, starterTemplates: STARTER_TEMPLATES } };
    }
    if (method === 'saveTemplate') {
      confirmed(payload);
      const template = payload.template;
      if (!template || typeof template !== 'object' || Array.isArray(template)) throw new Error('TEMPLATE_INVALID');
      const input = template as Record<string, unknown>;
      if (typeof input.name !== 'string' || input.name.trim().length === 0 || input.name.length > 100) throw new Error('TEMPLATE_NAME_INVALID');
      if (input.id !== undefined) id(input.id, 'TEMPLATE_ID');
      if (input.pageSize !== undefined && input.pageSize !== 'A4' && input.pageSize !== 'LETTER') throw new Error('PAGE_SIZE_INVALID');
      if (input.imageColumns !== undefined && ![1, 2, 3].includes(Number(input.imageColumns))) throw new Error('IMAGE_COLUMNS_INVALID');
      return { response: { template: await saveTemplate(instanceId, input as unknown as Parameters<typeof saveTemplate>[1]) } };
    }
    if (method === 'duplicateTemplate') return { response: { template: await duplicateTemplate(instanceId, id(payload.templateId, 'TEMPLATE_ID')) } };
    if (method === 'deleteTemplate') {
      confirmed(payload);
      return { response: await deleteTemplate(instanceId, id(payload.templateId, 'TEMPLATE_ID')) };
    }
    if (method === 'setDefaultTemplate') {
      confirmed(payload);
      return { response: { settings: await setDefaultTemplate(instanceId, id(payload.templateId, 'TEMPLATE_ID')) } };
    }
    if (method === 'generatePdf') {
      confirmed(payload);
      return { response: { record: await generateSubmissionPdf(instanceId, id(payload.submissionId, 'SUBMISSION_ID')) } };
    }
    if (method === 'getPdfDownload') {
      const url = await downloadPdf(instanceId, id(payload.recordId, 'RECORD_ID'));
      return { response: { url, expiresInMinutes: 5 } };
    }
    if (method === 'createZip') {
      confirmed(payload);
      if (!Array.isArray(payload.recordIds)) throw new Error('RECORD_IDS_INVALID');
      const recordIds = payload.recordIds.map((value: unknown) => id(value, 'RECORD_ID'));
      return { response: { job: await createExportZip(instanceId, recordIds) } };
    }
    if (method === 'getZipDownload') return { response: { url: await downloadExportZip(instanceId, id(payload.jobId, 'JOB_ID')), expiresInMinutes: 5 } };
    if (method === 'configureAutomation') {
      confirmed(payload);
      const formId = id(payload.formId, 'FORM_ID');
      const settings: { templateId?: string; automatic?: boolean } = {};
      if (payload.templateId !== undefined) settings.templateId = id(payload.templateId, 'TEMPLATE_ID');
      if (payload.automatic !== undefined) {
        if (typeof payload.automatic !== 'boolean') throw new Error('AUTOMATIC_INVALID');
        settings.automatic = payload.automatic;
      }
      if (!Object.keys(settings).length) throw new Error('SETTINGS_REQUIRED');
      return { response: { settings: await configureForm(instanceId, formId, settings) } };
    }
    if (method === 'listAutomationLogs') return { response: { logs: (await getOverview(instanceId)).logs } };
    if (method === 'getSettings') return { response: { settings: (await getOverview(instanceId)).settings } };
    if (method === 'setLanguage') {
      confirmed(payload);
      if (typeof payload.locale !== 'string') throw new Error('LOCALE_INVALID');
      return { response: { settings: await setAppLocale(instanceId, payload.locale) } };
    }
    if (method === 'getBillingStatus') {
      const status = await getBillingStatus(instanceId);
      return { response: { ...status, automationAvailable: canUseFeature(status.plan, 'automation') } };
    }
    if (method === 'getCheckoutLink') {
      confirmed(payload);
      if (payload.plan !== 'pro' && payload.plan !== 'business') throw new Error('PLAN_INVALID');
      return { response: { url: await getCheckoutUrl(payload.plan) } };
    }
    throw new Error('UNKNOWN_TOOL');
  },
});
