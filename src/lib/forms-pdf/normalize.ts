export type AnswerKind = 'text' | 'image' | 'signature' | 'file';

export interface NormalizedAnswer {
  target: string;
  label: string;
  kind: AnswerKind;
  text?: string;
  files?: Array<{ reference: string; name: string; mimeType?: string; size?: number }>;
}

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as UnknownRecord : null;
}

function displayText(value: unknown): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(displayText).filter(Boolean).join(', ');
  const object = record(value);
  if (object) return Object.entries(object).map(([key, item]) => `${key}: ${displayText(item)}`).join('; ');
  return '';
}

function labelFromField(field: UnknownRecord): string | undefined {
  const input = record(field.inputOptions);
  if (!input) return undefined;
  const options = Object.values(input).map(record).filter((item): item is UnknownRecord => item !== null);
  for (const option of options) {
    for (const component of Object.values(option).map(record).filter((item): item is UnknownRecord => item !== null)) {
      const label = component.label;
      if (typeof label === 'string' && label.trim()) return label.trim();
      const labelObject = record(label);
      if (labelObject && typeof labelObject.text === 'string') return labelObject.text;
    }
  }
  return typeof field.identifier === 'string' ? field.identifier.replace(/_/g, ' ').toLowerCase() : undefined;
}

function fileEntries(value: unknown): NonNullable<NormalizedAnswer['files']> {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((item) => {
    if (typeof item === 'string' && item.trim()) return [{ reference: item, name: item.split('/').pop()?.split('?')[0] || 'Attachment' }];
    const object = record(item);
    if (!object) return [];
    const reference = [object.fileId, object.url, object.fileUrl, object.src].find((part) => typeof part === 'string');
    if (typeof reference !== 'string') return [];
    return [{
      reference,
      name: String(object.displayName ?? object.fileName ?? object.name ?? reference.split('/').pop()?.split('?')[0] ?? 'Attachment'),
      mimeType: typeof object.fileType === 'string' ? object.fileType : typeof object.mimeType === 'string' ? object.mimeType : undefined,
      size: typeof object.size === 'number' ? object.size : undefined,
    }];
  });
}

export function normalizeAnswers(form: unknown, submission: unknown): NormalizedAnswer[] {
  const formRecord = record(form) ?? {};
  const submissionRecord = record(submission) ?? {};
  const rawValues = record(submissionRecord.submissions) ?? {};
  const fields = Array.isArray(formRecord.formFields) ? formRecord.formFields.map(record).filter((field): field is UnknownRecord => field !== null) : [];
  const byTarget = new Map<string, UnknownRecord>();
  for (const field of fields) {
    const target = record(field.inputOptions)?.target;
    if (typeof target === 'string') byTarget.set(target, field);
  }

  return Object.entries(rawValues).map(([target, value]) => {
    const field = byTarget.get(target);
    const input = record(field?.inputOptions);
    const identifier = typeof field?.identifier === 'string' ? field.identifier.toUpperCase() : '';
    const label = field ? labelFromField(field) : undefined;
    const safeLabel = label || 'Unlabeled answer';
    if (input?.inputType === 'WIX_FILE') {
      const files = fileEntries(value);
      const kind: AnswerKind = identifier.includes('SIGNATURE') ? 'signature' : files.some((file) => file.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name)) ? 'image' : 'file';
      return { target, label: safeLabel, kind, files };
    }
    return { target, label: safeLabel, kind: 'text', text: displayText(value) };
  });
}
