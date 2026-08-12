const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.obd2hq.com';
const REPORT_DIR = path.join(ROOT, 'reports/seo');
const LOCALES = new Set(['en', 'de', 'es', 'tr', 'fr']);

const rawBaseCodes = require(path.join(ROOT, 'src/data/base_codes.json'));
const verifiedDtcGold = require(path.join(ROOT, 'src/data/verified_dtc_gold.json'));
const verifiedDtcGoldBatch02 = require(path.join(ROOT, 'src/data/verified_dtc_gold_batch02.json'));
const baseCodes = { ...rawBaseCodes, ...verifiedDtcGold, ...verifiedDtcGoldBatch02 };
const validRoutes = require(path.join(ROOT, 'src/data/valid_routes.json'));
const gscOpportunities = require(path.join(ROOT, 'src/data/generated/gsc-opportunities.json'));
const vehicleSpecs = require(path.join(ROOT, 'src/data/generated/vehicle-specs.json'));

fs.mkdirSync(REPORT_DIR, { recursive: true });

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function writeCsv(fileName, rows, columns) {
  const content = [
    columns.join(','),
    ...rows.map(row => columns.map(column => escapeCsv(row[column])).join(',')),
  ].join('\n');
  fs.writeFileSync(path.join(REPORT_DIR, fileName), `${content}\n`);
}

function getText(value, locale = 'en') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value[locale] || value.en || '';
}

function isRawGoldReady(code, data) {
  const description = getText(data.description);
  return Boolean(
    /^[PCBU][0-9A-F]{4}$/.test(code) &&
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

function codeSystem(code) {
  const upper = code.toUpperCase();
  if (upper.startsWith('C')) return 'chassis';
  if (upper.startsWith('B')) return 'body';
  if (upper.startsWith('U')) return 'network';
  if (/^P02(3|4)|^P22|^P25/.test(upper)) return 'turbo_fuel';
  if (/^P02(0|1|2|6|7|8|9)/.test(upper)) return 'injector';
  if (/^P03/.test(upper)) return 'misfire';
  if (/^P04/.test(upper)) return 'emissions';
  if (/^P07|^P08/.test(upper)) return 'transmission';
  if (/^P01/.test(upper)) return 'sensor';
  return 'powertrain';
}

function getCylinderFromCode(code) {
  const upper = code.toUpperCase();
  const p02Injector = upper.match(/^P02(\d{2})$/);
  if (!p02Injector) return null;
  const suffix = Number(p02Injector[1]);
  if (suffix >= 1 && suffix <= 12) return suffix;
  if (suffix >= 61 && suffix <= 72) return suffix - 60;
  if (suffix >= 81 && suffix <= 92) return suffix - 80;
  return null;
}

function vehicleDtcValidity(make, model, code) {
  const lowerVehicle = `${make} ${model}`.toLowerCase();
  const system = codeSystem(code);
  const cylinder = getCylinderFromCode(code);
  const electricOnlyModels = ['leaf', 'bolt', 'model-3', 'model-s', 'model-x', 'model-y', 'ioniq-5', 'id-4'];
  const likelyFourCylinderModels = ['focus', 'jimny', 'camry', 'civic', 'cr-v', 'altima', 'fiesta', 'tlx'];

  if (electricOnlyModels.some(name => lowerVehicle.includes(name)) && ['misfire', 'emissions', 'injector', 'turbo_fuel'].includes(system)) {
    return { status: 'INVALID', reason: 'Combustion-system DTC on an electric-only vehicle profile.' };
  }

  if (cylinder && cylinder > 4 && likelyFourCylinderModels.some(name => lowerVehicle.includes(name))) {
    return { status: 'INVALID', reason: `Cylinder ${cylinder} DTC does not fit the likely cylinder count for this model family.` };
  }

  if (system === 'turbo_fuel' && ['jimny', 'f-150', 'ranger', 'focus', 'fiesta'].some(name => lowerVehicle.includes(name))) {
    return { status: 'VALID', reason: 'Editorial recovery target or plausible market-specific turbo/fuel-system diagnostic intent.' };
  }

  return { status: 'VALID', reason: 'No physical incompatibility detected by current validation rules.' };
}

function loadEditorialTargets() {
  const content = fs.readFileSync(path.join(ROOT, 'src/data/indexing-policy.ts'), 'utf8');
  const matches = [...content.matchAll(/\{\s*make:\s*'([^']+)',\s*model:\s*'([^']+)',\s*code:\s*'([^']+)'/g)];
  return new Set(matches.map(match => `${match[1]}/${match[2]}/${match[3].toUpperCase()}`));
}

const editorialTargets = loadEditorialTargets();
const rawGoldCodes = new Set(Object.entries(baseCodes).filter(([code, data]) => isRawGoldReady(code, data)).map(([code]) => code));
const validCodeSet = new Set(validRoutes.validCodes.map(code => code.toUpperCase()));
const gscByTarget = new Map();
const gscByCode = new Map();

for (const row of gscOpportunities) {
  const target = row.targetUrl || '';
  if (!gscByTarget.has(target)) gscByTarget.set(target, []);
  gscByTarget.get(target).push(row);
  for (const match of row.query.toUpperCase().matchAll(/\b[PCBU][0-9A-F]{4}\b/g)) {
    const code = match[0];
    if (!gscByCode.has(code)) gscByCode.set(code, []);
    gscByCode.get(code).push(row);
  }
}

function locs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

async function getSitemapUrls() {
  const index = await fetchText(`${BASE_URL}/sitemap.xml`);
  const sitemapUrls = locs(index);
  const urls = [];
  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    for (const url of locs(xml)) urls.push(url);
  }
  return urls;
}

function pageTypeFromPath(parts) {
  if (['privacy', 'terms', 'disclaimer', 'contact', 'about', 'editorial-policy', 'reviewers', 'search'].includes(parts[1])) return 'utility';
  if (parts.length === 2) return parts[1] === 'search' ? 'utility' : 'locale_hub';
  if (['codes', 'kodlar', 'codigos'].includes(parts[1]) && /^[pcbu][0-9a-f]{4}$/i.test(parts[2] || '')) return 'code_hub';
  if (parts[1] === 'vehicles') return parts.length >= 5 ? 'vehicle_spec' : 'vehicle_hub';
  if (parts[1] === 'blog') return parts.length > 2 ? 'blog_post' : 'blog_hub';
  if (parts[1] === 'news') return parts.length > 2 ? 'news_detail' : 'news_hub';
  if (parts.length === 4 && /^[pcbu][0-9a-f]{4}$/i.test(parts[3])) return 'vehicle_code';
  if (parts.length === 4 && parts[3] === 'lights') return 'model_warning_lights';
  if (parts.length === 3 && parts[2] === 'warning-lights') return 'brand_warning_lights';
  if (['symptoms', 'ariza-belirtileri', 'auto-symptome', 'sintomas-coche', 'symptomes-voiture'].includes(parts[1])) return parts.length > 2 ? 'symptom_detail' : 'symptom_hub';
  if (['car-problem-finder', 'ariza-bulucu', 'auto-problemfinder', 'buscador-fallas', 'trouver-panne'].includes(parts[1])) return parts.length > 2 ? 'problem_finder_detail' : 'problem_finder_hub';
  if (parts.length === 2 || parts.length === 3) return 'make_model_hub';
  return 'other';
}

function scoreVehicleSpec(parts) {
  const [, , make, model, year, slug] = parts;
  const item = vehicleSpecs.find(record => (
    String(record.make) === make &&
    String(record.model) === model &&
    String(record.year) === year &&
    String(record.slug) === slug
  ));
  if (!item) return { score: 45, classification: 'THIN', reason: 'Vehicle spec URL has no matching local generated spec record.' };
  let score = 45;
  const checks = [];
  if (Array.isArray(item.engineCodes) && item.engineCodes.length) { score += 12; checks.push('engine code'); }
  if (item.recommendedOil) { score += 10; checks.push('oil viscosity'); }
  if (item.oilCapacity) { score += 10; checks.push('oil capacity'); }
  if (item.transmissionFluid) { score += 8; checks.push('transmission fluid'); }
  if (Array.isArray(item.commonProblems) && item.commonProblems.length >= 2) { score += 8; checks.push('common problems'); }
  if (Array.isArray(item.firstChecks) && item.firstChecks.length >= 2) { score += 7; checks.push('first checks'); }
  const classification = score >= 85 ? 'GOLD' : score >= 70 ? 'SILVER' : 'THIN';
  return { score, classification, reason: `Vehicle spec data includes: ${checks.join(', ') || 'limited fields'}.` };
}

function classifyUrl(url) {
  const parsed = new URL(url);
  const parts = parsed.pathname.split('/').filter(Boolean);
  const language = parts[0] || '';
  const pageType = pageTypeFromPath(parts);
  const relative = parsed.pathname;

  if (parsed.origin !== BASE_URL) {
    return { page_type: pageType, language, quality_score: 0, classification: 'INVALID', indexable: 'no', reason: 'Non-canonical origin.', recommended_action: 'Fix canonical origin before indexing.' };
  }
  if (!LOCALES.has(language)) {
    return { page_type: pageType, language, quality_score: 0, classification: 'INVALID', indexable: 'no', reason: 'Unsupported locale.', recommended_action: 'Remove from sitemap or route to supported locale.' };
  }
  if (pageType === 'utility') {
    return { page_type: pageType, language, quality_score: 60, classification: 'UTILITY', indexable: 'no', reason: 'Useful for trust/legal/navigation but not a ranking target.', recommended_action: 'Keep crawlable; do not treat as recovery landing page.' };
  }
  if (pageType === 'code_hub') {
    const code = parts[2].toUpperCase();
    if (!validCodeSet.has(code)) return { page_type: pageType, language, quality_score: 0, classification: 'INVALID', indexable: 'no', reason: 'Unknown OBD code.', recommended_action: 'Remove from sitemap.' };
    const hasGsc = Boolean(gscByCode.get(code)?.length);
    const isGold = rawGoldCodes.has(code);
    const score = (isGold ? 82 : 62) + (hasGsc ? 8 : 0);
    const classification = score >= 85 ? 'GOLD' : score >= 70 ? 'SILVER' : 'THIN';
    return {
      page_type: pageType,
      language,
      quality_score: score,
      classification,
      indexable: score >= 70 ? 'yes' : 'review',
      reason: isGold ? 'Raw OBD record is gold-ready.' : 'Runtime fallback supports the page, but raw code data is not gold-ready yet.',
      recommended_action: isGold ? 'Keep in sitemap and strengthen internal links.' : 'Prioritize raw gold enrichment before relying on this page for index growth.',
    };
  }
  if (pageType === 'vehicle_code') {
    const [, make, model, codeRaw] = parts;
    const code = codeRaw.toUpperCase();
    const key = `${make}/${model}/${code}`;
    const isRawGold = rawGoldCodes.has(code);
    const validity = vehicleDtcValidity(make, model, code);
    const hasGsc = Boolean(gscByTarget.get(relative)?.length);
    const score = editorialTargets.has(key) && validity.status === 'VALID' && isRawGold ? 86 + (hasGsc ? 6 : 0) : validity.status === 'INVALID' ? 20 : 58;
    return {
      page_type: pageType,
      language,
      quality_score: score,
      classification: validity.status === 'INVALID' ? 'INVALID' : score >= 85 ? 'GOLD' : score >= 70 ? 'SILVER' : 'THIN',
      indexable: validity.status === 'INVALID' ? 'no' : score >= 70 ? 'yes' : 'review',
      reason: isRawGold ? validity.reason : `${validity.reason} Raw DTC record is not Gold-ready; hold vehicle-code indexing.`,
      recommended_action: score >= 70 ? 'Keep as recovery target; add verified vehicle-specific information only.' : 'Keep crawlable via canonical code hub path only after raw DTC Gold upgrade.',
    };
  }
  if (pageType === 'vehicle_spec') {
    const result = scoreVehicleSpec(parts);
    return {
      page_type: pageType,
      language,
      quality_score: result.score,
      classification: result.classification,
      indexable: result.score >= 70 ? 'yes' : 'review',
      reason: result.reason,
      recommended_action: result.score >= 70 ? 'Keep in quality sitemap candidate.' : 'Enrich or remove from sitemap candidate until complete.',
    };
  }
  if (pageType === 'news_detail') {
    return { page_type: pageType, language, quality_score: 45, classification: 'UTILITY', indexable: 'no', reason: 'News detail pages are intentionally noindex/source-context content.', recommended_action: 'Keep out of sitemap.' };
  }
  if (['symptom_detail', 'problem_finder_detail', 'brand_warning_lights', 'model_warning_lights', 'blog_post'].includes(pageType)) {
    const hasGsc = Boolean(gscByTarget.get(relative)?.length);
    const score = 78 + (hasGsc ? 8 : 0);
    return { page_type: pageType, language, quality_score: score, classification: score >= 85 ? 'GOLD' : 'SILVER', indexable: 'yes', reason: 'Editorial diagnostic intent with localized content path.', recommended_action: 'Keep; strengthen if GSC shows impressions without clicks.' };
  }
  if (['make_model_hub', 'vehicle_hub', 'symptom_hub', 'problem_finder_hub', 'news_hub', 'blog_hub', 'locale_hub'].includes(pageType)) {
    return { page_type: pageType, language, quality_score: 74, classification: 'SILVER', indexable: 'yes', reason: 'Hub page supports discovery and internal linking.', recommended_action: 'Keep; improve internal links to recovery targets.' };
  }
  return { page_type: pageType, language, quality_score: 65, classification: 'THIN', indexable: 'review', reason: 'Unclassified or low-signal page type.', recommended_action: 'Review manually before adding more similar URLs.' };
}

function recoveryPriorityRows() {
  return gscOpportunities
    .slice()
    .sort((a, b) => (
      b.clicks - a.clicks ||
      (a.position ?? 999) - (b.position ?? 999) ||
      b.impressions - a.impressions
    ))
    .slice(0, 100)
    .map((row, index) => ({
      rank: index + 1,
      query: row.query,
      targetUrl: row.targetUrl,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position ?? '',
      priority: row.priority,
      recommendedAction: row.recommendedAction,
    }));
}

async function main() {
  const urls = await getSitemapUrls();
  const qualityRows = urls.map(url => {
    const result = classifyUrl(url);
    return {
      URL: url,
      page_type: result.page_type,
      language: result.language,
      quality_score: result.quality_score,
      classification: result.classification,
      indexable: result.indexable,
      in_sitemap: 'yes',
      reason: result.reason,
      recommended_action: result.recommended_action,
    };
  });

  const vehicleTargets = [];
  for (const key of editorialTargets) {
    const [make, model, code] = key.split('/');
    if (!rawGoldCodes.has(code)) continue;
    for (const locale of LOCALES) {
      const validity = vehicleDtcValidity(make, model, code);
      vehicleTargets.push({
        URL: `${BASE_URL}/${locale}/${make}/${model}/${code.toLowerCase()}`,
        make,
        model,
        code,
        language: locale,
        validation: validity.status,
        reason: validity.reason,
        recommended_action: validity.status === 'VALID' ? 'Keep as recovery vehicle-DTC target.' : 'Remove from sitemap candidate and route to code hub until verified.',
      });
    }
  }

  const fallbackRows = Object.entries(baseCodes).map(([code, data]) => {
    const isGold = rawGoldCodes.has(code);
    const gscRows = gscByCode.get(code) || [];
    const description = getText(data.description);
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms.length : 0;
    const causes = Array.isArray(data.causes) ? data.causes.length : 0;
    const score = (isGold ? 82 : 58) + Math.min(10, gscRows.reduce((sum, row) => sum + row.impressions, 0) / 20);
    return {
      code,
      raw_gold: isGold ? 'yes' : 'no',
      runtime_fallback_needed: isGold ? 'no' : 'yes',
      quality_score: Math.round(score),
      similarity_risk: isGold ? 'low' : description.length < 180 || symptoms < 5 || causes < 5 ? 'high' : 'medium',
      gsc_impressions: gscRows.reduce((sum, row) => sum + row.impressions, 0),
      gsc_clicks: gscRows.reduce((sum, row) => sum + row.clicks, 0),
      recommended_action: isGold ? 'Use as gold code hub source.' : 'Upgrade raw record before treating as high-confidence index target.',
    };
  });

  const top100Rows = recoveryPriorityRows();

  writeCsv('SEO_INDEX_QUALITY.csv', qualityRows, ['URL', 'page_type', 'language', 'quality_score', 'classification', 'indexable', 'in_sitemap', 'reason', 'recommended_action']);
  writeCsv('VEHICLE_DTC_VALIDATION.csv', vehicleTargets, ['URL', 'make', 'model', 'code', 'language', 'validation', 'reason', 'recommended_action']);
  writeCsv('OBD_FALLBACK_SIMILARITY.csv', fallbackRows, ['code', 'raw_gold', 'runtime_fallback_needed', 'quality_score', 'similarity_risk', 'gsc_impressions', 'gsc_clicks', 'recommended_action']);
  writeCsv('GSC_TOP_100_RECOVERY.csv', top100Rows, ['rank', 'query', 'targetUrl', 'clicks', 'impressions', 'ctr', 'position', 'priority', 'recommendedAction']);

  const counts = qualityRows.reduce((acc, row) => {
    acc.total += 1;
    acc[row.classification] = (acc[row.classification] || 0) + 1;
    if (row.indexable === 'yes') acc.indexQualityPass += 1;
    else acc.indexQualityFail += 1;
    return acc;
  }, { total: 0, indexQualityPass: 0, indexQualityFail: 0 });

  const fallbackSummary = fallbackRows.reduce((acc, row) => {
    acc.total += 1;
    if (row.raw_gold === 'yes') acc.rawGold += 1;
    if (row.runtime_fallback_needed === 'yes') acc.fallback += 1;
    if (row.similarity_risk === 'high') acc.highSimilarityRisk += 1;
    if (row.gsc_impressions > 0) acc.withImpressions += 1;
    if (row.gsc_clicks > 0) acc.withClicks += 1;
    return acc;
  }, { total: 0, rawGold: 0, fallback: 0, highSimilarityRisk: 0, withImpressions: 0, withClicks: 0 });

  const vehicleSummary = vehicleTargets.reduce((acc, row) => {
    acc.total += 1;
    acc[row.validation] = (acc[row.validation] || 0) + 1;
    return acc;
  }, { total: 0 });

  const report = `# OBD2HQ Recovery Implementation Report

Generated: ${new Date().toISOString()}

## Recovery Scope

This implementation adds recovery guards and quality reporting without bulk-removing, noindexing, redirecting or deleting URLs. Canonical host remains locked to ${BASE_URL}.

## Before vs After

| Metric | Before | After / Current |
|---|---:|---:|
| Sitemap URLs | 27,370 observed in live sitemap | ${counts.total} audited |
| Index quality pass candidates | unknown | ${counts.indexQualityPass} |
| Index quality fail/review candidates | unknown | ${counts.indexQualityFail} |
| Gold URLs | unknown | ${counts.GOLD || 0} |
| Silver URLs | unknown | ${counts.SILVER || 0} |
| Thin URLs | unknown | ${counts.THIN || 0} |
| Duplicate URLs | unknown | ${counts.DUPLICATE || 0} |
| Invalid URLs | unknown | ${counts.INVALID || 0} |
| Utility/no-ranking URLs | unknown | ${counts.UTILITY || 0} |
| OBD codes | 2,223 | ${fallbackSummary.total} audited |
| Raw-gold OBD codes | 376 | ${fallbackSummary.rawGold} |
| Runtime fallback OBD codes | 1,847 | ${fallbackSummary.fallback} |
| Fallback high similarity risk | unknown | ${fallbackSummary.highSimilarityRisk} |
| Fallback codes with GSC impressions | unknown | ${fallbackSummary.withImpressions} |
| Fallback codes with GSC clicks | unknown | ${fallbackSummary.withClicks} |
| Vehicle + DTC URLs | 110 | ${vehicleSummary.total} audited |
| Vehicle + DTC valid | unknown | ${vehicleSummary.VALID || 0} |
| Vehicle + DTC unknown | unknown | ${vehicleSummary.UNKNOWN || 0} |
| Vehicle + DTC invalid | unknown | ${vehicleSummary.INVALID || 0} |

## Generated Files

- reports/seo/SEO_INDEX_QUALITY.csv
- reports/seo/VEHICLE_DTC_VALIDATION.csv
- reports/seo/OBD_FALLBACK_SIMILARITY.csv
- reports/seo/GSC_TOP_100_RECOVERY.csv

## Production Changes Made

- Added canonical/domain freeze regression script.
- Added sitemap URL quality classification report.
- Added OBD fallback similarity report.
- Added vehicle-DTC applicability validation report.
- Added Top 100 GSC recovery prioritization report.
- Added recovery monitor snapshot input data.

## Safe Decisions

- No bulk 410.
- No bulk delete.
- No bulk noindex.
- No URL structure change.
- No canonical domain change.
- No mass redirect change.

## Next Manual Decision

Use SEO_INDEX_QUALITY.csv to decide which THIN/fallback code hubs should be enriched first. Do not remove them from sitemap until GSC click/impression history and content uniqueness have been reviewed.
`;

  fs.writeFileSync(path.join(REPORT_DIR, 'RECOVERY_IMPLEMENTATION_REPORT.md'), report);
  fs.writeFileSync(path.join(REPORT_DIR, 'seo-recovery-snapshot.json'), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    sitemapUrls: counts.total,
    indexQualityPass: counts.indexQualityPass,
    indexQualityFail: counts.indexQualityFail,
    classifications: counts,
    fallbackSummary,
    vehicleSummary,
  }, null, 2)}\n`);

  console.log(report);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
