const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const baseCodes = require(path.join(ROOT, 'src/data/base_codes.json'));
const validRoutes = require(path.join(ROOT, 'src/data/valid_routes.json'));
const roadmap = require(path.join(ROOT, 'src/data/obd-expansion-roadmap.json'));

function getText(value, locale = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value[locale] || value.en || '';
}

function getSystem(code) {
  if (code.startsWith('C')) return 'chassis';
  if (code.startsWith('B')) return 'body';
  if (code.startsWith('U')) return 'network';
  if (/^P01(0|1|2|3)/.test(code)) return 'sensor';
  if (/^P02(0|1|2|6|7|8|9)/.test(code)) return 'injector';
  if (/^P02(3|4|5)/.test(code)) return 'fuel';
  if (/^P03/.test(code)) return 'misfire';
  if (/^P04(0|1|2|3)/.test(code)) return 'emissions';
  if (/^P04(4|5)/.test(code)) return 'evap';
  if (/^P05|^P06/.test(code)) return 'control';
  if (/^P07|^P08/.test(code)) return 'transmission';
  return 'powertrain';
}

function isRawGoldReady(code, data) {
  const description = getText(data.description);
  return Boolean(
    getText(data.title) &&
    description.length >= 180 &&
    Array.isArray(data.symptoms) &&
    data.symptoms.length >= 5 &&
    Array.isArray(data.causes) &&
    data.causes.length >= 5 &&
    data.fixDifficulty &&
    data.estimatedCost
  );
}

const codes = Object.keys(baseCodes).sort();
const families = { P: 0, C: 0, B: 0, U: 0, other: 0 };
const systems = {};
const runtimeGoldFallbackNeeded = [];
const invalidCodes = [];

for (const code of codes) {
  if (!/^[PCBU][0-9A-F]{4}$/.test(code)) invalidCodes.push(code);
  families[code[0]] = (families[code[0]] || 0) + 1;
  const system = getSystem(code);
  systems[system] = (systems[system] || 0) + 1;
  if (!isRawGoldReady(code, baseCodes[code])) runtimeGoldFallbackNeeded.push(code);
}

const report = {
  generatedAt: new Date().toISOString(),
  totalCodes: codes.length,
  sitemapKnownCodes: validRoutes.validCodes.length,
  families,
  missingFamilies: ['P', 'C', 'B', 'U'].filter(prefix => !families[prefix]),
  systems,
  invalidCodes,
  rawGoldReady: codes.length - runtimeGoldFallbackNeeded.length,
  runtimeGoldFallbackNeeded: runtimeGoldFallbackNeeded.length,
  runtimeGoldFallbackSample: runtimeGoldFallbackNeeded.slice(0, 40),
  expansionRoadmap: roadmap,
  recommendation: [
    'Runtime Gold fallback now prevents thin code pages for existing records.',
    'Next data-expansion phase should add verified C, B and U code families, then enrich raw records so fallback use trends toward zero.',
    'Sitemap should continue exposing only indexable, canonical pages with working hreflang.',
  ],
};

const outDir = path.join(ROOT, 'reports/seo');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'obd-gold-coverage.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report, null, 2));
