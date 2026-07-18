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

const failures = [];
for (const root of roots) {
  for (const file of walk(root)) {
    if (ignoredPathParts.some(part => file.includes(part))) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (mojibakePattern.test(content)) failures.push(`${file}: contains mojibake markers`);
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
