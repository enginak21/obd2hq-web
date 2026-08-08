const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CANONICAL_ORIGIN = 'https://www.obd2hq.com';
const SOURCE_FILES = [
  'src/app/robots.ts',
  'src/app/sitemap.xml/route.ts',
  'src/app/sitemaps/[id]/route.ts',
  'src/proxy.ts',
  'src/utils/seo.ts',
  'src/data/gsc-seo.ts',
];

const failures = [];
const warnings = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function checkSourceFreeze() {
  for (const file of SOURCE_FILES) {
    const content = read(file);
    if (content.includes('https://obd2hq.com') && !content.includes(CANONICAL_ORIGIN)) {
      fail(`${file} references apex HTTPS without the canonical www origin.`);
    }
  }

  const robots = read('src/app/robots.ts');
  if (!robots.includes(`${CANONICAL_ORIGIN}/sitemap.xml`)) {
    fail('robots.ts must point to the www sitemap.');
  }

  const sitemapIndex = read('src/app/sitemap.xml/route.ts');
  const sitemapRoute = read('src/app/sitemaps/[id]/route.ts');
  if (!sitemapIndex.includes(`const BASE_URL = '${CANONICAL_ORIGIN}'`)) {
    fail('sitemap.xml route must lock BASE_URL to https://www.obd2hq.com.');
  }
  if (!sitemapRoute.includes(`const BASE_URL = '${CANONICAL_ORIGIN}'`)) {
    fail('sitemaps route must lock BASE_URL to https://www.obd2hq.com.');
  }

  const proxy = read('src/proxy.ts');
  if (!proxy.includes("host === 'obd2hq.com'")) {
    fail('proxy.ts must keep apex to www host redirect logic.');
  }
  if (proxy.includes("request.headers.get('host') === 'www.obd2hq.com'")) {
    fail('proxy.ts must not redirect canonical www host back to apex.');
  }
}

async function traceRedirects(startUrl, maxHops = 4) {
  const chain = [];
  let current = startUrl;
  for (let hop = 0; hop <= maxHops; hop += 1) {
    const response = await fetch(current, { redirect: 'manual' });
    const location = response.headers.get('location');
    chain.push({ url: current, status: response.status, location });
    if (!location || response.status < 300 || response.status > 399) break;
    current = new URL(location, current).toString();
  }
  return chain;
}

async function checkLiveRedirects() {
  const variants = [
    'http://obd2hq.com/',
    'https://obd2hq.com/',
    'http://www.obd2hq.com/',
    'https://www.obd2hq.com/',
  ];

  for (const variant of variants) {
    const chain = await traceRedirects(variant);
    const final = chain[chain.length - 1];
    const finalUrl = new URL(final.url);
    if (finalUrl.protocol !== 'https:' || finalUrl.host !== 'www.obd2hq.com') {
      fail(`${variant} does not settle on the canonical www HTTPS host. Chain: ${chain.map(item => `${item.status}:${item.url}`).join(' -> ')}`);
    }
    if (chain.length > 4) {
      fail(`${variant} uses more than three redirects before the final canonical page.`);
    }
    if (chain.length > 2) {
      warn(`${variant} currently needs two hops because protocol and locale redirects are separate. This is acceptable during freeze, but should not get worse.`);
    }
  }
}

async function main() {
  checkSourceFreeze();
  if (!process.argv.includes('--source-only')) {
    await checkLiveRedirects();
  }

  for (const message of warnings) console.warn(`Canonical freeze warning: ${message}`);
  if (failures.length) {
    console.error('Canonical/domain freeze checks failed:');
    failures.forEach(message => console.error(`- ${message}`));
    process.exit(1);
  }
  console.log('Canonical/domain freeze checks passed.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
