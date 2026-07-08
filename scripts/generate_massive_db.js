/* eslint-disable @typescript-eslint/no-require-imports */  
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');

// Massive list of car makes and models
const cars = [
  { make: 'nissan', models: ['altima', 'sentra', 'rogue', 'maxima', 'pathfinder', 'murano', 'versa', 'titan'] },
  { make: 'chevrolet', models: ['silverado', 'malibu', 'equinox', 'camaro', 'tahoe', 'suburban', 'colorado', 'traverse', 'cruze', 'impala'] },
  { make: 'toyota', models: ['camry', 'corolla', 'rav4', 'highlander', 'tacoma', 'tundra', 'sienna', '4runner', 'prius', 'avalon'] },
  { make: 'ford', models: ['f150', 'mustang', 'explorer', 'escape', 'focus', 'fusion', 'edge', 'ranger', 'expedition', 'taurus'] },
  { make: 'honda', models: ['civic', 'accord', 'cr-v', 'pilot', 'odyssey', 'fit', 'ridgeline', 'hr-v'] },
  { make: 'bmw', models: ['3series', '5series', 'x3', 'x5', '4series', '7series', 'x1', 'm3'] },
  { make: 'mercedes', models: ['c-class', 'e-class', 'glc', 'gle', 's-class', 'a-class', 'cla'] },
  { make: 'audi', models: ['a3', 'a4', 'a6', 'q3', 'q5', 'q7', 'tt'] },
  { make: 'volkswagen', models: ['jetta', 'passat', 'tiguan', 'golf', 'atlas', 'touareg', 'beetle'] },
  { make: 'hyundai', models: ['elantra', 'sonata', 'tucson', 'santa-fe', 'kona', 'palisade', 'accent'] },
  { make: 'kia', models: ['optima', 'sorento', 'sportage', 'soul', 'forte', 'telluride', 'rio'] },
  { make: 'subaru', models: ['outback', 'forester', 'crosstrek', 'impreza', 'legacy', 'wrx'] },
  { make: 'mazda', models: ['mazda3', 'mazda6', 'cx-5', 'cx-9', 'mx-5', 'cx-30'] },
  { make: 'lexus', models: ['rx', 'es', 'nx', 'is', 'gx', 'ls'] },
  { make: 'jeep', models: ['wrangler', 'grand-cherokee', 'cherokee', 'compass', 'renegade'] },
  { make: 'dodge', models: ['charger', 'challenger', 'durango', 'grand-caravan', 'journey'] },
  { make: 'ram', models: ['1500', '2500', '3500'] },
  { make: 'gmc', models: ['sierra', 'acadia', 'terrain', 'yukon', 'canyon'] },
  { make: 'porsche', models: ['911', 'cayenne', 'macan', 'panamera', 'taycan'] },
  { make: 'volvo', models: ['xc90', 'xc60', 's60', 'xc40', 'v60'] }
];

function getCategoryDescription(codeNum) {
  if (codeNum >= 100 && codeNum <= 199) return "Fuel and Air Metering System";
  if (codeNum >= 200 && codeNum <= 299) return "Fuel and Air Metering (Injector Circuit)";
  if (codeNum >= 300 && codeNum <= 399) return "Ignition System or Misfire";
  if (codeNum >= 400 && codeNum <= 499) return "Auxiliary Emission Controls";
  if (codeNum >= 500 && codeNum <= 599) return "Vehicle Speed Controls and Idle Control System";
  if (codeNum >= 600 && codeNum <= 699) return "Computer Output Circuit";
  if (codeNum >= 700 && codeNum <= 899) return "Transmission System";
  return "Powertrain System";
}

const baseCodes = {};

// Hardcode some extremely popular ones accurately
const popularCodes = {
  "P0171": { title: "System Too Lean (Bank 1)", desc: "The engine is receiving too much air or not enough fuel." },
  "P0172": { title: "System Too Rich (Bank 1)", desc: "The engine is receiving too much fuel or not enough air." },
  "P0300": { title: "Random/Multiple Cylinder Misfire Detected", desc: "Engine is misfiring across multiple cylinders." },
  "P0420": { title: "Catalyst System Efficiency Below Threshold (Bank 1)", desc: "Catalytic converter is not functioning efficiently." },
  "P0430": { title: "Catalyst System Efficiency Below Threshold (Bank 2)", desc: "Catalytic converter is not functioning efficiently." },
  "P0442": { title: "Evaporative Emission System Leak Detected (small leak)", desc: "Small leak in the EVAP system (often a loose gas cap)." },
  "P0455": { title: "Evaporative Emission System Leak Detected (large leak)", desc: "Large leak in the EVAP system." },
  "P0500": { title: "Vehicle Speed Sensor Malfunction", desc: "VSS is sending erratic or no signals." }
};

// Generate thousands of codes programmatically
for (let i = 100; i <= 999; i++) {
  const code = 'P0' + i;
  if (popularCodes[code]) {
    baseCodes[code] = { title: popularCodes[code].title, description: popularCodes[code].desc };
  } else {
    const category = getCategoryDescription(i);
    baseCodes[code] = { 
      title: `${category} Malfunction (${code})`, 
      description: `Diagnostic trouble code ${code} indicates a generic malfunction within the ${category.toLowerCase()}.` 
    };
  }
}

// Generate P2000 to P2999
for (let i = 2000; i <= 2999; i++) {
  const code = 'P' + i;
  baseCodes[code] = { 
    title: `ISO/SAE Controlled Powertrain Code (${code})`, 
    description: `Diagnostic trouble code ${code} is an ISO/SAE specified code indicating a powertrain issue.` 
  };
}

fs.writeFileSync(path.join(DATA_DIR, 'base_codes.json'), JSON.stringify(baseCodes, null, 2));

// Update db.ts to have the massive car list
const dbTsContent = `import baseCodes from './base_codes.json';
import aiData from './ai_enriched_data.json';

export interface OBD2Code {
  code: string;
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  fixDifficulty: string;
  estimatedCost: string;
}

export interface CarModel {
  make: string;
  models: string[];
}

export const cars: CarModel[] = ${JSON.stringify(cars, null, 2)};

export const codes = baseCodes as Record<string, { title: string; description: string }>;

export function getHybridObdData(make: string, model: string, code: string): OBD2Code | null {
  const upperCode = code.toUpperCase();
  const baseData = codes[upperCode];
  
  if (!baseData) return null;

  let hybridData: OBD2Code = {
    code: upperCode,
    title: baseData.title,
    description: baseData.description,
    symptoms: ['Check Engine Light is illuminated', 'Decreased engine performance', 'Noticeable drop in fuel economy'],
    causes: ['Faulty sensor or damaged wiring', 'Vacuum or exhaust leak', 'Internal component wear and tear'],
    fixDifficulty: 'Moderate',
    estimatedCost: '$100 - $450'
  };

  const aiEnrichment = (aiData as any)[make]?.[model]?.[upperCode];
  if (aiEnrichment) {
    hybridData = {
      ...hybridData,
      symptoms: aiEnrichment.symptoms,
      causes: aiEnrichment.causes,
      fixDifficulty: aiEnrichment.fixDifficulty,
      estimatedCost: aiEnrichment.estimatedCost
    };
  }

  return hybridData;
}
`;

fs.writeFileSync(path.join(DATA_DIR, 'db.ts'), dbTsContent);

console.log('✅ Massive database generated successfully!');
console.log(`- 20 Car Makes`);
console.log(`- ~150 Car Models`);
console.log(`- 1900 OBD2 Codes`);
console.log(`Total Pages Available to Generate: 20 * ~7 * 1900 = ~266,000 pages!`);
