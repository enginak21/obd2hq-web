/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const START_YEAR = Number(process.env.START_YEAR || 1996);
const END_YEAR = Number(process.env.END_YEAR || new Date().getFullYear());
const MAKE = process.env.MAKE || '';
const MODEL = process.env.MODEL || '';
const OUT = process.env.OUT || path.join('work', 'vehicle-spec-seeds.json');

const dbPath = path.join(__dirname, '..', 'src', 'data', 'db.ts');
const dbText = fs.readFileSync(dbPath, 'utf8');
const carsMatch = dbText.match(/export const cars: CarModel\[] = (\[[\s\S]*?\]);/);
if (!carsMatch) throw new Error('Could not locate cars array in src/data/db.ts');

const cars = Function(`return ${carsMatch[1]};`)();

function displayName(make, model) {
  return `${make.replace(/-/g, ' ')} ${model.replace(/-/g, ' ')}`.replace(/\b\w/g, char => char.toUpperCase());
}

const seeds = [];
for (const car of cars) {
  if (MAKE && car.make !== MAKE) continue;
  for (const model of car.models) {
    if (MODEL && model !== MODEL) continue;
    for (let year = START_YEAR; year <= END_YEAR; year += 1) {
      seeds.push({
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

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(seeds, null, 2)}\n`, 'utf8');
console.log(`Saved ${seeds.length} seeds to ${OUT}`);
