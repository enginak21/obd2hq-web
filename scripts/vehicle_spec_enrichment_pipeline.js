/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const INPUT = process.env.INPUT || path.join('work', 'vehicle-spec-seeds.json');
const OUTPUT = process.env.OUTPUT || path.join('work', 'vehicle-spec-enriched.json');
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const API_KEY = process.env.OPENAI_API_KEY || '';
const LIMIT = Number.parseInt(process.env.LIMIT || '0', 10);
const START_INDEX = Number.parseInt(process.env.START_INDEX || '0', 10);
const CHECKPOINT_EVERY = Math.max(1, Number.parseInt(process.env.CHECKPOINT_EVERY || '1', 10));
const RETRIES = Math.max(0, Number.parseInt(process.env.RETRIES || '3', 10));

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
  'displacement',
  'power',
  'torque',
  'fuelSystem',
  'timingDrive',
  'recommendedOil',
  'oilCapacity',
  'coolantCapacity',
  'transmissionFluid',
  'differentialFluid',
  'brakeFluid',
  'sparkPlugs',
  'serviceInterval',
  'tireSizes',
  'commonProblems',
  'firstChecks',
  'relatedCodes',
  'notes',
  'sourceNotes',
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readJson(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Input file not found: ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function recordKey(record) {
  return `${record.make}/${record.model}/${record.year}/${record.slug || slugify(record.trim || 'technical-profile')}`;
}

function writeJson(file, records) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

function validateRecord(record, index) {
  const missing = requiredFields.filter(field => record[field] === undefined || record[field] === null || record[field] === '');
  const arrayFields = ['engineCodes', 'tireSizes', 'commonProblems', 'firstChecks', 'relatedCodes', 'notes', 'sourceNotes'];
  const badArrays = arrayFields.filter(field => !Array.isArray(record[field]) || record[field].length === 0);
  if (missing.length || badArrays.length) {
    throw new Error(`Record ${index} failed validation. Missing: ${missing.join(', ') || '-'} Bad arrays: ${badArrays.join(', ') || '-'}`);
  }
  if (!Number.isInteger(Number(record.year))) throw new Error(`Record ${index} has invalid year: ${record.year}`);
  if (!record.slug) record.slug = slugify(record.trim);
  return record;
}

function buildPrompt(seed) {
  return `
You are building a verified automotive vehicle specification database.

Return exactly one JSON object for this vehicle selection:
- make: ${seed.make}
- model family: ${seed.model}
- year: ${seed.year}
- trim/version: ${seed.trim}
- market: ${seed.market || 'global / specify if market-specific'}

Rules:
- Do not invent uncertain exact values. If a value depends on market/production month, state that clearly.
- Engine oil capacity must include service-fill wording and filter note when known.
- Engine code must be specific, not a generic displacement label.
- Include at least 2 sourceNotes as short source descriptions, not raw marketing language.
- Keep text concise and suitable for a public technical database.
- Return JSON only. No markdown.

Schema:
{
  "make": "bmw",
  "model": "5-series",
  "displayName": "BMW 5 Series",
  "generation": "E34",
  "year": 1991,
  "trim": "520i",
  "slug": "520i",
  "chassisCode": "E34",
  "bodyStyle": "Sedan",
  "market": "Europe / selected global markets",
  "engineCodes": ["M50B20"],
  "engineSummary": "...",
  "displacement": "...",
  "power": "...",
  "torque": "...",
  "fuelSystem": "...",
  "timingDrive": "...",
  "recommendedOil": "...",
  "oilCapacity": "...",
  "coolantCapacity": "...",
  "manualTransmission": "...",
  "automaticTransmission": "...",
  "transmissionFluid": "...",
  "differentialFluid": "...",
  "brakeFluid": "...",
  "sparkPlugs": "...",
  "serviceInterval": "...",
  "tireSizes": ["..."],
  "commonProblems": ["..."],
  "firstChecks": ["..."],
  "relatedCodes": ["..."],
  "notes": ["..."],
  "sourceNotes": ["..."]
}`;
}

async function enrichWithOpenAI(seed) {
  if (!API_KEY) {
    return {
      ...seed,
      slug: seed.slug || slugify(seed.trim),
      sourceNotes: seed.sourceNotes || ['Manual seed only. Set OPENAI_API_KEY to enrich and verify this record.'],
    };
  }

  let lastError = null;
  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    if (attempt > 0) {
      const delay = 1000 * attempt * attempt;
      console.log(`Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: buildPrompt(seed),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.output_text || data.output?.flatMap(item => item.content || []).map(item => item.text || '').join('') || '';
      return JSON.parse(text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim());
    }

    const body = await response.text();
    lastError = new Error(`OpenAI API ${response.status}: ${body}`);
    if (![408, 429, 500, 502, 503, 504].includes(response.status)) break;
  }

  throw lastError;
}

async function main() {
  const seeds = readJson(INPUT);
  if (!Array.isArray(seeds)) throw new Error('Input must be an array of vehicle seeds.');

  const existing = fs.existsSync(OUTPUT) ? readJson(OUTPUT) : [];
  if (!Array.isArray(existing)) throw new Error('Existing output must be an array.');

  const enrichedByKey = new Map();
  for (let index = 0; index < existing.length; index += 1) {
    const record = validateRecord(existing[index], index + 1);
    enrichedByKey.set(recordKey(record), record);
  }

  const endIndex = LIMIT > 0 ? Math.min(seeds.length, START_INDEX + LIMIT) : seeds.length;
  let processed = 0;
  let created = 0;

  for (let index = START_INDEX; index < endIndex; index += 1) {
    const seed = seeds[index];
    const key = recordKey(seed);
    if (enrichedByKey.has(key)) {
      console.log(`Skipping existing ${index + 1}/${seeds.length}: ${key}`);
      continue;
    }

    console.log(`Enriching ${index + 1}/${seeds.length}: ${seed.make} ${seed.model} ${seed.year} ${seed.trim}`);
    const record = await enrichWithOpenAI(seed);
    const validRecord = validateRecord(record, index + 1);
    enrichedByKey.set(recordKey(validRecord), validRecord);
    processed += 1;
    created += 1;

    if (processed % CHECKPOINT_EVERY === 0) {
      writeJson(OUTPUT, Array.from(enrichedByKey.values()));
      console.log(`Checkpoint saved ${enrichedByKey.size} records to ${OUTPUT}`);
    }
  }

  writeJson(OUTPUT, Array.from(enrichedByKey.values()));
  console.log(`Saved ${OUTPUT}. Created ${created}; total ${enrichedByKey.size}.`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
