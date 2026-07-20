const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const baseCodes = require(path.join(ROOT, 'src/data/base_codes.json'));
const generatedVehicleSpecs = require(path.join(ROOT, 'src/data/generated/vehicle-specs.json'));
const messages = require(path.join(ROOT, 'messages/en.json'));

const badChars = /Ã|Ä|Å|�/;
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

checkObdCodes();
checkVehicleSpecTitles();

if (failures.length) {
  console.error('SEO uniqueness / OBD data check failed:');
  for (const message of failures.slice(0, 80)) console.error(`- ${message}`);
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more`);
  process.exit(1);
}

console.log('SEO uniqueness and OBD data checks passed.');
