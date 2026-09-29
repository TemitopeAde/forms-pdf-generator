import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { NormalizedAnswer } from './normalize';

export interface PdfTemplateConfig {
  name: string;
  title?: string;
  subtitle?: string;
  footer?: string;
  pageSize?: 'A4' | 'LETTER';
  imageColumns?: 1 | 2 | 3;
  signatureWidth?: number;
  hideEmpty?: boolean;
  accent?: string;
}

export interface PdfInput {
  formName: string;
  submissionId: string;
  submittedAt?: string;
  answers: NormalizedAnswer[];
  template: PdfTemplateConfig;
  resolveFile: (reference: string) => Promise<{ bytes: Uint8Array; mimeType?: string } | null>;
}

const PAGE_SIZES = { A4: [595.28, 841.89], LETTER: [612, 792] } as const;
const MAX_MEDIA_BYTES = 8 * 1024 * 1024;
const MAX_PAGES = 40;

function safeLatin(value: string): string {
  // The standard PDF font supports only WinAnsi. Fail clearly instead of corrupting data.
  if (/[^\u000A\u0020-\u00FF]/u.test(value)) throw new Error('PDF_UNSUPPORTED_SCRIPT');
  return value;
}

function wrappedLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const result: string[] = [];
  for (const paragraph of safeLatin(text).split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
      else {
        if (line) result.push(line);
        line = word;
      }
    }
    result.push(line);
  }
  return result;
}

export async function renderPdf(input: PdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const [width, height] = PAGE_SIZES[input.template.pageSize ?? 'A4'];
  const margin = 44;
  let page: PDFPage;
  let y = 0;

  const addPage = () => {
    if (pdf.getPageCount() >= MAX_PAGES) throw new Error('PDF_PAGE_LIMIT');
    page = pdf.addPage([width, height]);
    y = height - margin;
    page.drawText(safeLatin(input.template.title || input.formName), { x: margin, y, size: 17, font: bold, color: rgb(0.08, 0.15, 0.22) });
    y -= 22;
    if (input.template.subtitle) {
      page.drawText(safeLatin(input.template.subtitle), { x: margin, y, size: 10, font, color: rgb(0.35, 0.4, 0.45) });
      y -= 18;
    }
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: rgb(0.8, 0.84, 0.87) });
    y -= 24;
  };

  const ensureSpace = (needed: number) => { if (y - needed < margin + 24) addPage(); };
  addPage();
  for (const answer of input.answers) {
    if (input.template.hideEmpty && !answer.text && !answer.files?.length) continue;
    ensureSpace(42);
    page!.drawText(safeLatin(answer.label), { x: margin, y, size: 10, font: bold, color: rgb(0.13, 0.2, 0.27) });
    y -= 17;
    if (answer.kind === 'text') {
      for (const line of wrappedLines(answer.text || '—', font, 10, width - margin * 2)) {
        ensureSpace(15);
        page!.drawText(line || ' ', { x: margin, y, size: 10, font, color: rgb(0.22, 0.27, 0.31) });
        y -= 15;
      }
    } else {
      const files = answer.files ?? [];
      for (const file of files) {
        if (answer.kind === 'file') {
          ensureSpace(16);
          page!.drawText(safeLatin(file.name), { x: margin, y, size: 10, font });
          y -= 16;
          continue;
        }
        {
          const media = await input.resolveFile(file.reference);
          if (!media || media.bytes.length > MAX_MEDIA_BYTES) throw new Error('MEDIA_UNAVAILABLE');
          const bytes = media.bytes;
          const isPng = bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
          const isJpg = bytes[0] === 255 && bytes[1] === 216;
          if (!isPng && !isJpg) throw new Error('IMAGE_FORMAT_UNSUPPORTED');
          const image = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
          const maxWidth = answer.kind === 'signature' ? Math.min(input.template.signatureWidth ?? 230, width - margin * 2) : (width - margin * 2) / (input.template.imageColumns ?? 1);
          const maxHeight = answer.kind === 'signature' ? 95 : 250;
          const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
          const imageHeight = image.height * scale;
          ensureSpace(imageHeight + 8);
          page!.drawImage(image, { x: margin, y: y - imageHeight, width: image.width * scale, height: imageHeight });
          y -= imageHeight + 8;
        }
      }
    }
    y -= 16;
  }
  for (const [index, current] of pdf.getPages().entries()) {
    const footer = `${input.template.footer || ''}  ${index + 1} / ${pdf.getPageCount()}`.trim();
    current.drawText(safeLatin(footer), { x: margin, y: 26, size: 8, font, color: rgb(0.4, 0.45, 0.5) });
  }
  return pdf.save();
}
