import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import ts from 'typescript';

const source = readFileSync(resolve(import.meta.dirname, '../src/lib/forms-pdf/zip.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { makeZip } = await import(`data:text/javascript,${encodeURIComponent(code)}`);

test('ZIP stores PDFs with valid central directory and contents', () => {
  const bytes = makeZip([
    { name: 'one.pdf', bytes: new TextEncoder().encode('%PDF-1.7 one') },
    { name: 'two.pdf', bytes: new TextEncoder().encode('%PDF-1.7 two') },
  ]);
  const path = join(mkdtempSync(join(tmpdir(), 'forms-pdf-zip-')), 'sample.zip');
  writeFileSync(path, bytes);
  const result = execFileSync('unzip', ['-t', path], { encoding: 'utf8' });
  assert.match(result, /No errors detected/);
});

test('ZIP rejects oversized and unsafe selections', () => {
  assert.throws(() => makeZip([]), /ZIP_FILE_COUNT_LIMIT/);
  assert.throws(() => makeZip([{ name: '../bad.pdf', bytes: new Uint8Array() }]), /ZIP_FILENAME_INVALID/);
});
