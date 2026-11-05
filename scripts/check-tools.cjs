const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/data/tools.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const registry = { exports: {} };
new Function('exports', 'module', compiled)(registry.exports, registry);
const { tools, toolCategories } = registry.exports;
const ids = new Set();
const routes = new Set();
const categories = new Set(toolCategories.map(category => category.key));
const pagesDirectory = path.join(root, 'src/pages/tools');
for (const tool of tools) {
  assert(!ids.has(tool.id), `Duplicate tool ID: ${tool.id}`);
  assert(!routes.has(tool.to), `Duplicate tool route: ${tool.to}`);
  assert.equal(tool.to, `/tools/${tool.id}`, `Route does not match ID: ${tool.id}`);
  assert(categories.has(tool.category) && tool.category !== 'all', `Unknown category: ${tool.category}`);
  assert(tool.name.trim() && tool.description.trim(), `Missing tool metadata: ${tool.id}`);
  const page = path.join(pagesDirectory, `${tool.id}.tsx`);
  assert(fs.existsSync(page), `Missing tool page: ${tool.id}`);
  const pageSource = fs.readFileSync(page, 'utf8');
  const layouts = [...pageSource.matchAll(/<ToolLayout\b\s+toolId="([^"]+)"/g)];
  assert(layouts.length > 0, `Missing shared ToolLayout: ${tool.id}`);
  assert(layouts.every(match => match[1] === tool.id), `Wrong tool ID in page: ${tool.id}`);
  ids.add(tool.id);
  routes.add(tool.to);
}
for (const filename of fs.readdirSync(pagesDirectory)) {
  if (filename.endsWith('.tsx')) {
    assert(ids.has(filename.slice(0, -4)), `Unregistered tool page: ${filename}`);
  }
}
console.log(`Validated ${tools.length} tools: metadata, routes, pages, and layouts.`);
