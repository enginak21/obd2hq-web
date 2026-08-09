const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:obd2hq.com';
const REPORT_DIR = path.join(ROOT, 'reports/seo/recovery-monitor');

function base64Url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function dateDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

async function getAccessToken() {
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GSC_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) {
    throw new Error('Missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY. Recovery monitor is observe-only but still needs read-only Search Console API credentials.');
  }

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

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });

  if (!response.ok) throw new Error(`GSC token request failed: ${response.status} ${await response.text()}`);
  return (await response.json()).access_token;
}

async function searchAnalytics(accessToken, body) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`GSC searchAnalytics failed: ${response.status} ${await response.text()}`);
  return await response.json();
}

async function sitemapState(accessToken) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/sitemaps`;
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) return { error: `${response.status} ${await response.text()}` };
  return await response.json();
}

function summarize(rows = []) {
  return rows.reduce((acc, row) => {
    acc.clicks += row.clicks || 0;
    acc.impressions += row.impressions || 0;
    acc.weightedPosition += (row.position || 0) * (row.impressions || 0);
    return acc;
  }, { clicks: 0, impressions: 0, weightedPosition: 0 });
}

function lineTable(rows, columns) {
  return [
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${columns.map((column) => String(row[column] ?? '').replace(/\|/g, '/')).join(' | ')} |`),
  ].join('\n');
}

async function main() {
  const accessToken = await getAccessToken();
  const today = new Date().toISOString().slice(0, 10);
  const endDate = dateDaysAgo(2);
  const start28 = dateDaysAgo(30);
  const start7 = dateDaysAgo(9);

  const [daily, queries28, pages28, brand, sitemap] = await Promise.all([
    searchAnalytics(accessToken, { startDate: start28, endDate, dimensions: ['date'], rowLimit: 1000, dataState: 'final' }),
    searchAnalytics(accessToken, { startDate: start28, endDate, dimensions: ['query'], rowLimit: 100, dataState: 'final' }),
    searchAnalytics(accessToken, { startDate: start28, endDate, dimensions: ['page'], rowLimit: 100, dataState: 'final' }),
    searchAnalytics(accessToken, {
      startDate: start28,
      endDate,
      dimensions: ['date'],
      rowLimit: 1000,
      dataState: 'final',
      dimensionFilterGroups: [{ filters: [{ dimension: 'query', operator: 'equals', expression: 'obd2hq' }] }],
    }),
    sitemapState(accessToken),
  ]);

  const summary = summarize(daily.rows);
  const rowsDaily = (daily.rows || []).map((row) => ({
    date: row.keys[0],
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: `${(((row.ctr || 0) * 100).toFixed(2))}%`,
    position: row.position ? row.position.toFixed(1) : '',
  })).sort((a, b) => b.date.localeCompare(a.date));

  const topQueries = (queries28.rows || []).slice(0, 20).map((row) => ({
    query: row.keys[0],
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: `${(((row.ctr || 0) * 100).toFixed(2))}%`,
    position: row.position ? row.position.toFixed(1) : '',
  }));

  const topPages = (pages28.rows || []).slice(0, 20).map((row) => ({
    page: row.keys[0],
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: `${(((row.ctr || 0) * 100).toFixed(2))}%`,
    position: row.position ? row.position.toFixed(1) : '',
  }));

  const brandSummary = summarize(brand.rows);
  const report = [
    `# GSC Recovery Snapshot - ${today}`,
    '',
    `Site: ${SITE_URL}`,
    `Range: ${start28} to ${endDate}`,
    '',
    '## Summary',
    '',
    `- Clicks: ${summary.clicks}`,
    `- Impressions: ${summary.impressions}`,
    `- CTR: ${summary.impressions ? `${((summary.clicks / summary.impressions) * 100).toFixed(2)}%` : '0.00%'}`,
    `- Average position: ${summary.impressions ? (summary.weightedPosition / summary.impressions).toFixed(1) : '-'}`,
    `- Brand query impressions: ${brandSummary.impressions}`,
    `- Brand query clicks: ${brandSummary.clicks}`,
    '',
    '## Sitemap State',
    '',
    '```json',
    JSON.stringify(sitemap, null, 2),
    '```',
    '',
    '## Daily Trend',
    '',
    lineTable(rowsDaily, ['date', 'clicks', 'impressions', 'ctr', 'position']),
    '',
    '## Top Queries',
    '',
    lineTable(topQueries, ['query', 'clicks', 'impressions', 'ctr', 'position']),
    '',
    '## Top Pages',
    '',
    lineTable(topPages, ['page', 'clicks', 'impressions', 'ctr', 'position']),
    '',
    '## Observe-Only Guardrail',
    '',
    'This monitor only reads Search Console data and writes reports. It must not create URLs, delete URLs, edit titles, change canonical tags, apply noindex, or alter sitemaps.',
    '',
  ].join('\n');

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, `gsc-recovery-${today}.md`), report);
  console.log(report);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
