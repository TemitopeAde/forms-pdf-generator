import { extensions } from '@wix/astro/builders';

const string = { type: 'string' } as const;
const object = { type: 'object', properties: {} } as const;
const tool = (methodName: string, displayName: string, description: string, properties: Record<string, unknown> = {}, required: string[] = []) => ({
  methodName, displayName, description, activated: true,
  requestSchema: { type: 'object', properties: ['saveTemplate', 'generatePdf', 'configureAutomation', 'setLanguage', 'deleteTemplate', 'createZip', 'getCheckoutLink', 'setDefaultTemplate'].includes(methodName) ? { ...properties, confirmed: { type: 'boolean', description: 'Set true only after the Wix user explicitly confirms this action.' } } : properties, required: ['saveTemplate', 'generatePdf', 'configureAutomation', 'setLanguage', 'deleteTemplate', 'createZip', 'getCheckoutLink', 'setDefaultTemplate'].includes(methodName) ? [...required, 'confirmed'] : required, additionalProperties: false },
  responseSchema: object,
});

export default extensions.appTools({
  id: '87c38e45-cd1a-44af-bf60-067cf9cc5975',
  name: 'forms-pdf-tools',
  tools: [
    tool('getSetupStatus', 'Get setup status', 'Check Wix Forms installation, setup progress, plan, usage, and PDF limits.'),
    tool('listForms', 'List Wix forms', 'List supported native Wix Forms available for PDF generation.'),
    tool('listSubmissions', 'List form submissions', 'List recent native Wix Form submissions, optionally for one form.', { formId: string }),
    tool('getSubmission', 'Get submission details', 'Get mapped answers, image and signature references, and generated PDF records.', { submissionId: string }, ['submissionId']),
    tool('listTemplates', 'List PDF templates', 'List saved PDF templates and starter templates.'),
    tool('saveTemplate', 'Save PDF template', 'Create or update a PDF template. Confirm changes with the user before invoking.', { template: { type: 'object' } }, ['template']),
    tool('duplicateTemplate', 'Duplicate PDF template', 'Create a copy of an existing PDF template.', { templateId: string }, ['templateId']),
    tool('deleteTemplate', 'Delete PDF template', 'Permanently delete a template if no forms use it. Confirm deletion with the user before invoking.', { templateId: string }, ['templateId']),
    tool('setDefaultTemplate', 'Set default PDF template', 'Set the template used when a form has no assigned template. Confirm with the user before invoking.', { templateId: string }, ['templateId']),
    tool('generatePdf', 'Generate submission PDF', 'Generate a PDF for a confirmed Wix Form submission. Confirm generation with the user before invoking.', { submissionId: string }, ['submissionId']),
    tool('getPdfDownload', 'Get PDF download link', 'Return a short-lived secure link for a previously generated PDF.', { recordId: string }, ['recordId']),
    tool('createZip', 'Create PDF ZIP export', 'Create a private ZIP from 1 to 5 previously generated PDFs. Confirm with the user before invoking.', { recordIds: { type: 'array', items: string, minItems: 1, maxItems: 5 } }, ['recordIds']),
    tool('getZipDownload', 'Get ZIP download link', 'Return a short-lived secure link for a completed PDF ZIP export.', { jobId: string }, ['jobId']),
    tool('configureAutomation', 'Configure form automation', 'Set the PDF template and automatic PDF generation for one form. Confirm changes with the user before invoking.', { formId: string, templateId: string, automatic: { type: 'boolean' } }, ['formId']),
    tool('listAutomationLogs', 'List automation logs', 'List recent form event processing results and errors.'),
    tool('getSettings', 'Get app settings', 'Get the selected dashboard language and app settings.'),
    tool('setLanguage', 'Set dashboard language', 'Set the dashboard language for this Wix app instance. Confirm with the user before invoking.', { locale: string }, ['locale']),
    tool('getBillingStatus', 'Get billing status', 'Get Wix billing plan and monthly PDF usage.'),
    tool('getCheckoutLink', 'Get Wix checkout link', 'Get a Wix-hosted checkout link for a configured paid plan. Confirm the purchase flow with the user before invoking.', { plan: { type: 'string', enum: ['pro', 'business'] } }, ['plan']),
  ],
});
