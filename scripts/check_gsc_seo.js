const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OPPORTUNITIES_FILE = path.join(ROOT, 'src/data/generated/gsc-opportunities.json');
const badChars = /Ã|Ä|Å|�/;
const validIntents = new Set(['code_only', 'make_code', 'warning_light_model_year', 'warning_light_make', 'mixed_error', 'unknown']);
const validPriorities = new Set(['critical', 'high', 'medium', 'low']);
const validStatuses = new Set(['tracked', 'planned', 'published', 'needs_review']);

function fail(message) {
  console.error(`GSC SEO check failed: ${message}`);
  process.exitCode = 1;
}

function assertRouteExists(relativePath) {
  if (!fs.existsSync(path.join(ROOT, relativePath))) {
    fail(`Missing route or file: ${relativePath}`);
  }
}

if (!fs.existsSync(OPPORTUNITIES_FILE)) {
  fail('src/data/generated/gsc-opportunities.json is missing.');
} else {
  const raw = fs.readFileSync(OPPORTUNITIES_FILE, 'utf8');
  if (badChars.test(raw)) fail('gsc-opportunities.json contains mojibake characters.');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) fail('gsc-opportunities.json must be an array.');
  const seen = new Set();
  for (const row of data) {
    if (!row.query || typeof row.query !== 'string') fail('Every opportunity needs a query.');
    if (!row.targetUrl || typeof row.targetUrl !== 'string' || !row.targetUrl.startsWith('/')) fail(`${row.query} has invalid targetUrl.`);
    if (!validIntents.has(row.intentType)) fail(`${row.query} has invalid intentType.`);
    if (!validPriorities.has(row.priority)) fail(`${row.query} has invalid priority.`);
    if (!validStatuses.has(row.status)) fail(`${row.query} has invalid status.`);
    if (seen.has(row.query)) fail(`Duplicate query: ${row.query}`);
    seen.add(row.query);
  }
}

assertRouteExists('src/app/[locale]/codes/[code]/page.tsx');
assertRouteExists('src/app/[locale]/kodlar/[code]/page.tsx');
assertRouteExists('src/app/[locale]/codigos/[code]/page.tsx');
assertRouteExists('src/app/[locale]/[make]/warning-lights/page.tsx');
assertRouteExists('src/app/[locale]/[make]/uyari-isiklari/page.tsx');
assertRouteExists('src/app/[locale]/[make]/warnleuchten/page.tsx');
assertRouteExists('src/app/[locale]/[make]/luces-tablero/page.tsx');
assertRouteExists('src/app/[locale]/[make]/voyants-tableau-bord/page.tsx');

if (!process.exitCode) {
  console.log('GSC SEO checks passed.');
}
