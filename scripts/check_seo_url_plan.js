const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PLAN_FILE = path.join(ROOT, 'src/data/generated/seo-url-plan.json');
const FOCUS_FILE = path.join(ROOT, 'src/data/generated/seo-focus-links.json');
const badChars = /\u00c3|\u00c4|\u00c5|\ufffd/;

function fail(message) {
  console.error(`SEO URL plan check failed: ${message}`);
  process.exitCode = 1;
}

function readJson(file) {
  if (!fs.existsSync(file)) {
    fail(`Missing file: ${path.relative(ROOT, file)}`);
    return null;
  }
  const raw = fs.readFileSync(file, 'utf8');
  if (badChars.test(raw)) fail(`${path.relative(ROOT, file)} contains mojibake characters.`);
  return JSON.parse(raw);
}

const plan = readJson(PLAN_FILE);
const focusLinks = readJson(FOCUS_FILE);

if (plan) {
  if (!plan.generatedAt) fail('seo-url-plan.json needs generatedAt.');
  if (!Number.isInteger(plan.totalUrls) || plan.totalUrls < 1000) fail('seo-url-plan.json totalUrls looks too small.');
  if (!Array.isArray(plan.topUrls) || plan.topUrls.length < 20) fail('seo-url-plan.json needs at least 20 focus URLs.');
  for (const row of plan.topUrls.slice(0, 80)) {
    if (!row.path || !row.path.startsWith('/')) fail('Every top URL needs a relative path.');
    if (!row.type) fail(`${row.path} needs a type.`);
    if (!Array.isArray(row.recommendedActions) || !row.recommendedActions.length) fail(`${row.path} needs recommended actions.`);
  }
}

if (focusLinks) {
  if (!Array.isArray(focusLinks) || focusLinks.length < 20) fail('seo-focus-links.json needs at least 20 links.');
  const seen = new Set();
  for (const link of focusLinks) {
    if (!link.href || !link.href.startsWith('/')) fail('Every focus link needs a relative href.');
    if (!link.title || link.title.length < 8) fail(`${link.href} needs a public title.`);
    if (seen.has(link.href)) fail(`Duplicate focus link: ${link.href}`);
    seen.add(link.href);
  }
}

if (!process.exitCode) {
  console.log('SEO URL plan checks passed.');
}
