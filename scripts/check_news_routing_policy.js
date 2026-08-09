const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function loadJson(relativePath) {
  return JSON.parse(read(relativePath));
}

const newsDir = path.join(ROOT, 'src/data/news');
const activeSlugFile = 'src/data/active_news_slugs.json';
const activeSlugs = loadJson(activeSlugFile);
const currentNewsSlugs = fs.readdirSync(newsDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => path.basename(file, '.json'))
  .sort();

if (JSON.stringify([...activeSlugs].sort()) !== JSON.stringify(currentNewsSlugs)) {
  failures.push('active_news_slugs.json is not synchronized with src/data/news.');
}

const proxySource = read('src/proxy.ts');
if (!proxySource.includes("active_news_slugs.json")) {
  failures.push('Proxy does not import active news slug allow-list.');
}
if (!proxySource.includes('!activeNewsSlugSet.has(segments[2])')) {
  failures.push('Proxy does not 404 inactive/removed news slugs.');
}
if (!proxySource.includes('redirectSlug && activeNewsSlugSet.has(redirectSlug)')) {
  failures.push('Proxy may redirect removed news slugs to inactive news targets instead of returning 404.');
}

const newsPageSource = read('src/app/[locale]/news/[slug]/page.tsx');
if (!newsPageSource.includes('index: true')) {
  failures.push('Active news metadata is not indexable.');
}
if (newsPageSource.includes('index: false')) {
  failures.push('Active news metadata still contains noindex.');
}
if (/not used for Google indexing|kept out of Google indexing|noindex/i.test(newsPageSource)) {
  failures.push('News page still contains removed-news/noindex messaging.');
}
if (/[ÃÄÅ�]/.test(newsPageSource)) {
  failures.push('News page source contains mojibake characters.');
}

const sitemapSource = read('src/app/sitemaps/[id]/route.ts');
if (!sitemapSource.includes('getAllNews().forEach')) {
  failures.push('Active news detail URLs are not emitted by the sitemap route.');
}

if (failures.length) {
  console.error('News routing policy check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('News routing policy check passed.');
console.log(`Active news slugs: ${activeSlugs.length}`);
