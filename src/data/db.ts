import baseCodes from './base_codes.json';
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

export const cars: CarModel[] = [
  { "make": "acura", "models": ["mdx", "rdx", "tlx", "ilx", "integra", "nsx"] },
  { "make": "alfa-romeo", "models": ["giulia", "stelvio", "tonale", "4c", "giulietta"] },
  { "make": "aston-martin", "models": ["vantage", "db11", "dbs", "dbx", "valkyrie"] },
  { "make": "audi", "models": ["a3", "a4", "a5", "a6", "q3", "q5", "q7", "q8", "etron", "tt", "r8"] },
  { "make": "bentley", "models": ["continental", "bentayga", "flying-spur", "mulsanne"] },
  { "make": "bmw", "models": ["3-series", "4-series", "5-series", "x1", "x3", "x5", "x7", "m3", "m5", "i4", "iX"] },
  { "make": "buick", "models": ["envision", "encore", "enclave", "regal", "lacrosse"] },
  { "make": "cadillac", "models": ["escalade", "xt4", "xt5", "xt6", "ct4", "ct5", "lyriq"] },
  { "make": "chevrolet", "models": ["silverado", "equinox", "tahoe", "malibu", "camaro", "corvette", "colorado", "suburban", "traverse", "trailblazer"] },
  { "make": "chrysler", "models": ["pacifica", "300", "voyager", "pt-cruiser"] },
  { "make": "dodge", "models": ["charger", "challenger", "durango", "ram", "journey", "grand-caravan", "dart"] },
  { "make": "ferrari", "models": ["488", "f8", "roma", "sf90", "portofino", "purosangue"] },
  { "make": "fiat", "models": ["500", "500x", "500l", "124-spider", "panda", "punto"] },
  { "make": "ford", "models": ["f-150", "mustang", "explorer", "escape", "bronco", "edge", "ranger", "expedition", "focus", "fusion", "fiesta"] },
  { "make": "genesis", "models": ["g70", "g80", "g90", "gv70", "gv80"] },
  { "make": "gmc", "models": ["sierra", "acadia", "terrain", "yukon", "canyon", "hummer-ev"] },
  { "make": "honda", "models": ["civic", "accord", "cr-v", "pilot", "odyssey", "hr-v", "ridgeline", "fit", "passport"] },
  { "make": "hyundai", "models": ["elantra", "sonata", "tucson", "santa-fe", "palisade", "kona", "ioniq-5", "veloster"] },
  { "make": "infiniti", "models": ["q50", "q60", "qx50", "qx60", "qx80", "g37"] },
  { "make": "jaguar", "models": ["f-pace", "e-pace", "i-pace", "f-type", "xe", "xf", "xj"] },
  { "make": "jeep", "models": ["wrangler", "grand-cherokee", "cherokee", "compass", "renegade", "gladiator", "wagoneer"] },
  { "make": "kia", "models": ["optima", "sorento", "sportage", "telluride", "soul", "stinger", "k5", "ev6", "forte"] },
  { "make": "lamborghini", "models": ["huracan", "aventador", "urus", "gallardo"] },
  { "make": "land-rover", "models": ["range-rover", "defender", "discovery", "evoque", "velar", "freelander"] },
  { "make": "lexus", "models": ["rx", "nx", "es", "is", "gx", "lx", "rc", "lc", "ux"] },
  { "make": "lincoln", "models": ["navigator", "aviator", "corsair", "nautilus", "continental"] },
  { "make": "maserati", "models": ["ghibli", "levante", "quattroporte", "grecale", "granturismo"] },
  { "make": "mazda", "models": ["mazda3", "mazda6", "cx-5", "cx-9", "cx-30", "cx-50", "mx-5"] },
  { "make": "mclaren", "models": ["720s", "570s", "artura", "gt", "p1"] },
  { "make": "mercedes-benz", "models": ["c-class", "e-class", "s-class", "glc", "gle", "gls", "g-class", "a-class", "cla", "eqs"] },
  { "make": "mini", "models": ["cooper", "countryman", "clubman", "paceman"] },
  { "make": "mitsubishi", "models": ["outlander", "eclipse-cross", "mirage", "lancer", "pajero"] },
  { "make": "nissan", "models": ["altima", "sentra", "rogue", "maxima", "pathfinder", "murano", "versa", "titan", "frontier", "leaf", "gt-r", "350z", "370z"] },
  { "make": "peugeot", "models": ["208", "308", "2008", "3008", "5008", "508"] },
  { "make": "porsche", "models": ["911", "cayenne", "macan", "panamera", "taycan", "boxster", "cayman"] },
  { "make": "ram", "models": ["1500", "2500", "3500", "promaster"] },
  { "make": "renault", "models": ["clio", "megane", "captur", "kadjar", "zoe"] },
  { "make": "rolls-royce", "models": ["phantom", "ghost", "cullinan", "wraith", "dawn"] },
  { "make": "subaru", "models": ["outback", "forester", "crosstrek", "impreza", "wrx", "ascent", "brz"] },
  { "make": "suzuki", "models": ["swift", "vitara", "jimny", "sx4", "ignis"] },
  { "make": "tesla", "models": ["model-3", "model-y", "model-s", "model-x", "cybertruck"] },
  { "make": "toyota", "models": ["camry", "corolla", "rav4", "highlander", "tacoma", "tundra", "prius", "sienna", "4runner", "yaris", "supra", "c-hr"] },
  { "make": "volkswagen", "models": ["jetta", "passat", "tiguan", "atlas", "golf", "id4", "taos", "arteon", "polo", "touareg"] },
  { "make": "volvo", "models": ["xc90", "xc60", "s60", "xc40", "v60", "s90"] }
];

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

  const typedAiData = aiData as Record<string, Record<string, Record<string, Partial<OBD2Code>>>>;
  const aiEnrichment = typedAiData[make]?.[model]?.[upperCode];
  if (aiEnrichment) {
    hybridData = {
      ...hybridData,
      symptoms: aiEnrichment.symptoms || hybridData.symptoms,
      causes: aiEnrichment.causes || hybridData.causes,
      fixDifficulty: aiEnrichment.fixDifficulty || hybridData.fixDifficulty,
      estimatedCost: aiEnrichment.estimatedCost || hybridData.estimatedCost
    };
  }

  return hybridData;
}
