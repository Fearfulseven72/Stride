import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const compiled = ts.transpileModule(readFileSync(new URL('../components/JournalHistory.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleObject = { exports: {} };
vm.runInNewContext(compiled, { require: createRequire(import.meta.url), module: moduleObject, exports: moduleObject.exports });
const JournalHistory = moduleObject.exports.default;
const render = notes => renderToStaticMarkup(React.createElement(JournalHistory, { notes, today: '2026-10-22' }));

test('archives only non-empty previous reflections, newest first', () => {
  const html = render({ '2026-10-20': 'older reflection', '2026-10-21': 'newer reflection', '2026-10-22': 'today excluded', '2026-10-23': 'future excluded', '2026-10-19': '  ', invalid: 'invalid excluded' });
  assert.ok(html.indexOf('newer reflection') < html.indexOf('older reflection'));
  for (const text of ['today excluded', 'future excluded', 'invalid excluded']) assert.ok(!html.includes(text));
  assert.ok(html.includes('2 entries'));
});
test('renders a helpful empty archive without inventing entries', () => {
  assert.ok(render({}).includes('Today’s reflection will appear here tomorrow.'));
});
test('escapes journal content instead of rendering HTML', () => {
  const html = render({ '2026-10-21': '<script>alert(1)</script>' });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});
