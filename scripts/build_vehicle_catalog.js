/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const START_YEAR = Number(process.env.START_YEAR || 1996);
const END_YEAR = Number(process.env.END_YEAR || new Date().getFullYear());
const VEHICLE_TYPE = process.env.VEHICLE_TYPE || 'car';
const CONCURRENCY = Number(process.env.CONCURRENCY || 8);
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 0);
const CHECKPOINT_EVERY = Number(process.env.CHECKPOINT_EVERY || 100);
const OVERWRITE = process.env.OVERWRITE === '1';
const OUT_DIR = path.join(__dirname, '..', 'src', 'data', 'generated');
const OUT_FILE = path.join(OUT_DIR, 'vehicle-catalog.json');
const BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

async function getJson(url, retries = 3) {
  const response = await fetch(url);
  if (!response.ok) {
    if ((response.status === 403 || response.status === 429 || response.status >= 500) && retries > 0) {
      const waitMs = (4 - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitMs));
      return getJson(url, retries - 1);
    }
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log(`Building vehicle catalog from NHTSA vPIC (${START_YEAR}-${END_YEAR}, type=${VEHICLE_TYPE}, concurrency=${CONCURRENCY})...`);

  const makesUrl = `${BASE_URL}/GetMakesForVehicleType/${encodeURIComponent(VEHICLE_TYPE)}?format=json`;
  const makesData = await getJson(makesUrl);
  const existingCatalog = fs.existsSync(OUT_FILE) ? JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) : null;
  const existingByMakeId = new Map((existingCatalog?.makes || []).map(make => [make.makeId, make]));

  const makes = (makesData.Results || [])
    .filter(make => make.MakeId && make.MakeName)
    .map(make => ({
      makeId: make.MakeId,
      name: make.MakeName,
      slug: slugify(make.MakeName),
      years: existingByMakeId.get(make.MakeId)?.years || {},
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const catalog = {
    generatedAt: new Date().toISOString(),
    source: 'NHTSA vPIC public vehicle API',
    sourceUrl: BASE_URL,
    vehicleType: VEHICLE_TYPE,
    startYear: START_YEAR,
    endYear: END_YEAR,
    warning: 'This catalog is a make/model/year scaffold. Engine codes, oil capacities and fluids must be verified before publishing as rich vehicle profiles.',
    errors: [],
    makes,
  };

  function saveCatalog() {
    catalog.generatedAt = new Date().toISOString();
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  }

  const tasks = [];
  for (const make of makes) {
    for (let year = START_YEAR; year <= END_YEAR; year += 1) {
      const key = String(year);
      if (!OVERWRITE && Array.isArray(make.years[key])) continue;
      tasks.push({ make, year });
    }
  }

  let nextTask = 0;
  let completed = 0;
  async function worker(workerId) {
    while (nextTask < tasks.length) {
      const task = tasks[nextTask];
      nextTask += 1;
      const { make, year } = task;
      const modelsUrl = `${BASE_URL}/GetModelsForMakeIdYear/makeId/${make.makeId}/modelyear/${year}/vehicleType/${encodeURIComponent(VEHICLE_TYPE)}?format=json`;
      try {
        const modelsData = await getJson(modelsUrl);
        const models = [...new Map((modelsData.Results || [])
          .filter(model => model.Model_Name)
          .map(model => [slugify(model.Model_Name), {
            name: model.Model_Name,
            slug: slugify(model.Model_Name),
          }])).values()]
          .sort((a, b) => a.name.localeCompare(b.name));

        make.years[String(year)] = models;
      } catch (error) {
        console.error(`[worker ${workerId}] ${make.name} ${year}: ${error.message}`);
        catalog.errors.push({
          makeId: make.makeId,
          make: make.name,
          year,
          error: error.message,
        });
      }

      completed += 1;
      if (completed % CHECKPOINT_EVERY === 0) {
        saveCatalog();
        console.log(`Checkpoint: ${completed}/${tasks.length} year/make pairs`);
      }
      if (REQUEST_DELAY_MS > 0) await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, index) => worker(index + 1)));
  saveCatalog();
  console.log(`Saved ${OUT_FILE}`);
  console.log(`Makes: ${makes.length}`);
  console.log(`Year/make pairs processed: ${completed}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
