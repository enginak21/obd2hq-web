export interface EngineProfile {
  slug: string;
  manufacturer: string;
  family: string;
  production: string;
  configuration: string;
  displacement: string;
  induction: string;
  oilType: string;
  oilCapacity: string;
  timingDrive: string;
  commonFailures: string[];
  maintenance: string[];
  relatedCodes: string[];
  reliabilityScore: string;
}

export const engineProfiles: EngineProfile[] = [
  {
    slug: 'toyota-a25a-fks',
    manufacturer: 'Toyota',
    family: 'A25A-FKS Dynamic Force',
    production: '2017-present',
    configuration: 'Inline-4 gasoline',
    displacement: '2.5 L',
    induction: 'Naturally aspirated',
    oilType: '0W-16 or 0W-20 depending on market',
    oilCapacity: 'Around 4.5-4.8 qt with filter; verify exact model.',
    timingDrive: 'Timing chain',
    commonFailures: ['Fuel trim complaints from intake leaks', 'Coolant thermostat codes', 'Catalyst efficiency codes on high mileage vehicles'],
    maintenance: ['Use correct low-viscosity oil', 'Inspect PCV and intake boots', 'Monitor coolant temperature and fuel trims'],
    relatedCodes: ['P0420', 'P0171', 'P0128', 'P0300'],
    reliabilityScore: 'High when serviced with correct oil and cooling system maintenance.',
  },
  {
    slug: 'ford-1-0-ecoboost',
    manufacturer: 'Ford',
    family: '1.0 EcoBoost',
    production: '2012-present',
    configuration: 'Inline-3 gasoline',
    displacement: '1.0 L',
    induction: 'Turbocharged',
    oilType: 'Ford-approved 5W-20/5W-30 specification depending on market',
    oilCapacity: 'Around 4.1 qt / 3.9 L; verify exact model.',
    timingDrive: 'Wet belt on many variants',
    commonFailures: ['Cooling system leaks', 'Turbo/boost control issues', 'Oil specification sensitivity', 'Misfire under load'],
    maintenance: ['Use exact oil specification', 'Inspect coolant hoses', 'Check boost hoses and MAP data', 'Do not ignore overheating'],
    relatedCodes: ['P0235', 'P0299', 'P0300', 'P0101'],
    reliabilityScore: 'Moderate; highly maintenance-sensitive.',
  },
  {
    slug: 'volkswagen-ea888',
    manufacturer: 'Volkswagen Group',
    family: 'EA888',
    production: '2007-present',
    configuration: 'Inline-4 gasoline',
    displacement: '1.8-2.0 L',
    induction: 'Turbocharged',
    oilType: 'VW-approved synthetic oil, commonly 5W-30 or 5W-40 by spec',
    oilCapacity: 'Varies by generation, commonly around 5.5-6.0 qt.',
    timingDrive: 'Timing chain',
    commonFailures: ['PCV failure', 'Water pump/thermostat housing leaks', 'Carbon buildup', 'Timing chain tensioner issues on earlier generations'],
    maintenance: ['Monitor oil consumption', 'Inspect PCV and coolant leaks', 'Walnut blast intake valves when needed', 'Use VW-approved oil'],
    relatedCodes: ['P0171', 'P0300', 'P0011', 'P0299'],
    reliabilityScore: 'Moderate to high depending on generation and service history.',
  },
  {
    slug: 'bmw-b58',
    manufacturer: 'BMW',
    family: 'B58',
    production: '2015-present',
    configuration: 'Inline-6 gasoline',
    displacement: '3.0 L',
    induction: 'Turbocharged',
    oilType: 'BMW LL-approved synthetic oil, market dependent',
    oilCapacity: 'Around 6.5 L; verify chassis and model.',
    timingDrive: 'Timing chain',
    commonFailures: ['Cooling system components', 'PCV/oil separator issues', 'High-pressure fuel system complaints', 'Boost leaks'],
    maintenance: ['Use BMW-approved oil', 'Inspect charge pipes and coolant system', 'Monitor fuel trims and misfire counters'],
    relatedCodes: ['P0171', 'P0300', 'P0235', 'P0101'],
    reliabilityScore: 'High relative to many modern turbo engines when maintained correctly.',
  },
  {
    slug: 'honda-k20',
    manufacturer: 'Honda',
    family: 'K20',
    production: '2001-present',
    configuration: 'Inline-4 gasoline',
    displacement: '2.0 L',
    induction: 'Naturally aspirated or turbocharged by variant',
    oilType: '0W-20, 5W-20 or 5W-30 depending on generation and market',
    oilCapacity: 'Commonly around 4.4-5.7 qt depending on variant.',
    timingDrive: 'Timing chain',
    commonFailures: ['VTEC solenoid/screen issues', 'Valve adjustment neglect', 'Misfire from plugs/coils', 'Oil leaks on aging engines'],
    maintenance: ['Adjust valves where applicable', 'Use correct oil', 'Inspect VTEC solenoid screens', 'Service plugs on interval'],
    relatedCodes: ['P0300', 'P0011', 'P0171', 'P0420'],
    reliabilityScore: 'High; one of Honda’s strongest engine families with proper maintenance.',
  },
];

export function getEngineProfile(slug: string) {
  return engineProfiles.find(engine => engine.slug === slug) || null;
}
