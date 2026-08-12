const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (quoted && next === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    if (row.some(Boolean)) rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function text(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  if (typeof value === 'object') return text(value.en || Object.values(value)[0]);
  return '';
}

function arrayLength(value) {
  return Array.isArray(value) ? value.length : 0;
}

function isRawGoldReady(code, data) {
  return Boolean(
    /^[PCBU][0-9A-F]{4}$/.test(code) &&
    text(data?.title) &&
    text(data?.description).length >= 180 &&
    arrayLength(data?.symptoms) >= 5 &&
    arrayLength(data?.causes) >= 5 &&
    data?.fixDifficulty &&
    data?.estimatedCost
  );
}

function getMergedCodes() {
  return {
    ...loadJson('src/data/base_codes.json'),
    ...loadJson('src/data/verified_dtc_gold.json'),
    ...loadJson('src/data/verified_dtc_gold_batch02.json'),
  };
}

function getRawGoldCodeSet() {
  const codes = getMergedCodes();
  return new Set(
    Object.entries(codes)
      .filter(([code, data]) => isRawGoldReady(code, data))
      .map(([code]) => code.toUpperCase())
  );
}

function getGscSignalCodeSet() {
  const opportunities = loadJson('src/data/generated/gsc-opportunities.json');
  const signalCodes = new Set(
    opportunities
      .filter((row) => Number(row.clicks || 0) > 0 || Number(row.impressions || 0) > 0)
      .flatMap((row) => (row.query || '').toUpperCase().match(/\b[PCBU][0-9A-F]{4}\b/g) || [])
  );

  const fallbackAuditPath = path.join(ROOT, 'reports/seo/OBD_FALLBACK_SIMILARITY.csv');
  if (fs.existsSync(fallbackAuditPath)) {
    const rows = parseCsv(fs.readFileSync(fallbackAuditPath, 'utf8'));
    for (const row of rows) {
      if (Number(row.gsc_impressions || 0) > 0 || Number(row.gsc_clicks || 0) > 0) {
        signalCodes.add(String(row.code || '').toUpperCase());
      }
    }
  }

  return signalCodes;
}

function getValidCodeSet() {
  return new Set(loadJson('src/data/valid_routes.json').validCodes.map((code) => code.toUpperCase()));
}

function codeHubPath(locale, code) {
  const lower = code.toLowerCase();
  if (locale === 'tr') return `/${locale}/kodlar/${lower}`;
  if (locale === 'es') return `/${locale}/codigos/${lower}`;
  return `/${locale}/codes/${lower}`;
}

function isCodeHubSitemapEligible(code, rawGoldSet, gscSignalSet) {
  const upper = code.toUpperCase();
  return rawGoldSet.has(upper);
}

function codeHubDecision(code, rawGoldSet, gscSignalSet) {
  const upper = code.toUpperCase();
  if (rawGoldSet.has(upper)) return { decision: 'SITEMAP_KEEP', reason: 'verified_raw_gold' };
  if (gscSignalSet.has(upper)) return { decision: 'SITEMAP_HOLD_FOR_GOLD_UPGRADE', reason: 'fallback_with_gsc_signal_held_for_gold_upgrade' };
  return { decision: 'SITEMAP_REMOVE_KEEP_CRAWLABLE', reason: 'fallback_without_gsc_signal' };
}

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function writeCsv(fileName, rows, columns) {
  const outDir = path.join(ROOT, 'reports/seo');
  fs.mkdirSync(outDir, { recursive: true });
  const content = [
    columns.join(','),
    ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(',')),
  ].join('\n');
  fs.writeFileSync(path.join(outDir, fileName), `${content}\n`);
}

module.exports = {
  ROOT,
  LOCALES,
  loadJson,
  getMergedCodes,
  getRawGoldCodeSet,
  getGscSignalCodeSet,
  getValidCodeSet,
  isRawGoldReady,
  isCodeHubSitemapEligible,
  codeHubDecision,
  codeHubPath,
  writeCsv,
};
