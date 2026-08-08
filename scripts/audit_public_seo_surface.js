const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const failures = [];
const publicRoots = ['src/app', 'src/components'];
const publicDataFiles = [
  'src/data/top-click-seo.ts',
  'src/data/top-impression-seo.ts',
  'src/data/gsc-seo.ts',
  'src/data/navigation.ts',
];
const editorialVehicleCodeTargets = new Set([
  'ford/focus/P0213',
  'suzuki/jimny/P0235',
  'suzuki/jimny/P0203',
  'suzuki/jimny/P0204',
  'suzuki/jimny/P0234',
  'suzuki/jimny/P0201',
  'suzuki/jimny/P0243',
  'ford/fiesta/P0216',
  'ford/focus/P0103',
  'ford/ranger/P0110',
  'ford/f-150/P0251',
  'acura/tlx/P0102',
  'honda/cr-v/P0135',
  'lexus/is/P0125',
  'toyota/camry/P0420',
  'toyota/camry/P0300',
  'nissan/altima/P0420',
  'nissan/altima/P0300',
  'ford/f-150/P0420',
  'ford/f-150/P0300',
  'honda/civic/P0420',
  'honda/civic/P0300',
]);

function fail(message) {
  failures.push(message);
}

function walk(dir) {
  if (!fs.existsSync(path.join(ROOT, dir))) return [];
  const entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true });
  return entries.flatMap((entry) => {
    const relative = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) return walk(relative);
    return /\.(tsx?|jsx?|json|md)$/.test(entry.name) ? [relative] : [];
  });
}

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

const files = [
  ...publicRoots.flatMap(walk),
  ...publicDataFiles.filter((file) => fs.existsSync(path.join(ROOT, file))),
];

const mojibakePattern = /(?:Ã.|Ä±|Ä°|ÄŸ|Ä|ÅŸ|Å|â€|ï¿½|�)/;
const forbiddenPublicPhrases = [
  'Google Search Console opportunity',
  'Search Console opportunity',
  'CANLI SEARCH CONSOLE',
  'High-intent answer',
  'High-intent search answer',
  'ortalama sıra',
  'gösterim',
];
const vehicleCodePathPattern = /\/[a-z]{2}\/([^/'"`\s{}]+)\/([^/'"`\s{}]+)\/([pcbu][0-9a-f]{4})/gi;

for (const file of files) {
  const content = read(file);
  if (mojibakePattern.test(content)) fail(`${file} contains mojibake-like text.`);
  for (const phrase of forbiddenPublicPhrases) {
    if (content.includes(phrase)) fail(`${file} contains forbidden public SEO phrase: ${phrase}`);
  }
  for (const match of content.matchAll(vehicleCodePathPattern)) {
    const [, make, model, rawCode] = match;
    const key = `${make}/${model}/${rawCode.toUpperCase()}`;
    if (!editorialVehicleCodeTargets.has(key)) {
      fail(`${file} links to non-editorial vehicle-code URL: /${match[0].replace(/^\/+/, '')}`);
    }
  }
}

if (failures.length) {
  console.error('Public SEO surface audit failed:');
  failures.slice(0, 120).forEach((message) => console.error(`- ${message}`));
  if (failures.length > 120) console.error(`...and ${failures.length - 120} more`);
  process.exit(1);
}

console.log(`Public SEO surface audit passed: ${files.length} files checked.`);
