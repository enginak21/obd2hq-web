const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, 'src/data/generated/gsc-opportunities.json');
const REPORT_DIR = path.join(ROOT, 'reports/seo');
const SITE_URL = process.env.GSC_SITE_URL || 'https://obd2hq.com/';
const DRY_RUN = process.argv.includes('--dry-run');

const seedQueries = [
  ['p0213', 125],
  ['p0292', 46],
  ['p0282', 46],
  ['p0211', 38],
  ['p0283', 38],
  ['p0257', 37],
  ['p0262', 37],
  ['p0188', 37],
  ['p0251 ford', 36],
  ['p0289', 35],
  ['p0276', 35],
  ['p0235 suzuki', 34],
  ['p0258', 34],
  ['2021 f 150 warning lights', 34],
  ['p0295', 33],
  ['p0184', 32],
  ['p0185', 32],
  ['cadillac vehicle warning lights', 31],
  ['cadillac warning lights', 30],
  ['toyota/lexus error p0122', 29],
  ['p0180', 29],
  ['p0207', 29],
  ['2026 f 150 warning lights', 29],
  ['p0285', 28],
  ['p0242', 28],
  ['p0265', 28],
  ['p0241', 27],
  ['p0215', 27],
  ['p0243 suzuki', 26],
  ['p0212', 26],
];

const knownMakes = [
  'acura', 'audi', 'bmw', 'cadillac', 'chevrolet', 'ford', 'honda', 'hyundai', 'kia',
  'lexus', 'mazda', 'mercedes-benz', 'nissan', 'renault', 'suzuki', 'toyota', 'volkswagen',
];

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function getDate(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function extractCodes(query) {
  return Array.from(query.toUpperCase().matchAll(/\b[PCBU]\s?([0-9A-F]{4})\b/g)).map(match => `${match[0][0]}${match[1]}`);
}

function extractMake(query) {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  return knownMakes.find(make => normalized.split(/\s+/).includes(make) || normalized.includes(make.replace(/-/g, ' '))) || null;
}

function classifyQuery(query) {
  const codes = extractCodes(query);
  const make = extractMake(query);
  const warningIntent = /warning\s+lights?|dashboard\s+lights?|uyar[Ä±i]\s+[Ä±i]?[sÅŸ]Ä±k|voyants?|warnleuchten|luces/i.test(query);
  const hasYear = /\b(19|20)\d{2}\b/.test(query);
  if (warningIntent && hasYear) return 'warning_light_model_year';
  if (warningIntent && make) return 'warning_light_make';
  if (codes.length && make) return 'make_code';
  if (codes.length && /\/|error|dtc/i.test(query)) return 'mixed_error';
  if (codes.length) return 'code_only';
  return 'unknown';
}

function targetUrlFor(query) {
  const intentType = classifyQuery(query);
  const codes = extractCodes(query);
  const make = extractMake(query);
  if (intentType === 'warning_light_make' && make) return `/en/${make}/warning-lights`;
  if (intentType === 'warning_light_model_year' && /f[\s-]?150/i.test(query)) return '/en/ford/f-150/lights';
  if (intentType === 'make_code' && make && codes[0]) {
    const preferredModels = { ford: 'focus', suzuki: 'jimny', toyota: 'camry', lexus: 'rx' };
    const model = preferredModels[make];
    return model ? `/en/${make}/${model}/${codes[0].toLowerCase()}` : `/en/codes/${codes[0].toLowerCase()}`;
  }
  if (codes[0]) return `/en/codes/${codes[0].toLowerCase()}`;
  return '/en/search';
}

function recommendedAction(intentType) {
  if (intentType === 'code_only') return 'Publish or strengthen generic code hub, then link to high-intent make/model pages.';
  if (intentType === 'make_code') return 'Strengthen make-specific code page with exact query heading, diagnostic depth, and internal links.';
  if (intentType === 'warning_light_model_year') return 'Strengthen model warning-light hub with year-specific copy and links to likely OBD codes.';
  if (intentType === 'warning_light_make') return 'Publish brand warning-light hub and link model warning-light pages into it.';
  if (intentType === 'mixed_error') return 'Create a clean canonical interpretation page or route query to the best code hub.';
  return 'Review query manually before publishing new indexable content.';
}

function priorityFor(row) {
  let score = row.impressions;
  if (row.clicks === 0 && row.impressions >= 25) score += 80;
  if (row.position !== null && row.position >= 8 && row.position <= 30) score += 60;
  if (row.trend > 0) score += Math.min(50, row.trend);
  if (row.intentType !== 'unknown') score += 25;
  if (score >= 140) return 'critical';
  if (score >= 90) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function normalizeRows(rows28, rows7) {
  const trendMap = new Map(rows7.map(row => [row.query, row.impressions]));
  return rows28
    .filter(row => row.impressions >= 10)
    .map(row => {
      const intentType = classifyQuery(row.query);
      const opportunity = {
        query: row.query,
        targetUrl: row.page || targetUrlFor(row.query),
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: Number.isFinite(row.position) ? Number(row.position.toFixed(1)) : null,
        trend: trendMap.get(row.query) || 0,
        intentType,
        recommendedAction: recommendedAction(intentType),
        status: intentType === 'unknown' ? 'needs_review' : 'tracked',
        priority: 'low',
        lastChecked: new Date().toISOString().slice(0, 10),
      };
      opportunity.priority = priorityFor(opportunity);
      return opportunity;
    })
    .sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority] || b.impressions - a.impressions;
    })
    .slice(0, 250);
}

async function getAccessToken() {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GSC_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(privateKey, 'base64url');
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GSC token request failed: ${response.status} ${text}`);
  }
  const json = await response.json();
  return json.access_token;
}

async function fetchSearchAnalytics(accessToken, startDate, endDate) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit: 1000,
      dataState: 'final',
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GSC query failed: ${response.status} ${text}`);
  }
  const json = await response.json();
  return (json.rows || []).map(row => ({
    query: row.keys[0],
    page: row.keys[1]?.replace(/^https:\/\/www\.obd2hq\.com/, '') || targetUrlFor(row.keys[0]),
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || null,
  }));
}

function seedRows() {
  return seedQueries.map(([query, impressions]) => ({
    query,
    page: targetUrlFor(query),
    clicks: 0,
    impressions,
    ctr: 0,
    position: null,
  }));
}

function writeReport(opportunities) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    `# GSC SEO Opportunity Report - ${today}`,
    '',
    `Site: ${SITE_URL}`,
    '',
    '| Priority | Query | Impressions | Clicks | CTR | Position | Target URL | Action |',
    '|---|---:|---:|---:|---:|---:|---|---|',
    ...opportunities.slice(0, 50).map(row => `| ${row.priority} | ${row.query} | ${row.impressions} | ${row.clicks} | ${(row.ctr * 100).toFixed(2)}% | ${row.position ?? '-'} | ${row.targetUrl} | ${row.recommendedAction} |`),
    '',
  ];
  fs.writeFileSync(path.join(REPORT_DIR, `gsc-${today}.md`), lines.join('\n'));
}

async function main() {
  const token = await getAccessToken();
  let rows28;
  let rows7;
  if (!token) {
    console.log('GSC credentials are missing. Using seed queries from current Search Console screenshots.');
    rows28 = seedRows();
    rows7 = seedRows();
  } else {
    const endDate = getDate(2);
    rows28 = await fetchSearchAnalytics(token, getDate(30), endDate);
    rows7 = await fetchSearchAnalytics(token, getDate(9), endDate);
  }

  const opportunities = normalizeRows(rows28, rows7);
  console.log(JSON.stringify(opportunities.slice(0, 20), null, 2));

  if (!DRY_RUN) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(opportunities, null, 2)}\n`);
    writeReport(opportunities);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
