const fs = require('fs');
const path = require('path');

const root = process.cwd();
const requiredFiles = [
  'src/data/problem-finder.ts',
  'src/components/ProblemFinderClient.tsx',
  'src/app/[locale]/_problem-finder-hub.tsx',
  'src/app/[locale]/_problem-finder-detail.tsx',
  'src/app/api/problem-finder-query/route.ts',
  'src/app/api/problem-finder-feedback/route.ts',
  'src/data/generated/problem-finder-synonyms.json',
];

const badPatterns = [/Ã/, /Å/, /ï¿½/, /�/, /â[€™€œ€“]/, /Ä[±°žŸ]/];
const localizedBases = ['car-problem-finder', 'ariza-bulucu', 'auto-problemfinder', 'buscador-fallas', 'trouver-panne'];

function fail(message) {
  console.error(`[problem-finder-quality] ${message}`);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Missing required file: ${file}`);
}

const dataPath = path.join(root, 'src/data/problem-finder.ts');
const data = fs.readFileSync(dataPath, 'utf8');
const intentCount = (data.match(/^\s+\['[a-z0-9_]+',/gm) || []).length;
if (intentCount < 80) fail(`Expected at least 80 problem intents, found ${intentCount}.`);

for (const base of localizedBases) {
  if (!data.includes(`'${base}'`)) fail(`Missing localized base path: ${base}`);
}

for (const file of requiredFiles.slice(0, -1)) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  if (badPatterns.some((pattern) => pattern.test(content))) fail(`Mojibake marker found in ${file}`);
}

const synonyms = JSON.parse(fs.readFileSync(path.join(root, 'src/data/generated/problem-finder-synonyms.json'), 'utf8'));
if (!synonyms || typeof synonyms !== 'object' || Array.isArray(synonyms)) {
  fail('Generated problem finder synonyms must be an object.');
}

const sitemap = fs.readFileSync(path.join(root, 'src/app/sitemaps/[id]/route.ts'), 'utf8');
if (!sitemap.includes('publishedProblemFinderIntents') || !sitemap.includes('getProblemFinderDetailPath')) {
  fail('Sitemap does not include problem finder URLs.');
}

if (!process.exitCode) {
  console.log(`[problem-finder-quality] OK: ${intentCount} intents, 5 locales, sitemap wired.`);
}
