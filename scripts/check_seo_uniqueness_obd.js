const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const baseCodes = require(path.join(ROOT, 'src/data/base_codes.json'));
const generatedVehicleSpecs = require(path.join(ROOT, 'src/data/generated/vehicle-specs.json'));
const validRoutes = require(path.join(ROOT, 'src/data/valid_routes.json'));
const messages = require(path.join(ROOT, 'messages/en.json'));

const badChars = /\u00c3|\u00c4|\u00c5|\ufffd/;
const dbKeys = new Set(Object.keys(messages.DB || {}));
const failures = [];

function fail(message) {
  failures.push(message);
}

function normalized(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function getText(value, locale = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value[locale] || value.en || '';
}

function checkObdCodes() {
  const titleMap = new Map();
  const descriptionMap = new Map();

  for (const [code, data] of Object.entries(baseCodes)) {
    if (!/^[PCBU][0-9]{4}$/.test(code)) fail(`Invalid OBD code key: ${code}`);

    const title = getText(data.title);
    const description = getText(data.description);
    if (!title) fail(`${code} is missing title.`);
    if (!description) fail(`${code} is missing description.`);
    if (badChars.test(`${title} ${description}`)) fail(`${code} contains mojibake in title/description.`);
    if (title && !title.toUpperCase().includes(code) && normalized(title) === normalized(code)) fail(`${code} has weak title.`);

    const titleKey = normalized(title);
    if (titleKey) {
      if (!titleMap.has(titleKey)) titleMap.set(titleKey, []);
      titleMap.get(titleKey).push(code);
    }

    const descriptionKey = normalized(description);
    if (descriptionKey) {
      if (!descriptionMap.has(descriptionKey)) descriptionMap.set(descriptionKey, []);
      descriptionMap.get(descriptionKey).push(code);
    }

    for (const symptom of data.symptoms || []) {
      if (symptom.startsWith('symp_') && !dbKeys.has(symptom)) fail(`${code} references missing symptom token: ${symptom}`);
    }
    for (const cause of data.causes || []) {
      if (cause.startsWith('cause_') && !dbKeys.has(cause)) fail(`${code} references missing cause token: ${cause}`);
    }
  }

  for (const [title, codes] of titleMap.entries()) {
    if (codes.length > 1) fail(`Duplicate OBD title "${title}" on codes: ${codes.join(', ')}`);
  }

  for (const [description, codes] of descriptionMap.entries()) {
    if (codes.length > 8) fail(`Overused OBD description on ${codes.length} codes, first codes: ${codes.slice(0, 12).join(', ')}`);
  }
}

function isCompleteVehicleSpec(item) {
  const textFields = [
    item.make,
    item.model,
    item.displayName,
    item.generation,
    item.trim,
    item.slug,
    item.chassisCode,
    item.engineSummary,
    item.recommendedOil,
    item.oilCapacity,
    item.transmissionFluid,
  ];
  const arrayText = [
    ...(item.engineCodes || []),
    ...(item.commonProblems || []),
    ...(item.firstChecks || []),
  ];
  const joined = [...textFields, ...arrayText].join(' ').toLowerCase();
  const placeholderTerms = [
    'teknik profil',
    'technical profile technical profile',
    'pending profile',
    'data queue',
    'veri kuyru',
    'doldurulacak teknik alan',
    'engine code oil viscosity oil capacity',
  ];

  if (!Number.isInteger(Number(item.year))) return false;
  if (!item.make || !item.model || !item.slug) return false;
  if (!Array.isArray(item.engineCodes) || item.engineCodes.length === 0) return false;
  if (!item.recommendedOil || !item.oilCapacity || !item.transmissionFluid) return false;
  if (placeholderTerms.some(term => joined.includes(term))) return false;
  if (item.engineCodes.some(code => !code || code.toLowerCase().includes('technical profile') || code.toLowerCase().includes('teknik profil'))) return false;
  if (item.trim && item.recommendedOil.toLowerCase() === item.trim.toLowerCase()) return false;
  if (item.trim && item.oilCapacity.toLowerCase() === item.trim.toLowerCase()) return false;
  return true;
}

function vehicleTitleKey(item) {
  const engineCodes = (item.engineCodes || []).slice(0, 2).join('/').toLowerCase();
  const chassis = (item.chassisCode || item.generation || '').toLowerCase();
  const trimLabel = item.trim && item.trim !== 'technical-profile' ? item.trim.toLowerCase() : '';
  return [
    item.year,
    String(item.displayName || '').toLowerCase(),
    trimLabel,
    engineCodes,
    chassis,
  ].filter(Boolean).join('|');
}

function dedupeScore(item) {
  let score = 0;
  if (!String(item.slug || '').includes('technical-profile')) score += 50;
  if (item.trim && item.trim !== 'technical-profile') score += 30;
  if (item.model === item.slug || String(item.slug || '').startsWith(item.model)) score += 20;
  score += Math.min(10, (item.commonProblems || []).length);
  score += Math.min(10, (item.firstChecks || []).length);
  return score;
}

function checkVehicleSpecTitles() {
  const complete = generatedVehicleSpecs.filter(isCompleteVehicleSpec);
  const bestByTitle = new Map();

  for (const item of complete) {
    const key = vehicleTitleKey(item);
    const existing = bestByTitle.get(key);
    if (!existing || dedupeScore(item) > dedupeScore(existing)) {
      bestByTitle.set(key, item);
    }
  }

  const publicTitleMap = new Map();
  for (const item of bestByTitle.values()) {
    const title = vehicleTitleKey(item);
    const url = `${item.make}/${item.model}/${item.year}/${item.slug}`;
    if (!publicTitleMap.has(title)) publicTitleMap.set(title, []);
    publicTitleMap.get(title).push(url);
  }

  for (const [title, urls] of publicTitleMap.entries()) {
    if (urls.length > 1) fail(`Duplicate public vehicle spec title "${title}" on URLs: ${urls.join(', ')}`);
  }
}

function codeMetaTitle(locale, code, make, model) {
  if (locale === 'tr') return `${make} ${model} ${code} Arıza Kodu Teşhisi`;
  if (locale === 'de') return `${make} ${model} ${code} Fehlercode Diagnose`;
  if (locale === 'es') return `${make} ${model} ${code} diagnóstico OBD2`;
  if (locale === 'fr') return `${make} ${model} ${code} diagnostic OBD2`;
  return `${make} ${model} ${code} Diagnostic Guide`;
}

function normalizeCodeTitle(code, title, locale) {
  const cleaned = String(title || '')
    .replace(new RegExp(`^${code}\\s*[:-]?\\s*`, 'i'), '')
    .replace(/\bOBD2?\b\s*/gi, '')
    .replace(/\b(ariza|arıza|kodu|fehlercode|error code|codigo|código|code)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (cleaned) return cleaned;
  if (locale === 'tr') return 'detaylı';
  if (locale === 'de') return 'detaillierte';
  if (locale === 'es') return 'guía detallada';
  if (locale === 'fr') return 'guide détaillé';
  return 'detailed guide';
}

function codeH1(locale, code, make, model, title) {
  const cleanTitle = normalizeCodeTitle(code, title, locale);
  if (locale === 'tr') return `${make} ${model} ${code}: ${cleanTitle} arıza teşhisi`;
  if (locale === 'de') return `${make} ${model} ${code}: ${cleanTitle} Diagnose`;
  if (locale === 'es') return `${make} ${model} ${code}: diagnóstico de ${cleanTitle}`;
  if (locale === 'fr') return `${make} ${model} ${code} : diagnostic ${cleanTitle}`;
  return `${make} ${model} ${code}: ${cleanTitle} diagnosis`;
}

function titleCase(value) {
  return String(value).split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function fitSeoText(value, maxLength) {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 42 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

function checkVehicleCodeSeoUniqueness() {
  const locales = ['en', 'tr', 'de', 'es', 'fr'];
  const titleMap = new Map();
  const h1Map = new Map();
  const sampledCodes = Array.from(new Set([
    'P0230',
    'P0213',
    'P0420',
    'P0300',
    'P0171',
    'P0102',
    ...validRoutes.validCodes,
  ].filter(code => baseCodes[code])));

  for (const locale of locales) {
    for (const make of validRoutes.validMakes) {
      const models = validRoutes.validModels[make] || [];
      for (const model of models) {
        const capMake = titleCase(make);
        const capModel = titleCase(model);
        for (const code of sampledCodes) {
          const title = getText(baseCodes[code].title, locale) || code;
          const meta = fitSeoText(codeMetaTitle(locale, code, capMake, capModel), 52);
          const h1 = codeH1(locale, code, capMake, capModel, title);
          const url = `/${locale}/${make}/${model}/${code.toLowerCase()}`;
          const metaKey = normalized(meta);
          const h1Key = normalized(h1);
          if (!titleMap.has(metaKey)) titleMap.set(metaKey, []);
          if (!h1Map.has(h1Key)) h1Map.set(h1Key, []);
          titleMap.get(metaKey).push(url);
          h1Map.get(h1Key).push(url);
        }
      }
    }
  }

  for (const [title, urls] of titleMap.entries()) {
    if (urls.length > 1) fail(`Duplicate vehicle-code meta title "${title}" on URLs: ${urls.slice(0, 8).join(', ')}`);
  }
  for (const [h1, urls] of h1Map.entries()) {
    if (urls.length > 1) fail(`Duplicate vehicle-code H1 "${h1}" on URLs: ${urls.slice(0, 8).join(', ')}`);
  }
}

checkObdCodes();
checkVehicleSpecTitles();
checkVehicleCodeSeoUniqueness();

if (failures.length) {
  console.error('SEO uniqueness / OBD data check failed:');
  for (const message of failures.slice(0, 80)) console.error(`- ${message}`);
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more`);
  process.exit(1);
}

console.log('SEO uniqueness and OBD data checks passed.');
