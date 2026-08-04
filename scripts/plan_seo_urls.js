const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://www.obd2hq.com';
const LOCALES = ['en', 'tr', 'de', 'es', 'fr'];
const GENERATED_DIR = path.join(ROOT, 'src/data/generated');
const REPORT_DIR = path.join(ROOT, 'reports/seo');
const OPPORTUNITIES_FILE = path.join(GENERATED_DIR, 'gsc-opportunities.json');
const PLAN_FILE = path.join(GENERATED_DIR, 'seo-url-plan.json');
const FOCUS_FILE = path.join(GENERATED_DIR, 'seo-focus-links.json');

const routePriority = {
  home: 100,
  code_hub: 92,
  gsc_vehicle_code: 96,
  warning_light: 90,
  problem_finder: 88,
  symptom_content: 86,
  news: 76,
  blog: 82,
  vehicle_hub: 78,
  tool: 74,
  legal: 20,
  other: 50,
};

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function todayIso() {
  return new Date().toISOString();
}

function todayDate() {
  return todayIso().slice(0, 10);
}

function normalizeUrl(value) {
  return value.replace(/\/$/, '');
}

function splitPath(url) {
  const parsed = new URL(url, BASE_URL);
  return parsed.pathname.split('/').filter(Boolean);
}

function detectLocale(parts) {
  return LOCALES.includes(parts[0]) ? parts[0] : 'en';
}

function classifyUrl(url, gscTargets) {
  const parts = splitPath(url);
  const locale = detectLocale(parts);
  if (parts.length === 1 && LOCALES.includes(parts[0])) return { locale, type: 'home' };
  if (parts.includes('privacy') || parts.includes('terms') || parts.includes('disclaimer') || parts.includes('reviewers') || parts.includes('editorial-policy')) return { locale, type: 'legal' };
  if (parts.includes('news')) return { locale, type: parts.length > 2 ? 'news' : 'news_hub' };
  if (parts.includes('blog')) return { locale, type: parts.length > 2 ? 'blog' : 'blog_hub' };
  if (parts.includes('tools')) return { locale, type: 'tool' };
  if (parts.includes('car-problem-finder') || parts.includes('ariza-bulucu') || parts.includes('auto-problemfinder') || parts.includes('buscador-fallas') || parts.includes('trouver-panne')) return { locale, type: 'problem_finder' };
  if (parts.includes('car-symptoms') || parts.includes('ariza-belirtileri') || parts.includes('auto-symptome') || parts.includes('sintomas-coche') || parts.includes('symptomes-voiture') || parts.includes('symptoms')) return { locale, type: 'symptom_content' };
  if (parts.includes('codes') || parts.includes('kodlar') || parts.includes('codigos')) return { locale, type: 'code_hub' };
  if (parts.includes('warning-lights') || parts.includes('uyari-isiklari') || parts.includes('warnleuchten') || parts.includes('luces-tablero') || parts.includes('voyants-tableau-bord') || parts.includes('lights')) return { locale, type: 'warning_light' };
  if (parts[1] === 'vehicles' || parts.includes('engines') || parts.includes('transmissions') || parts.includes('oil-capacity') || parts.includes('engine-codes') || parts.includes('maintenance') || parts.includes('common-problems')) return { locale, type: 'vehicle_hub' };
  if (parts.length === 4 && /^[pcbu][0-9a-f]{4}$/i.test(parts[3])) {
    return { locale, type: gscTargets.has(`/${parts.join('/')}`) ? 'gsc_vehicle_code' : 'vehicle_code' };
  }
  return { locale, type: 'other' };
}

function publicTitleFromUrl(url, locale = 'en') {
  const parts = splitPath(url);
  const last = parts[parts.length - 1] || 'obd2hq';
  const code = parts.find(part => /^[pcbu][0-9a-f]{4}$/i.test(part));
  const guideWord = locale === 'tr' ? 'rehberi' : locale === 'de' ? 'Ratgeber' : locale === 'es' ? 'guía' : locale === 'fr' ? 'guide' : 'guide';
  const warningWord = locale === 'tr' ? 'uyarı ışıkları' : locale === 'de' ? 'Warnleuchten' : locale === 'es' ? 'luces del tablero' : locale === 'fr' ? 'voyants' : 'warning lights';
  if (parts.length === 1 && LOCALES.includes(parts[0])) return locale === 'tr' ? 'OBD2HQ arıza teşhis merkezi' : 'OBD2HQ diagnostic search hub';
  if (code && parts.length >= 4 && !['codes', 'kodlar', 'codigos'].includes(parts[1])) {
    return `${titleize(parts[1])} ${titleize(parts[2])} ${code.toUpperCase()} ${guideWord}`;
  }
  if (code) return locale === 'tr' ? `${code.toUpperCase()} OBD2 arıza kodu rehberi` : `${code.toUpperCase()} OBD2 code ${guideWord}`;
  if (parts.includes('lights')) {
    return `${titleize(parts[1])} ${titleize(parts[2])} ${warningWord} ${guideWord}`;
  }
  if (parts.includes('warning-lights') || parts.includes('uyari-isiklari') || parts.includes('warnleuchten') || parts.includes('luces-tablero') || parts.includes('voyants-tableau-bord')) {
    return `${titleize(parts[1])} ${warningWord} ${guideWord}`;
  }
  return titleize(last);
}

function titleize(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bObd2\b/g, 'OBD2')
    .replace(/\bP([0-9])/g, 'P$1');
}

function scoreUrl(url, meta, opportunitiesByTarget) {
  const pathOnly = new URL(url).pathname;
  const opportunities = opportunitiesByTarget.get(pathOnly) || [];
  const opportunityScore = opportunities.reduce((sum, item) => sum + item.impressions + (item.clicks === 0 ? 35 : 0) + (item.position && item.position <= 15 ? 40 : 0), 0);
  const typeScore = routePriority[meta.type] || routePriority.other;
  const localeBoost = meta.locale === 'en' ? 10 : meta.locale === 'tr' ? 8 : 4;
  const crawlBudgetPenalty = meta.type === 'legal' ? -60 : 0;
  return Math.round(typeScore + localeBoost + opportunityScore + crawlBudgetPenalty);
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'OBD2HQ SEO URL Planner' } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

async function fetchSitemapUrls() {
  const index = await fetchText(`${BASE_URL}/sitemap.xml`);
  const sitemapUrls = Array.from(index.matchAll(/<loc>(.*?)<\/loc>/g)).map(match => match[1]);
  const all = [];
  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).forEach(match => all.push(match[1]));
  }
  return Array.from(new Set(all.map(normalizeUrl))).sort();
}

function groupByTarget(opportunities) {
  const grouped = new Map();
  opportunities.forEach((item) => {
    const target = normalizeUrl(item.targetUrl || '');
    if (!target.startsWith('/')) return;
    if (!grouped.has(target)) grouped.set(target, []);
    grouped.get(target).push(item);
  });
  return grouped;
}

function buildActions(row, opportunities) {
  const queries = opportunities.map(item => item.query).slice(0, 4);
  const actions = [];
  if (row.type === 'code_hub') actions.push('Expand plain-language meaning, symptoms, causes, first checks and related vehicle links.');
  if (row.type === 'gsc_vehicle_code') actions.push('Add exact make-code intent wording, model-specific first checks and stronger links back to the code hub.');
  if (row.type === 'warning_light') actions.push('Add symbol recognition copy, urgency levels, likely codes and model-year wording where relevant.');
  if (row.type === 'news') actions.push('Add diagnostic context, internal links to warning-light/code pages and concise expert summary.');
  if (row.type === 'symptom_content' || row.type === 'problem_finder') actions.push('Add user-language phrases, safety advice, first checks and related OBD2 code links.');
  if (!actions.length) actions.push('Review title, meta description, H2 structure and internal links.');
  return { queries, actions };
}

async function main() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const opportunities = readJson(OPPORTUNITIES_FILE, []);
  const opportunitiesByTarget = groupByTarget(opportunities);
  const gscTargets = new Set(opportunities.map(item => item.targetUrl).filter(Boolean).map(normalizeUrl));
  const urls = await fetchSitemapUrls();

  const rows = urls.map((url) => {
    const meta = classifyUrl(url, gscTargets);
    const pathOnly = new URL(url).pathname;
    const targetOpportunities = opportunitiesByTarget.get(pathOnly) || [];
    const score = scoreUrl(url, meta, opportunitiesByTarget);
    const { queries, actions } = buildActions(meta, targetOpportunities);
    return {
      url,
      path: pathOnly,
      locale: meta.locale,
      type: meta.type,
      score,
      impressions: targetOpportunities.reduce((sum, item) => sum + item.impressions, 0),
      clicks: targetOpportunities.reduce((sum, item) => sum + item.clicks, 0),
      queries,
      recommendedActions: actions,
    };
  }).sort((a, b) => b.score - a.score || b.impressions - a.impressions || a.url.localeCompare(b.url));

  const focusRows = rows
    .filter(row => !['legal', 'other'].includes(row.type))
    .slice(0, 80);

  const focusLinks = LOCALES.flatMap((locale) => (
    rows
      .filter(row => row.locale === locale && !['legal', 'other'].includes(row.type))
      .slice(0, 8)
      .map(row => ({
        href: row.path,
        locale: row.locale,
        title: publicTitleFromUrl(row.url, row.locale),
        type: row.type,
        score: row.score,
        queries: row.queries,
      }))
  ));

  const segments = rows.reduce((acc, row) => {
    acc[row.type] = (acc[row.type] || 0) + 1;
    return acc;
  }, {});

  const plan = {
    generatedAt: todayIso(),
    totalUrls: rows.length,
    segments,
    focusCount: focusRows.length,
    topUrls: focusRows,
  };

  fs.writeFileSync(PLAN_FILE, `${JSON.stringify(plan, null, 2)}\n`);
  fs.writeFileSync(FOCUS_FILE, `${JSON.stringify(focusLinks, null, 2)}\n`);

  const reportLines = [
    `# OBD2HQ Daily SEO URL Plan - ${todayDate()}`,
    '',
    `Total sitemap URLs reviewed: ${rows.length}`,
    '',
    '## Segments',
    ...Object.entries(segments).sort((a, b) => b[1] - a[1]).map(([type, count]) => `- ${type}: ${count}`),
    '',
    '## Today Focus URLs',
    ...focusRows.slice(0, 25).map((row, index) => `${index + 1}. ${row.path} | type=${row.type} | score=${row.score} | impressions=${row.impressions} | action=${row.recommendedActions[0]}`),
  ];

  fs.writeFileSync(path.join(REPORT_DIR, `url-plan-${todayDate()}.md`), `${reportLines.join('\n')}\n`);
  console.log(`SEO URL plan generated for ${rows.length} URLs. Focus links: ${focusLinks.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
