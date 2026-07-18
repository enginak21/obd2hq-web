/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const CONTENT_FILE = path.join('src', 'data', 'generated', 'symptom-content', 'content.json');
const ROUTES_FILE = path.join('src', 'data', 'generated', 'symptom-content', 'routes.json');
const LOCALES = ['en', 'tr', 'de', 'es', 'fr'];
const BASE_PATHS = {
  en: 'car-symptoms',
  tr: 'ariza-belirtileri',
  de: 'auto-symptome',
  es: 'sintomas-coche',
  fr: 'symptomes-voiture',
};
const mojibakePattern = /\u00c3|\u00c2|\u00e2\u20ac|\ufffd|Ã|Â|â€™|â€œ|â€|�/;
const dangerousClaims = [
  'kesin arıza',
  'definitely replace',
  'always replace',
  'garanti çözüm',
  '100% fix',
  'certainly the part',
];
const localeSlugBlocklist = {
  es: ['tiemblar', 'apagon', 'sacudidas-causas-revision'],
};

function fail(message) {
  failures.push(message);
}

function words(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function slugOk(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function textOf(value) {
  return JSON.stringify(value || '');
}

const failures = [];
if (!fs.existsSync(CONTENT_FILE)) {
  fail(`${CONTENT_FILE}: missing content file`);
} else {
  const groups = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
  const routes = fs.existsSync(ROUTES_FILE) ? JSON.parse(fs.readFileSync(ROUTES_FILE, 'utf8')) : [];
  if (!fs.existsSync(ROUTES_FILE)) fail(`${ROUTES_FILE}: missing route map`);
  const routeIds = new Set(routes.map(route => route.contentGroupId));
  const ids = new Set();
  const localizedSlugs = new Set();
  const titles = new Set();

  for (const group of groups) {
    if (!group.contentGroupId) fail('group missing contentGroupId');
    if (ids.has(group.contentGroupId)) fail(`${group.contentGroupId}: duplicate contentGroupId`);
    ids.add(group.contentGroupId);

    if (group.status === 'published') {
      if (!routeIds.has(group.contentGroupId)) fail(`${group.contentGroupId}: missing from route map`);
      if (Number(group.qualityScore || 0) < 80) fail(`${group.contentGroupId}: published qualityScore below 80`);
      for (const locale of LOCALES) {
        const item = group.locales?.[locale];
        if (!item) {
          fail(`${group.contentGroupId}: missing locale ${locale}`);
          continue;
        }

        const routeKey = `${locale}/${BASE_PATHS[locale]}/${item.slug}`;
        if (localizedSlugs.has(routeKey)) fail(`${group.contentGroupId}: duplicate slug ${routeKey}`);
        localizedSlugs.add(routeKey);

        if (!slugOk(item.slug)) fail(`${group.contentGroupId}/${locale}: invalid slug ${item.slug}`);
        for (const blocked of localeSlugBlocklist[locale] || []) {
          if (item.slug.includes(blocked)) fail(`${group.contentGroupId}/${locale}: unnatural localized slug "${item.slug}"`);
        }
        if (!item.title || words(item.title) < 4) fail(`${group.contentGroupId}/${locale}: weak title`);
        if (!item.metaDescription || item.metaDescription.length < 80 || item.metaDescription.length > 180) fail(`${group.contentGroupId}/${locale}: meta description length should be 80-180`);
        if (!item.intro || words(item.intro) < 35) fail(`${group.contentGroupId}/${locale}: intro too short`);
        if (!Array.isArray(item.likelyCauses) || item.likelyCauses.length < 5) fail(`${group.contentGroupId}/${locale}: needs at least 5 likely causes`);
        if (!Array.isArray(item.diagnosticSteps) || item.diagnosticSteps.length < 6) fail(`${group.contentGroupId}/${locale}: needs at least 6 diagnostic steps`);
        if (!Array.isArray(item.firstChecks) || item.firstChecks.length < 3) fail(`${group.contentGroupId}/${locale}: needs at least 3 first checks`);
        if (!Array.isArray(item.commonMistakes) || item.commonMistakes.length < 3) fail(`${group.contentGroupId}/${locale}: needs at least 3 common mistakes`);
        if (!Array.isArray(item.relatedCodes) || item.relatedCodes.length < 3) fail(`${group.contentGroupId}/${locale}: needs at least 3 related codes`);
        if (!Array.isArray(item.internalLinks) || item.internalLinks.length < 3) fail(`${group.contentGroupId}/${locale}: needs at least 3 internal links`);
        if (!Array.isArray(item.faq) || item.faq.length < 3) fail(`${group.contentGroupId}/${locale}: needs at least 3 FAQ items`);
        if (!item.schemaTitle || !item.schemaDescription) fail(`${group.contentGroupId}/${locale}: missing schema fields`);

        const titleKey = `${locale}:${item.title.toLowerCase()}`;
        if (titles.has(titleKey)) fail(`${group.contentGroupId}/${locale}: duplicate title`);
        titles.add(titleKey);

        const text = textOf(item);
        if (mojibakePattern.test(text)) fail(`${group.contentGroupId}/${locale}: contains mojibake markers`);
        const lower = text.toLowerCase();
        for (const phrase of dangerousClaims) {
          if (lower.includes(phrase)) fail(`${group.contentGroupId}/${locale}: unsafe absolute claim "${phrase}"`);
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Symptom content quality checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Symptom content quality checks passed.');
