const fs = require('fs');
const path = require('path');

const LOCALES = new Set(['en', 'tr', 'de', 'es', 'fr']);
const queryKey = 'obd2hq:problem-finder:queries';
const root = process.cwd();
const synonymsPath = path.join(root, 'src/data/generated/problem-finder-synonyms.json');
const reportPath = path.join(root, 'src/data/generated/problem-finder-learning.json');

function hasEnv() {
  return Boolean((process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN));
}

function isPrivateOrSpam(query) {
  return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(query)
    || /(?:\+?\d[\s().-]*){9,}/.test(query)
    || /\b[A-HJ-NPR-Z0-9]{17}\b/i.test(query)
    || /\b\d{2}\s?[A-ZÇĞİÖŞÜ]{1,3}\s?\d{2,4}\b/i.test(query)
    || /(casino|porn|viagra|loan|crypto|telegram|whatsapp|https?:\/\/)/i.test(query);
}

async function redis(command) {
  const baseUrl = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL).replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const response = await fetch(`${baseUrl}/${command}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Redis request failed: ${response.status}`);
  return response.json();
}

async function main() {
  if (!hasEnv()) {
    const report = { lastProcessed: new Date().toISOString(), totalRead: 0, stored: false, reason: 'KV env missing' };
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log('[problem-finder-learning] KV env missing; wrote no-op report.');
    return;
  }

  const result = await redis(`lrange/${encodeURIComponent(queryKey)}/0/500`);
  const rawItems = Array.isArray(result.result) ? result.result : [];
  const synonyms = fs.existsSync(synonymsPath) ? JSON.parse(fs.readFileSync(synonymsPath, 'utf8')) : {};
  const topQueries = new Map();
  const candidateSynonyms = [];
  const unknownQueries = [];

  for (const raw of rawItems) {
    let item;
    try {
      item = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      continue;
    }
    if (!item || typeof item.query !== 'string' || isPrivateOrSpam(item.query)) continue;
    const locale = LOCALES.has(item.locale) ? item.locale : 'en';
    const query = item.query.trim().replace(/\s+/g, ' ').slice(0, 120);
    topQueries.set(query, (topQueries.get(query) || 0) + 1);

    if (item.found && item.matchedIntent && Number(item.score) >= 70) {
      synonyms[item.matchedIntent] = synonyms[item.matchedIntent] || {};
      synonyms[item.matchedIntent][locale] = synonyms[item.matchedIntent][locale] || [];
      if (!synonyms[item.matchedIntent][locale].includes(query)) {
        synonyms[item.matchedIntent][locale].push(query);
        candidateSynonyms.push({ intentKey: item.matchedIntent, locale, query, score: item.score });
      }
    } else if (!item.found) {
      unknownQueries.push({ locale, query, score: item.score || 0 });
    }
  }

  fs.writeFileSync(synonymsPath, `${JSON.stringify(synonyms, null, 2)}\n`);
  fs.writeFileSync(reportPath, `${JSON.stringify({
    lastProcessed: new Date().toISOString(),
    totalRead: rawItems.length,
    candidateSynonyms: candidateSynonyms.slice(0, 100),
    unknownQueries: unknownQueries.slice(0, 100),
    topQueries: [...topQueries.entries()].sort((a, b) => b[1] - a[1]).slice(0, 100).map(([query, count]) => ({ query, count })),
  }, null, 2)}\n`);
  console.log(`[problem-finder-learning] processed ${rawItems.length} records, added ${candidateSynonyms.length} synonym candidates.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
