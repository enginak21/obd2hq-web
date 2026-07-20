import baseCodes from './base_codes.json';
import aiData from './ai_enriched_data.json';

export type MultiLangString = string | {
  en: string;
  tr: string;
  de: string;
  es: string;
  fr: string;
};

export type MultiLangArray = string[] | {
  en: string[];
  tr: string[];
  de: string[];
  es: string[];
  fr: string[];
};

export interface OBD2Code {
  code: string;
  title: MultiLangString;
  description: MultiLangString;
  symptoms: string[];
  causes: string[];
  fixDifficulty: string;
  estimatedCost: string;

  diagnosticSteps?: MultiLangArray;
  commonFixes?: MultiLangArray;
  drivingSafety?: {
    level: 'safe' | 'caution' | 'danger';
    description: MultiLangString;
  };
  costBreakdown?: {
    parts: string;
    labor: string;
  };
  isEnriched?: boolean;
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

export const codes = baseCodes as Record<string, Partial<OBD2Code>>;
export { baseCodes };

type LocalizedValue = string | string[] | Record<string, string | string[]>;

export function getLocalized(field: LocalizedValue | null | undefined, locale: string): string | string[] | null {
  if (!field) return null;
  if (typeof field === 'string' || Array.isArray(field)) return field;
  return field[locale] || field.en || null;
}

function isTokenizedArray(value: unknown, prefix: string): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string' && item.startsWith(prefix));
}

function normalizeDifficulty(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.toLowerCase();
  if (normalized === 'easy') return 'diff_easy';
  if (normalized === 'moderate') return 'diff_moderate';
  if (normalized === 'hard') return 'diff_hard';
  if (normalized === 'professional') return 'diff_professional';
  return value.startsWith('diff_') ? value : fallback;
}

export function getHybridObdData(make: string, model: string, code: string): OBD2Code | null {
  const upperCode = code.toUpperCase();
  const baseData = codes[upperCode];

  if (!baseData) return null;

  let hybridData: OBD2Code = {
    code: upperCode,
    title: baseData.title || upperCode,
    description: baseData.description || `Code ${upperCode} is a standard OBD2 diagnostic trouble code. Use scan data and related symptoms to confirm the root cause before replacing parts.`,
    symptoms: baseData.symptoms || ['symp_check_engine', 'symp_power_loss', 'symp_fuel_economy'],
    causes: baseData.causes || ['cause_wiring_damage', 'cause_vacuum_leak', 'cause_connector_corrosion'],
    fixDifficulty: baseData.fixDifficulty || 'diff_moderate',
    estimatedCost: baseData.estimatedCost || '$100 - $450',
    diagnosticSteps: baseData.diagnosticSteps,
    commonFixes: baseData.commonFixes,
    drivingSafety: baseData.drivingSafety,
    costBreakdown: baseData.costBreakdown
  };

  let isEnriched = false;
  const typedAiData = aiData as Record<string, Record<string, Record<string, Partial<OBD2Code>>>>;
  const aiEnrichment = typedAiData[make]?.[model]?.[upperCode];
  if (aiEnrichment) {
    isEnriched = true;
    hybridData = {
      ...hybridData,
      symptoms: isTokenizedArray(aiEnrichment.symptoms, 'symp_') ? aiEnrichment.symptoms : hybridData.symptoms,
      causes: isTokenizedArray(aiEnrichment.causes, 'cause_') ? aiEnrichment.causes : hybridData.causes,
      fixDifficulty: normalizeDifficulty(aiEnrichment.fixDifficulty, hybridData.fixDifficulty),
      estimatedCost: aiEnrichment.estimatedCost || hybridData.estimatedCost,
      diagnosticSteps: aiEnrichment.diagnosticSteps || hybridData.diagnosticSteps,
      commonFixes: aiEnrichment.commonFixes || hybridData.commonFixes,
      drivingSafety: aiEnrichment.drivingSafety || hybridData.drivingSafety,
      costBreakdown: aiEnrichment.costBreakdown || hybridData.costBreakdown
    };
  }

  return { ...hybridData, isEnriched };
}
