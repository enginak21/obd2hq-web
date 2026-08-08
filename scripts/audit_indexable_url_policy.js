const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const failures = [];
const locales = ['en', 'de', 'es', 'tr', 'fr'];

function fail(message) {
  failures.push(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

const validRoutes = readJson('src/data/valid_routes.json');
const gscOpportunities = readJson('src/data/generated/gsc-opportunities.json');
const baseCodes = readJson('src/data/base_codes.json');

const validCodeSet = new Set(validRoutes.validCodes.map((code) => code.toUpperCase()));
const editorialTargets = [
  ['ford', 'focus', 'P0213'],
  ['suzuki', 'jimny', 'P0235'],
  ['suzuki', 'jimny', 'P0203'],
  ['suzuki', 'jimny', 'P0204'],
  ['suzuki', 'jimny', 'P0234'],
  ['suzuki', 'jimny', 'P0201'],
  ['suzuki', 'jimny', 'P0243'],
  ['ford', 'fiesta', 'P0216'],
  ['ford', 'focus', 'P0103'],
  ['ford', 'ranger', 'P0110'],
  ['ford', 'f-150', 'P0251'],
  ['acura', 'tlx', 'P0102'],
  ['honda', 'cr-v', 'P0135'],
  ['lexus', 'is', 'P0125'],
  ['toyota', 'camry', 'P0420'],
  ['toyota', 'camry', 'P0300'],
  ['nissan', 'altima', 'P0420'],
  ['nissan', 'altima', 'P0300'],
  ['ford', 'f-150', 'P0420'],
  ['ford', 'f-150', 'P0300'],
  ['honda', 'civic', 'P0420'],
  ['honda', 'civic', 'P0300'],
];

const indexableVehicleTargets = new Set(editorialTargets.map(([make, model, code]) => `${make}/${model}/${code}`));
const vehicleCodePathPattern = /^https:\/\/www\.obd2hq\.com\/([a-z]{2})\/([^/]+)\/([^/]+)\/([pcbu][0-9a-f]{4})$/i;

for (const [code, entry] of Object.entries(baseCodes)) {
  if (!/^[PCBU][0-9A-F]{4}$/.test(code)) fail(`Invalid OBD code key: ${code}`);
  if (!entry.title || !entry.description) fail(`${code} is missing title or description.`);
  if (!validCodeSet.has(code)) fail(`${code} exists in base_codes.json but is missing from valid_routes.json.`);
}

for (const opportunity of gscOpportunities) {
  const pathOnly = opportunity.targetUrl || '';
  const parts = pathOnly.split('/').filter(Boolean);
  if (parts.length === 4 && /^[a-z]{2}$/.test(parts[0]) && /^[pcbu][0-9a-f]{4}$/i.test(parts[3])) {
    const key = `${parts[1]}/${parts[2]}/${parts[3].toUpperCase()}`;
    if (!indexableVehicleTargets.has(key)) {
      fail(`GSC opportunity must not promote non-editorial vehicle code page: ${pathOnly}`);
    }
  }
}

const sitemapRoute = fs.readFileSync(path.join(ROOT, 'src/app/sitemaps/[id]/route.ts'), 'utf8');
if (!sitemapRoute.includes('getIndexableVehicleCodeTargets()')) {
  fail('Sitemap route must use getIndexableVehicleCodeTargets for vehicle code URLs.');
}
if (sitemapRoute.includes('validRoutes.validCodes') && sitemapRoute.includes('${car.make}/${model}/${code.toLowerCase()}')) {
  fail('Sitemap route appears to generate vehicle code URLs from the full make/model/code matrix.');
}

for (const target of indexableVehicleTargets) {
  const [make, model, code] = target.split('/');
  if (!validRoutes.validMakes.includes(make)) fail(`Indexable target has invalid make: ${target}`);
  const models = validRoutes.validModels[make] || [];
  if (!models.includes(model)) fail(`Indexable target has invalid model: ${target}`);
  if (!validCodeSet.has(code)) fail(`Indexable target has invalid code: ${target}`);
}

for (const locale of locales) {
  for (const target of indexableVehicleTargets) {
    const [make, model, code] = target.split('/');
    const url = `https://www.obd2hq.com/${locale}/${make}/${model}/${code.toLowerCase()}`;
    const match = url.match(vehicleCodePathPattern);
    if (!match) fail(`Indexable vehicle URL does not match canonical pattern: ${url}`);
  }
}

if (failures.length) {
  console.error('Indexable URL policy audit failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Indexable URL policy audit passed: ${indexableVehicleTargets.size} editorial vehicle-code targets, ${validCodeSet.size} code hubs.`);
