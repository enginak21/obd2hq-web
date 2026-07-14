export interface VehicleKnowledgeProfile {
  make: string;
  model: string;
  generation: string;
  years: string;
  bodyStyle: string;
  engines: string[];
  transmissions: string[];
  engineOil: string;
  transmissionFluid: string;
  coolant: string;
  brakeFluid: string;
  tireSizes: string[];
  boltPattern: string;
  wheelTorque: string;
  battery: string;
  obdPortLocation: string;
  fuseBox: string;
  maintenance: string[];
  knownProblems: string[];
  commonCodes: string[];
  compatibleTools: string[];
}

export const vehicleKnowledgeProfiles: VehicleKnowledgeProfile[] = [
  {
    make: 'toyota',
    model: 'camry',
    generation: 'XV70',
    years: '2018-2024',
    bodyStyle: 'Mid-size sedan',
    engines: ['A25A-FKS 2.5L I4', 'A25A-FXS Hybrid', '2GR-FKS 3.5L V6'],
    transmissions: ['Aisin 8-speed automatic', 'Toyota eCVT hybrid transaxle'],
    engineOil: '0W-16 or 0W-20 depending on engine and market; verify oil cap and owner manual.',
    transmissionFluid: 'Toyota WS ATF for automatic models; Toyota hybrid transaxle fluid for hybrid models.',
    coolant: 'Toyota Super Long Life Coolant or equivalent phosphate-enhanced Asian vehicle coolant.',
    brakeFluid: 'DOT 3 or DOT 4 brake fluid meeting Toyota specification.',
    tireSizes: ['205/65R16', '215/55R17', '235/45R18', '235/40R19'],
    boltPattern: '5x114.3',
    wheelTorque: '76 lb-ft / 103 Nm typical; verify wheel and market specification.',
    battery: 'Group 24F or AGM variant depending on trim/start-stop equipment.',
    obdPortLocation: 'Under the driver side dashboard, near the steering column and lower kick panel.',
    fuseBox: 'Engine compartment fuse box plus interior fuse panel under driver side dashboard.',
    maintenance: ['Oil and filter service', 'Engine air filter inspection', 'Brake fluid interval check', 'Coolant inspection', 'Hybrid battery cooling intake cleaning on hybrid models'],
    knownProblems: ['P0420 catalyst efficiency complaints on high mileage vehicles', 'EVAP small leak codes from cap/seal issues', 'Hybrid cooling intake blockage if neglected', 'Brake pulsation from rotor wear'],
    commonCodes: ['P0420', 'P0300', 'P0171', 'P0455', 'P0128'],
    compatibleTools: ['Live-data OBD2 scanner', 'Hybrid-capable scan tool for HV system data', 'I/M readiness scanner'],
  },
  {
    make: 'ford',
    model: 'focus',
    generation: 'Mk3',
    years: '2012-2018',
    bodyStyle: 'Compact hatchback/sedan',
    engines: ['2.0L Duratec GDI', '1.0L EcoBoost', '2.0L EcoBoost ST'],
    transmissions: ['Ford PowerShift DPS6 dual-clutch', 'Manual transmission', '6-speed automatic on selected markets'],
    engineOil: '5W-20 or 5W-30 depending on engine and market specification.',
    transmissionFluid: 'Ford dual-clutch fluid for DPS6; manual/automatic fluid depends on transmission code.',
    coolant: 'Ford orange/yellow coolant depending on year; do not mix incompatible coolant families.',
    brakeFluid: 'DOT 4 brake fluid.',
    tireSizes: ['195/65R15', '215/55R16', '215/50R17', '235/40R18'],
    boltPattern: '5x108',
    wheelTorque: '100 lb-ft / 135 Nm typical.',
    battery: 'Group 96R or equivalent depending on engine and trim.',
    obdPortLocation: 'Driver side lower dashboard, usually above the pedals or near the fuse cover.',
    fuseBox: 'Battery junction box in engine bay plus body control fuse panel inside cabin.',
    maintenance: ['Oil service', 'Spark plug interval', 'DCT clutch adaptive checks', 'Cooling system inspection', 'Brake fluid service'],
    knownProblems: ['PowerShift clutch shudder', 'P0213/P020x injector circuit diagnostics', 'EVAP purge valve issues', 'Misfire from plugs/coils', 'Boost/MAP issues on EcoBoost variants'],
    commonCodes: ['P0213', 'P0300', 'P0171', 'P0455', 'P0102'],
    compatibleTools: ['OBD2 scanner with Mode 6', 'Ford module-capable scan tool', 'Live-data scanner for fuel trim and misfire counters'],
  },
  {
    make: 'suzuki',
    model: 'jimny',
    generation: 'JB43/JB74',
    years: '1998-2024',
    bodyStyle: 'Compact 4x4 SUV',
    engines: ['M13A 1.3L', 'K15B 1.5L'],
    transmissions: ['5-speed manual', '4-speed automatic'],
    engineOil: '5W-30 or 0W-20 depending on engine generation and market.',
    transmissionFluid: 'Manual gear oil or automatic ATF per transmission code and market.',
    coolant: 'Long-life ethylene glycol coolant compatible with Suzuki specification.',
    brakeFluid: 'DOT 3 or DOT 4 brake fluid.',
    tireSizes: ['205/70R15', '195/80R15'],
    boltPattern: '5x139.7',
    wheelTorque: '74 lb-ft / 100 Nm typical.',
    battery: 'Compact JIS battery size depending on market and engine.',
    obdPortLocation: 'Under the driver side dashboard near the steering column.',
    fuseBox: 'Engine bay fuse/relay box and interior fuse box under dashboard.',
    maintenance: ['Transfer case and differential fluid checks', 'Spark plug inspection', 'Air filter service after off-road use', 'Brake inspection', 'Cooling system check'],
    knownProblems: ['Injector circuit codes P0203/P0204', 'MAP/boost plausibility P0235 on specific variants', 'Off-road connector contamination', 'Vacuum hose cracking', 'Wheel bearing wear'],
    commonCodes: ['P0203', 'P0204', 'P0235', 'P0300', 'P0171'],
    compatibleTools: ['Basic OBD2 live-data scanner', 'Multimeter for injector circuit checks', 'Smoke tester for intake leaks'],
  },
];

export function getVehicleKnowledge(make: string, model: string) {
  return vehicleKnowledgeProfiles.find(vehicle => vehicle.make === make && vehicle.model === model) || null;
}
