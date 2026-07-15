/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const START_YEAR = Number(process.env.START_YEAR || 1996);
const END_YEAR = Number(process.env.END_YEAR || new Date().getFullYear());
const MAKE = process.env.MAKE || '';
const MODEL = process.env.MODEL || '';
const OUT = process.env.OUT || path.join('work', 'vehicle-spec-seeds.json');
const USE_GENERATED_CATALOG = process.env.USE_GENERATED_CATALOG !== '0';

const dbPath = path.join(__dirname, '..', 'src', 'data', 'db.ts');
const dbText = fs.readFileSync(dbPath, 'utf8');
const carsMatch = dbText.match(/export const cars: CarModel\[] = (\[[\s\S]*?\]);/);
if (!carsMatch) throw new Error('Could not locate cars array in src/data/db.ts');

const cars = Function(`return ${carsMatch[1]};`)();
const generatedCatalogPath = path.join(__dirname, '..', 'src', 'data', 'generated', 'vehicle-catalog.json');

function displayName(make, model) {
  return `${make.replace(/-/g, ' ')} ${model.replace(/-/g, ' ')}`.replace(/\b\w/g, char => char.toUpperCase());
}

function buildSeedsFromGeneratedCatalog() {
  if (!USE_GENERATED_CATALOG || !fs.existsSync(generatedCatalogPath)) return [];
  const catalog = JSON.parse(fs.readFileSync(generatedCatalogPath, 'utf8'));
  const output = [];

  for (const make of catalog.makes || []) {
    if (MAKE && make.slug !== MAKE) continue;
    for (const [yearValue, models] of Object.entries(make.years || {})) {
      const year = Number(yearValue);
      if (!Number.isInteger(year) || year < START_YEAR || year > END_YEAR || !Array.isArray(models)) continue;
      for (const model of models) {
        if (MODEL && model.slug !== MODEL) continue;
        output.push({
          make: make.slug,
          model: model.slug,
          displayName: `${make.name} ${model.name}`,
          generation: 'verify-by-market',
          year,
          trim: 'technical-profile',
          slug: 'technical-profile',
          market: 'global / verify exact market',
        });
      }
    }
  }

  return output;
}

function buildSeedsFromDb() {
  const output = [];
  for (const car of cars) {
    if (MAKE && car.make !== MAKE) continue;
    for (const model of car.models) {
      if (MODEL && model !== MODEL) continue;
      for (let year = START_YEAR; year <= END_YEAR; year += 1) {
        output.push({
          make: car.make,
          model,
          displayName: displayName(car.make, model),
          generation: 'verify-by-market',
          year,
          trim: 'technical-profile',
          slug: 'technical-profile',
          market: 'global / verify exact market',
        });
      }
    }
  }

  return output;
}

const seeds = buildSeedsFromGeneratedCatalog();
const finalSeeds = seeds.length > 0 ? seeds : buildSeedsFromDb();
const uniqueSeeds = new Map();
for (const seed of finalSeeds) {
  uniqueSeeds.set(`${seed.make}/${seed.model}/${seed.year}/${seed.slug}`, seed);
}
const sortedSeeds = Array.from(uniqueSeeds.values()).sort((a, b) => `${a.make}/${a.model}/${a.year}`.localeCompare(`${b.make}/${b.model}/${b.year}`));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(sortedSeeds, null, 2)}\n`, 'utf8');
console.log(`Saved ${sortedSeeds.length} seeds to ${OUT}`);
