import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const extraSource = readFileSync(resolve(root, 'src/i18n/extra.ts'), 'utf8');
const extraCompiled = ts.transpileModule(extraSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const extraUrl = `data:text/javascript;base64,${Buffer.from(extraCompiled).toString('base64')}`;
const { extraKeys } = await import(extraUrl);
const messagesSource = readFileSync(resolve(root, 'src/i18n/messages.ts'), 'utf8');
const compiled = ts.transpileModule(messagesSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText.replace("from './extra'", `from '${extraUrl}'`);
const { keys, localeNames, translate, validateCatalogs } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('all dashboard labels exist in every supported language', () => {
  assert.equal(Object.keys(localeNames).length, 20);
  assert.deepEqual(validateCatalogs(), []);
  for (const locale of Object.keys(localeNames)) {
    for (const key of [...keys, ...extraKeys]) assert.ok(translate(locale, key).trim(), `${locale}.${key}`);
  }
});

test('dashboard has no literal user-facing JSX text or accessibility labels', () => {
  const filename = resolve(root, 'src/extensions/dashboard/pages/my-page/my-page.tsx');
  const source = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const violations = [];
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const value = node.text.trim();
      if (value && !/^[\d/·:—…]+$/u.test(value)) violations.push(`JSX text: ${value}`);
    }
    if (ts.isJsxAttribute(node) && ['aria-label', 'alt', 'placeholder', 'title'].includes(node.name.text) && node.initializer && ts.isStringLiteral(node.initializer)) {
      violations.push(`${node.name.text}: ${node.initializer.text}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.deepEqual(violations, []);
});
