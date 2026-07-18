const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const roots = ['src', 'messages'];
const textFileExtensions = new Set(['.ts', '.tsx', '.json']);
const mojibakePattern = new RegExp([
  '\\u00c3',
  '\\u00c2',
  '\\u00e2\\u20ac',
  '\\u00ef\\u00bf\\u00bd',
  '\\ufffd',
  'Ara\\?lar',
  'S\\?ntomas',
  'Veh\\?culos',
  'Actualit\\?s',
  'Sympt\\?mes',
  'V\\?hicules',
  'C\\?digo',
  'pol\\?tica',
  '\\?ditoriale',
  'donn\\?es',
  'gepr\\?ft',
  'Werbefl\\?che',
  'Sat\\?n',
  'ba\\?lant\\?s\\?',
  'Pr\\?fung',
].join('|'));
const emptyAffiliatePattern = /href=["']#["']/;
const ignoredPathParts = [
  `${path.sep}data${path.sep}news${path.sep}`,
];

function walk(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile() && textFileExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function isLetterCodePoint(code) {
  return (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 0x00c0 && code <= 0x024f) ||
    (code >= 0x011e && code <= 0x0131) ||
    (code >= 0x015e && code <= 0x015f);
}

function hasSuspiciousReplacementQuestion(line) {
  const codes = [...line].map((char) => char.codePointAt(0));
  for (let index = 0; index < codes.length; index++) {
    if (codes[index] !== 63) continue;
    const prev = codes[index - 1];
    const next = codes[index + 1];
    const nextAfterSpace = codes[index + 1] === 32 ? codes[index + 2] : undefined;
    if (prev && isLetterCodePoint(prev) && next && isLetterCodePoint(next)) return true;
    if (prev && isLetterCodePoint(prev) && next === 63) return true;
    if (line.includes('": "?') && nextAfterSpace && isLetterCodePoint(nextAfterSpace)) return true;
  }
  return false;
}

const failures = [];
for (const root of roots) {
  for (const file of walk(root)) {
    if (ignoredPathParts.some(part => file.includes(part))) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (mojibakePattern.test(content)) failures.push(`${file}: contains mojibake markers`);
    if (file.startsWith('messages')) {
      const badLineIndex = content.split(/\r?\n/).findIndex(hasSuspiciousReplacementQuestion);
      if (badLineIndex >= 0) failures.push(`${file}:${badLineIndex + 1}: contains a suspicious replacement question mark`);
    }
    if (file.endsWith(path.join('data', 'blog.ts')) && emptyAffiliatePattern.test(content)) {
      failures.push(`${file}: contains empty affiliate href="#" links`);
    }
  }
}

const blogPath = path.join('src', 'data', 'blog.ts');
if (fs.existsSync(blogPath)) {
  const blogContent = fs.readFileSync(blogPath, 'utf8');
  for (const slug of ['how-to-fix-p0420', 'p0300-symptoms-random-misfire']) {
    if (!blogContent.includes(`slug: '${slug}'`)) failures.push(`${blogPath}: missing ${slug} pillar article`);
  }
}

const vehicleKnowledgePath = path.join('src', 'data', 'vehicle-knowledge.ts');
if (fs.existsSync(vehicleKnowledgePath)) {
  const vehicleKnowledge = fs.readFileSync(vehicleKnowledgePath, 'utf8');
  const profileBlocks = vehicleKnowledge.split(/\n  \{\n    make: /).slice(1);
  for (const block of profileBlocks) {
    const id = block.match(/^'([^']+)'\,\n    model: '([^']+)'/)?.slice(1).join('/') || 'unknown vehicle';
    for (const field of ['yearRanges', 'engineVariants', 'transmissionVariants', 'serviceIntervals', 'chronicProblems', 'diagnosticNotes', 'sourceNotes']) {
      if (!block.includes(`${field}:`)) failures.push(`${vehicleKnowledgePath}: ${id} missing ${field}`);
    }
  }
}

const toolDetailPath = path.join('src', 'app', '[locale]', 'tools', '[slug]', 'page.tsx');
if (fs.existsSync(toolDetailPath)) {
  const toolDetail = fs.readFileSync(toolDetailPath, 'utf8');
  for (const required of ['@type', 'SoftwareApplication', 'offers:', 'priceCurrency', 'availability', 'itemCondition']) {
    if (!toolDetail.includes(required)) failures.push(`${toolDetailPath}: SoftwareApplication schema missing ${required}`);
  }
}

const newsDir = path.join('src', 'data', 'news');
if (fs.existsSync(newsDir)) {
  const seenNewsSlugs = new Set();
  for (const file of fs.readdirSync(newsDir).filter(name => name.endsWith('.json'))) {
    const article = JSON.parse(fs.readFileSync(path.join(newsDir, file), 'utf8'));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || '')) {
      failures.push(`${path.join(newsDir, file)}: invalid news slug "${article.slug}"`);
    }
    if (seenNewsSlugs.has(article.slug)) failures.push(`${path.join(newsDir, file)}: duplicate news slug "${article.slug}"`);
    seenNewsSlugs.add(article.slug);
  }
}

for (const vehicleSchemaPath of [
  path.join('src', 'app', '[locale]', 'vehicles', '[make]', '[model]', 'page.tsx'),
  path.join('src', 'app', '[locale]', 'vehicles', '[make]', '[model]', '[year]', '[variant]', 'page.tsx'),
]) {
  if (!fs.existsSync(vehicleSchemaPath)) continue;
  const vehicleSchema = fs.readFileSync(vehicleSchemaPath, 'utf8');
  if (vehicleSchema.includes("'@type': 'Vehicle'") || vehicleSchema.includes('"@type": "Vehicle"')) {
    failures.push(`${vehicleSchemaPath}: avoid Vehicle schema on informational pages; it can trigger Product snippet offer errors`);
  }
}

if (failures.length > 0) {
  console.error('Content quality checks failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const symptomCheck = spawnSync(process.execPath, [path.join('scripts', 'check_symptom_content_quality.js')], { stdio: 'inherit' });
if (symptomCheck.status !== 0) process.exit(symptomCheck.status || 1);

const problemFinderCheck = spawnSync(process.execPath, [path.join('scripts', 'check_problem_finder_quality.js')], { stdio: 'inherit' });
if (problemFinderCheck.status !== 0) process.exit(problemFinderCheck.status || 1);

console.log('Content quality checks passed.');
