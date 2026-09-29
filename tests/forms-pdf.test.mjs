import test from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib';
import { normalizeAnswers } from '../src/lib/forms-pdf/normalize.ts';
import { renderPdf } from '../src/lib/forms-pdf/render-pdf.ts';
import { isSafeWebhookUrl, validateDelivery } from '../src/lib/forms-pdf/delivery-config.ts';

const png = new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==', 'base64'));

test('schema targets map to labels, images, and drawn signatures', () => {
  const form = { formFields: [
    { identifier: 'SHORT_ANSWER', inputOptions: { target: 'name_1', textInput: { label: 'Name' } } },
    { identifier: 'FILE_UPLOAD', inputOptions: { target: 'photo_1', inputType: 'WIX_FILE', fileInput: { label: 'Photo' } } },
    { identifier: 'SIGNATURE', inputOptions: { target: 'signature_1', inputType: 'WIX_FILE', fileInput: { label: 'Signature' } } },
  ] };
  const submission = { submissions: {
    name_1: 'Ada',
    photo_1: [{ fileId: 'image_abc123.png', displayName: 'headshot.png', fileType: 'image/png' }],
    signature_1: [{ fileId: 'image_sig123.png', displayName: 'signed.png', fileType: 'image/png' }],
  } };
  const answers = normalizeAnswers(form, submission);
  assert.deepEqual(answers.map((answer) => [answer.label, answer.kind]), [['Name', 'text'], ['Photo', 'image'], ['Signature', 'signature']]);
  assert.equal(answers[2].files[0].reference, 'image_sig123.png');
});

test('PDF embeds images and signatures and creates page breaks', async () => {
  const answers = [
    { target: 'empty', label: 'Optional answer', kind: 'text', text: '' },
    { target: 'image', label: 'Photo', kind: 'image', files: [{ reference: 'image-one', name: 'photo.png' }] },
    { target: 'signature', label: 'Signature', kind: 'signature', files: [{ reference: 'image-two', name: 'signed.png' }] },
    ...Array.from({ length: 80 }, (_, index) => ({ target: `text-${index}`, label: `Question ${index}`, kind: 'text', text: 'A moderately long answer that should wrap across several lines and pages.' })),
  ];
  const bytes = await renderPdf({ formName: 'Inspection', submissionId: 'sample', answers, template: { name: 'Test', title: '{{formName}}', pageSize: 'A4' }, resolveFile: async () => ({ bytes: png, mimeType: 'image/png' }) });
  const pdf = await PDFDocument.load(bytes);
  assert.ok(pdf.getPageCount() > 1);
  const xObjects = pdf.getPages()[0].node.Resources().lookup(PDFName.of('XObject'), PDFDict);
  assert.equal(xObjects.keys().length, 2);
});

test('delivery configuration rejects unsafe webhooks and excess recipients', () => {
  assert.equal(isSafeWebhookUrl('https://hooks.example.org/forms'), true);
  assert.equal(isSafeWebhookUrl('http://hooks.example.org/forms'), false);
  assert.equal(isSafeWebhookUrl('https://127.0.0.1/hook'), false);
  assert.throws(() => validateDelivery({ recipients: ['a@example.org', 'b@example.org', 'c@example.org'] }), /DELIVERY_RECIPIENTS_INVALID/);
  assert.throws(() => validateDelivery({ emailOwner: true, emailSubmitter: true, recipients: ['a@example.org'] }), /DELIVERY_RECIPIENT_LIMIT/);
});
