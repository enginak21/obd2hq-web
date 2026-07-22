const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function fail(message) {
  failures.push(message);
}

function assertIncludes(file, needle, label = needle) {
  const content = read(file);
  if (!content.includes(needle)) fail(`${file} is missing ${label}.`);
}

function assertClean(file) {
  const content = read(file);
  if (/\u00c3|\u00c4|\u00c5|\ufffd/.test(content)) fail(`${file} contains mojibake characters.`);
}

const criticalFiles = [
  'src/app/[locale]/[make]/[model]/[code]/page.tsx',
  'src/app/[locale]/_code-hub-page.tsx',
  'src/app/[locale]/resources/page.tsx',
  'src/data/gsc-seo.ts',
  'src/data/obd-gold-content.ts',
  'src/data/obd-registry.ts',
  'src/app/sitemap.xml/route.ts',
  'src/app/sitemaps/[id]/route.ts',
];

criticalFiles.forEach(assertClean);

assertIncludes('src/app/[locale]/[make]/[model]/[code]/page.tsx', 'getAlternates(', 'canonical/hreflang alternates');
assertIncludes('src/app/[locale]/[make]/[model]/[code]/page.tsx', '"@type": "FAQPage"', 'FAQPage schema');
assertIncludes('src/app/[locale]/[make]/[model]/[code]/page.tsx', '"@type": "TechArticle"', 'TechArticle schema');
assertIncludes('src/app/[locale]/[make]/[model]/[code]/page.tsx', '"@type": "BreadcrumbList"', 'BreadcrumbList schema');
assertIncludes('src/app/[locale]/[make]/[model]/[code]/page.tsx', 'getLocalizedRegistryCopy', 'OBD registry copy');

assertIncludes('src/app/[locale]/_code-hub-page.tsx', 'getCodeHubAlternates(', 'code hub alternates');
assertIncludes('src/app/[locale]/_code-hub-page.tsx', "'@type': 'FAQPage'", 'code hub FAQPage schema');
assertIncludes('src/app/[locale]/_code-hub-page.tsx', "'@type': 'TechArticle'", 'code hub TechArticle schema');
assertIncludes('src/app/[locale]/_code-hub-page.tsx', "'@type': 'BreadcrumbList'", 'code hub BreadcrumbList schema');
assertIncludes('src/app/[locale]/_code-hub-page.tsx', 'getTranslations({ locale, namespace: \'DB\' })', 'localized DB token rendering');

assertIncludes('src/data/gsc-seo.ts', "languages['x-default']", 'x-default hreflang');
assertIncludes('src/app/sitemap.xml/route.ts', "'code-hubs'", 'code-hubs sitemap index entry');
assertIncludes('src/app/sitemaps/[id]/route.ts', "idStr === 'code-hubs'", 'code-hubs sitemap route');
assertIncludes('src/app/sitemaps/[id]/route.ts', 'getCodeHubPath(locale, code)', 'localized code hub sitemap URLs');
assertIncludes('src/app/sitemaps/[id]/route.ts', '/resources', 'resources sitemap URL');
assertIncludes('src/app/[locale]/resources/page.tsx', '/open-data/obd2-codes.json', 'open OBD2 dataset link');
assertIncludes('src/app/[locale]/resources/page.tsx', '/widget/obd2hq-lookup.js', 'embeddable widget link');
assertIncludes('src/proxy.ts', "'resources'", 'resources middleware allowlist');

if (failures.length) {
  console.error('SEO contract checks failed:');
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('SEO contract checks passed.');
