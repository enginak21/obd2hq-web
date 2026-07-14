/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const INPUT = process.env.INPUT || path.join('work', 'vehicle-spec-enriched.json');
const OUTPUT = process.env.OUTPUT || path.join('src', 'data', 'generated', 'vehicle-specs.json');

const requiredFields = [
  'make',
  'model',
  'displayName',
  'generation',
  'year',
  'trim',
  'slug',
  'chassisCode',
  'bodyStyle',
  'market',
  'engineCodes',
  'engineSummary',
  'recommendedOil',
  'oilCapacity',
  'transmissionFluid',
  'commonProblems',
  'firstChecks',
  'relatedCodes',
  'sourceNotes',
];

function validate(record, index) {
  const missing = requiredFields.filter(field => record[field] === undefined || record[field] === null || record[field] === '');
  const badArrays = ['engineCodes', 'commonProblems', 'firstChecks', 'relatedCodes', 'sourceNotes'].filter(field => !Array.isArray(record[field]) || record[field].length === 0);
  if (missing.length || badArrays.length) {
    throw new Error(`Record ${index} invalid. Missing: ${missing.join(', ') || '-'} Bad arrays: ${badArrays.join(', ') || '-'}`);
  }
}

if (!fs.existsSync(INPUT)) throw new Error(`Input not found: ${INPUT}`);
const records = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
if (!Array.isArray(records)) throw new Error('Input must be an array.');

records.forEach(validate);
const unique = new Map();
for (const record of records) {
  unique.set(`${record.make}/${record.model}/${record.year}/${record.slug}`, record);
}

const output = Array.from(unique.values()).sort((a, b) => `${a.make}/${a.model}/${a.year}/${a.slug}`.localeCompare(`${b.make}/${b.model}/${b.year}/${b.slug}`));
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Published ${output.length} vehicle spec records to ${OUTPUT}`);
