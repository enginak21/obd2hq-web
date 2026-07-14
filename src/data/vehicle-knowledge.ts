export interface VehicleKnowledgeProfile {
  make: string;
  model: string;
  displayName?: string;
  generation: string;
  years: string;
  bodyStyle: string;
  markets?: string[];
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
  coverageLevel?: 'seed' | 'expanded' | 'verified';
  yearRanges?: VehicleYearRange[];
  engineVariants?: EngineVariant[];
  transmissionVariants?: TransmissionVariant[];
  serviceIntervals?: ServiceInterval[];
  chronicProblems?: ChronicProblem[];
  diagnosticNotes?: DiagnosticNote[];
  sourceNotes?: string[];
  yearTrimVariants?: VehicleYearTrimVariant[];
}

export interface VehicleYearRange {
  years: string;
  generation: string;
  facelift?: string;
  notes: string;
}

export interface EngineVariant {
  code: string;
  name: string;
  years: string;
  displacement: string;
  fuel: string;
  induction: string;
  oilViscosity: string;
  oilCapacity: string;
  timingDrive: string;
  sparkPlugInterval?: string;
  commonIssues: string[];
  relatedCodes: string[];
  notes: string;
}

export interface TransmissionVariant {
  code: string;
  name: string;
  years: string;
  type: string;
  fluid: string;
  serviceNote: string;
  commonIssues: string[];
  relatedCodes: string[];
}

export interface ServiceInterval {
  item: string;
  interval: string;
  notes: string;
  relatedCodes: string[];
}

export interface ChronicProblem {
  title: string;
  affectedYears: string;
  symptoms: string[];
  firstChecks: string[];
  relatedCodes: string[];
  severity: 'low' | 'moderate' | 'high';
}

export interface DiagnosticNote {
  system: string;
  priority: string;
  notes: string[];
  relatedCodes: string[];
}

export interface VehicleYearTrimVariant {
  year: number;
  trim: string;
  slug: string;
  chassisCode: string;
  bodyStyle: string;
  market: string;
  engineCodes: string[];
  engineSummary: string;
  displacement: string;
  power: string;
  torque: string;
  fuelSystem: string;
  timingDrive: string;
  recommendedOil: string;
  oilCapacity: string;
  coolantCapacity: string;
  manualTransmission?: string;
  automaticTransmission?: string;
  transmissionFluid: string;
  differentialFluid: string;
  brakeFluid: string;
  sparkPlugs: string;
  serviceInterval: string;
  tireSizes: string[];
  commonProblems: string[];
  firstChecks: string[];
  relatedCodes: string[];
  notes: string[];
  sourceNotes: string[];
}

export const vehicleKnowledgeProfiles: VehicleKnowledgeProfile[] = [
  {
    make: 'bmw',
    model: '5-series',
    displayName: 'BMW 5 Series',
    generation: 'E34',
    years: '1988-1996',
    bodyStyle: 'Executive sedan/touring',
    markets: ['Europe', 'United Kingdom', 'Middle East', 'selected global markets'],
    engines: ['M20B20 2.0L I6', 'M50B20 2.0L 24V I6', 'M50B20TU 2.0L VANOS I6', 'M50B25 2.5L I6', 'M30/M60/S38 variants by model'],
    transmissions: ['5-speed manual', '4-speed automatic', '5-speed automatic on selected later models'],
    engineOil: 'Depends on engine and climate. 1991 520i M50B20 commonly uses 5W-40, 5W-30 or 10W-40 oil meeting suitable BMW approval for older petrol engines.',
    transmissionFluid: 'Manual or automatic fluid depends on gearbox code; verify ZF/Getrag transmission tag before service.',
    coolant: 'BMW-compatible phosphate/nitrite-free coolant mixed with demineralized water.',
    brakeFluid: 'DOT 4 brake fluid.',
    tireSizes: ['195/65R15', '205/65R15', '225/60R15', '225/55R16'],
    boltPattern: '5x120',
    wheelTorque: '120 Nm typical for BMW 5 Series E34 wheel bolts; verify wheel type.',
    battery: 'Large European DIN battery; capacity varies by engine and equipment.',
    obdPortLocation: 'Early E34 models commonly use the 20-pin BMW diagnostic connector in the engine bay; later OBD market equipment varies.',
    fuseBox: 'Main fuse/relay box in engine bay plus model-specific auxiliary fuse locations.',
    maintenance: ['Oil and filter service', 'Cooling system inspection', 'Ignition tune-up', 'Vacuum/intake leak inspection', 'Front suspension bushing inspection'],
    knownProblems: ['Cooling system age-related leaks', 'Vacuum leaks causing rough idle', 'Ignition coil or plug issues on M50 engines', 'Oil leaks from valve cover and filter housing', 'Front thrust arm bushing wear'],
    commonCodes: ['P0300', 'P0171', 'P0115', 'P0130', 'P0505'],
    compatibleTools: ['BMW 20-pin adapter', 'OBD2 scanner for later markets', 'Multimeter', 'Smoke tester', 'Cooling system pressure tester'],
    coverageLevel: 'expanded',
    yearRanges: [
      { years: '1988-1990', generation: 'E34 early', notes: 'Early 520i used the M20B20 single-cam inline-six in many markets.' },
      { years: '1990-1992', generation: 'E34 M50 transition', notes: '520i moved to the M50B20 24-valve inline-six in many European-market cars.' },
      { years: '1992-1996', generation: 'E34 VANOS update', notes: '520i received the M50B20TU with VANOS depending on production date and market.' },
    ],
    engineVariants: [
      {
        code: 'M20B20',
        name: '2.0L SOHC inline-6',
        years: '1988-1990',
        displacement: '1991 cc',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '15W-40, 10W-40 or climate-appropriate classic BMW petrol oil; verify owner manual.',
        oilCapacity: 'Approximately 4.25-4.5 L with filter depending on specification.',
        timingDrive: 'Timing belt',
        commonIssues: ['Timing belt service neglect', 'Vacuum leaks', 'Distributor/ignition wear', 'Cooling system age'],
        relatedCodes: ['P0300', 'P0171', 'P0115'],
        notes: 'On M20 engines, timing belt history is more important than mileage claims.',
      },
      {
        code: 'M50B20',
        name: '2.0L DOHC 24-valve inline-6',
        years: '1990-1992',
        displacement: '1991 cc',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '5W-40, 5W-30 or 10W-40 depending on climate and oil approval.',
        oilCapacity: '5.75 L service fill with filter commonly listed for E34 520i M50B20.',
        timingDrive: 'Timing chain',
        sparkPlugInterval: 'Inspect around 30k-40k km; replace earlier for misfire or rough idle.',
        commonIssues: ['Vacuum leaks', 'Valve cover oil leaks', 'Ignition coil/boot faults', 'Cooling system plastic aging'],
        relatedCodes: ['P0300', 'P0301', 'P0171', 'P0115', 'P0130'],
        notes: '1991 520i is commonly M50B20 in European-market cars, but production month and market should be checked.',
      },
      {
        code: 'M50B20TU',
        name: '2.0L DOHC VANOS inline-6',
        years: '1992-1996',
        displacement: '1991 cc',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '5W-40, 5W-30 or 10W-40 depending on climate and oil approval.',
        oilCapacity: '5.75 L service fill with filter commonly listed for E34 520i M50-family engines.',
        timingDrive: 'Timing chain',
        commonIssues: ['VANOS seal wear symptoms', 'Vacuum leaks', 'Rough idle', 'Cooling system age'],
        relatedCodes: ['P0300', 'P0171', 'P0505'],
        notes: 'TU engines add VANOS; idle and low-rpm torque complaints should include VANOS and vacuum checks.',
      },
    ],
    transmissionVariants: [
      {
        code: 'Getrag/ZF 5-speed manual family',
        name: '5-speed manual',
        years: '1988-1996',
        type: 'Manual',
        fluid: 'Use gearbox-code-specific manual transmission fluid; verify label/tag before service.',
        serviceNote: 'On older BMWs, service by actual gearbox tag rather than model name alone.',
        commonIssues: ['Shifter bushing wear', 'Clutch hydraulic leaks', 'Gear oil age'],
        relatedCodes: [],
      },
      {
        code: 'ZF 4HP22 / 5HP18 family by engine and year',
        name: 'Automatic transmission',
        years: '1988-1996',
        type: 'Torque-converter automatic',
        fluid: 'ATF specification depends on transmission tag and market.',
        serviceNote: 'Confirm exact automatic gearbox before selecting fluid.',
        commonIssues: ['Delayed engagement when neglected', 'Valve body wear', 'Fluid leak from old seals'],
        relatedCodes: ['P0700', 'P0715'],
      },
    ],
    serviceIntervals: [
      { item: 'Engine oil and filter', interval: 'Every 10k-12k km or annually for conservative use', notes: 'Older M50 engines benefit from conservative oil intervals and correct filter quality.', relatedCodes: ['P0011', 'P0300'] },
      { item: 'Cooling system', interval: 'Inspect every service; refresh aging plastic/rubber parts proactively', notes: 'Overheating can damage inline-six engines quickly.', relatedCodes: ['P0115', 'P0128'] },
      { item: 'Ignition and vacuum inspection', interval: 'Inspect when idle, misfire or fuel-trim symptoms appear', notes: 'Vacuum leaks and old ignition parts are common causes of poor running.', relatedCodes: ['P0300', 'P0171'] },
    ],
    chronicProblems: [
      { title: 'Cooling system aging', affectedYears: '1988-1996 E34', symptoms: ['Coolant smell', 'Temperature rise', 'Heater output changes'], firstChecks: ['Radiator necks', 'Water pump', 'Thermostat', 'Expansion tank cap', 'Hoses'], relatedCodes: ['P0115', 'P0128'], severity: 'high' },
      { title: 'M50 rough idle and lean running', affectedYears: '1990-1996 M50-family 520i/525i', symptoms: ['Rough idle', 'Hesitation', 'Lean mixture symptoms'], firstChecks: ['Intake boots', 'Vacuum hoses', 'ICV', 'MAF data', 'Ignition coils'], relatedCodes: ['P0171', 'P0300', 'P0505'], severity: 'moderate' },
    ],
    diagnosticNotes: [
      { system: 'Engine identification', priority: 'Confirm engine code before using fluid or part data.', notes: ['1991 cars can sit near engine-transition periods depending on market and production month.', 'Use VIN, engine stamping and parts catalog data before ordering parts.'], relatedCodes: [] },
      { system: 'Cooling', priority: 'Do not ignore mild temperature symptoms on older BMW inline-six engines.', notes: ['Pressure-test the system and inspect plastic parts.', 'Bleed the cooling system correctly after service.'], relatedCodes: ['P0115', 'P0128'] },
    ],
    yearTrimVariants: [
      {
        year: 1991,
        trim: '520i',
        slug: '520i',
        chassisCode: 'E34',
        bodyStyle: 'Sedan',
        market: 'Europe / selected global markets',
        engineCodes: ['M50B20'],
        engineSummary: '2.0L DOHC 24-valve naturally aspirated inline-six',
        displacement: '1991 cc',
        power: '150 PS / 148 hp class at 6,000 rpm',
        torque: '190 Nm class at 4,700 rpm',
        fuelSystem: 'Bosch electronic fuel injection',
        timingDrive: 'Timing chain',
        recommendedOil: '5W-40, 5W-30 or 10W-40 depending on climate; use oil with suitable BMW approval for older petrol engines.',
        oilCapacity: '5.75 L service fill with filter commonly listed for 1990-1991 E34 520i M50B20.',
        coolantCapacity: 'Use BMW-compatible coolant; final fill quantity should be verified by production date and market service data.',
        manualTransmission: '5-speed manual, gearbox code depends on production date/market.',
        automaticTransmission: '4-speed automatic on selected cars; verify transmission tag before fluid service.',
        transmissionFluid: 'Gearbox-code-specific manual fluid or automatic ATF; do not choose fluid by model name alone.',
        differentialFluid: 'BMW-compatible hypoid gear oil; limited-slip differential requires LSD-compatible fluid if equipped.',
        brakeFluid: 'DOT 4',
        sparkPlugs: 'Use M50B20-compatible plugs; inspect/replace earlier if misfire, rough idle or oil contamination is present.',
        serviceInterval: 'Conservative oil service every 10k-12k km or annually; inspect cooling and vacuum system at every service.',
        tireSizes: ['195/65R15', '205/65R15', '225/60R15 depending on wheel/market'],
        commonProblems: ['Cooling system plastic and hose aging', 'Valve cover gasket oil leaks', 'Intake boot and vacuum leaks', 'Ignition coil/boot misfire', 'Idle control valve contamination'],
        firstChecks: ['Confirm VIN/production date', 'Confirm M50B20 engine code', 'Check oil leaks around valve cover and filter housing', 'Smoke-test intake for vacuum leaks', 'Pressure-test cooling system'],
        relatedCodes: ['P0300', 'P0301', 'P0171', 'P0115', 'P0130', 'P0505'],
        notes: ['1991 520i is a transition-era E34; market and production month matter.', 'Some catalogues separate 520i and 520i 24V; verify by engine code before buying parts.', 'Older BMW diagnostic access may require the round 20-pin adapter rather than a normal OBD2 port.'],
        sourceNotes: ['BMW E34 production and engine family data cross-checked against public E34 model references.', 'Oil capacity and viscosity guidance cross-checked against aftermarket lubricant catalogues for BMW EU 5 Series E34 520i 1990-1991.'],
      },
    ],
    sourceNotes: ['Structured from public BMW E34 model references, lubricant catalogue data and OBD2HQ editorial normalization. Use VIN/production-month data for final service decisions.'],
  },
  {
    make: 'toyota',
    model: 'camry',
    displayName: 'Toyota Camry',
    generation: 'XV70',
    years: '2018-2024',
    bodyStyle: 'Mid-size sedan',
    markets: ['North America', 'Middle East', 'Asia-Pacific', 'selected European markets'],
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
    coverageLevel: 'expanded',
    yearRanges: [
      { years: '2018-2020', generation: 'XV70 pre-facelift', notes: 'Early XV70 production with 2.5L Dynamic Force, hybrid eCVT and optional V6 depending on market.' },
      { years: '2021-2024', generation: 'XV70 facelift', facelift: 'Exterior, safety and infotainment updates', notes: 'Same core engine family, with trim and market-specific equipment changes.' },
    ],
    engineVariants: [
      {
        code: 'A25A-FKS',
        name: '2.5L Dynamic Force inline-4',
        years: '2018-2024',
        displacement: '2.5L',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '0W-16 commonly specified; 0W-20 may be allowed depending on market and owner manual.',
        oilCapacity: 'Approximately 4.5-4.8 L with filter; verify by VIN, dipstick and owner manual.',
        timingDrive: 'Timing chain',
        sparkPlugInterval: 'Long-life iridium interval, commonly around 100k-120k miles depending on market.',
        commonIssues: ['Coolant temperature plausibility complaints', 'P0420 on high-mileage catalyst systems', 'Fuel trim drift from intake or exhaust leaks'],
        relatedCodes: ['P0128', 'P0171', 'P0300', 'P0420'],
        notes: 'Do not diagnose P0420 from the code name alone; compare upstream/downstream O2 sensor behavior, exhaust leaks and fuel trim first.',
      },
      {
        code: 'A25A-FXS',
        name: '2.5L hybrid Atkinson-cycle inline-4',
        years: '2018-2024',
        displacement: '2.5L',
        fuel: 'Gasoline hybrid',
        induction: 'Naturally aspirated',
        oilViscosity: '0W-16 commonly specified; verify hybrid-market manual.',
        oilCapacity: 'Approximately 4.5-4.8 L with filter; verify by VIN and manual.',
        timingDrive: 'Timing chain',
        commonIssues: ['Hybrid battery cooling intake restriction if neglected', '12V battery low-voltage symptoms', 'Cooling system and thermostat-related readiness issues'],
        relatedCodes: ['P0A80', 'P0A93', 'P0128', 'P0420'],
        notes: 'Hybrid diagnostics require checking 12V battery health before blaming high-voltage components.',
      },
      {
        code: '2GR-FKS',
        name: '3.5L V6',
        years: '2018-2024',
        displacement: '3.5L',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '0W-20 commonly specified; verify market manual.',
        oilCapacity: 'Approximately 5.5-6.1 L with filter depending on specification; verify by VIN.',
        timingDrive: 'Timing chain',
        commonIssues: ['Ignition misfire under load', 'EVAP leak complaints', 'Catalyst efficiency faults on neglected misfires'],
        relatedCodes: ['P0300', 'P0301', 'P0455', 'P0420'],
        notes: 'Misfire history matters: unresolved misfire can damage catalysts and create later P0420/P0430 complaints.',
      },
    ],
    transmissionVariants: [
      {
        code: 'UA80E/UB80E family',
        name: 'Aisin 8-speed automatic',
        years: '2018-2024',
        type: 'Torque-converter automatic',
        fluid: 'Toyota WS ATF family; verify exact service procedure by VIN.',
        serviceNote: 'Many markets describe fluid as long-life, but severe-service use benefits from inspection and conservative service planning.',
        commonIssues: ['Harsh shift complaints after battery reset/adaptation loss', 'Fluid condition concerns on high-mileage vehicles'],
        relatedCodes: ['P0700', 'P0715', 'P0741'],
      },
      {
        code: 'Toyota hybrid eCVT',
        name: 'Hybrid transaxle',
        years: '2018-2024',
        type: 'Power-split hybrid transaxle',
        fluid: 'Toyota hybrid transaxle fluid specification; verify exact fluid by market.',
        serviceNote: 'Use hybrid-safe procedures; confirm no HV system warning before general drivetrain diagnosis.',
        commonIssues: ['12V battery low-voltage false symptoms', 'Cooling and readiness concerns'],
        relatedCodes: ['P0A80', 'P0A93', 'P3000'],
      },
    ],
    serviceIntervals: [
      { item: 'Engine oil and filter', interval: '5k-10k miles depending on service schedule and usage', notes: 'Short trips, heat, taxi/rideshare or dusty use justify the shorter interval.', relatedCodes: ['P0011', 'P0012'] },
      { item: 'Engine air filter', interval: 'Inspect every service; replace earlier in dusty climates', notes: 'Restriction can affect fuel trim and MAF-related diagnosis.', relatedCodes: ['P0101', 'P0171'] },
      { item: 'Hybrid battery cooling intake', interval: 'Inspect/clean periodically on hybrid models', notes: 'Blocked airflow can create HV battery temperature complaints.', relatedCodes: ['P0A80', 'P0A93'] },
      { item: 'Brake fluid', interval: 'Time-based inspection; many markets use 2-3 year planning', notes: 'Moisture affects braking performance and ABS hydraulic reliability.', relatedCodes: ['C-series ABS codes'] },
    ],
    chronicProblems: [
      { title: 'Catalyst efficiency complaints', affectedYears: 'High-mileage 2018-2024 gasoline models', symptoms: ['Check engine light', 'Readiness monitor failure', 'Possible exhaust smell'], firstChecks: ['Exhaust leaks before O2 sensors', 'Fuel trim', 'Misfire history', 'O2 sensor switching pattern'], relatedCodes: ['P0420', 'P0430', 'P0136'], severity: 'moderate' },
      { title: 'EVAP small/large leak faults', affectedYears: '2018-2024', symptoms: ['Check engine light after refueling', 'Fuel smell near filler', 'Failed emissions readiness'], firstChecks: ['Fuel cap seal', 'Purge valve command', 'Smoke test EVAP lines'], relatedCodes: ['P0442', 'P0455', 'P0456'], severity: 'moderate' },
    ],
    diagnosticNotes: [
      { system: 'Emissions', priority: 'Confirm fuel trim and exhaust leaks before catalyst replacement.', notes: ['Do not clear readiness before saving freeze-frame.', 'A marginal catalyst must be confirmed with live O2 data and monitor status.'], relatedCodes: ['P0420', 'P0430'] },
      { system: 'Hybrid', priority: 'Start with 12V battery and cooling intake checks.', notes: ['Low 12V voltage can create confusing module behavior.', 'Hybrid cooling restriction can mimic expensive HV battery faults.'], relatedCodes: ['P0A80', 'P0A93'] },
    ],
    sourceNotes: ['Structured from public service-pattern research and OBD2HQ editorial normalization. Owner manual and VIN-specific service data should be used for final fluid/capacity confirmation.'],
  },
  {
    make: 'ford',
    model: 'focus',
    displayName: 'Ford Focus',
    generation: 'Mk3',
    years: '2012-2018',
    bodyStyle: 'Compact hatchback/sedan',
    markets: ['North America', 'Europe', 'Middle East', 'selected global markets'],
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
    coverageLevel: 'expanded',
    yearRanges: [
      { years: '2012-2014', generation: 'Mk3 early', notes: 'Early Mk3 Focus with market-specific GDI, EcoBoost and PowerShift availability.' },
      { years: '2015-2018', generation: 'Mk3 facelift', facelift: 'Exterior/interior update and equipment changes', notes: 'Facelift cars retain many diagnostic patterns from earlier Mk3 vehicles.' },
    ],
    engineVariants: [
      {
        code: '2.0L Duratec GDI',
        name: '2.0L gasoline direct injection',
        years: '2012-2018',
        displacement: '2.0L',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '5W-20 commonly specified in North America; verify market manual.',
        oilCapacity: 'Approximately 4.3-4.7 L with filter depending on market specification.',
        timingDrive: 'Timing chain',
        sparkPlugInterval: 'Commonly 100k miles class on long-life plugs; inspect earlier for misfire.',
        commonIssues: ['Injector circuit faults', 'EVAP purge valve issues', 'Ignition misfires', 'Fuel trim lean complaints'],
        relatedCodes: ['P0201', 'P0202', 'P0203', 'P0204', 'P0300', 'P0171'],
        notes: 'For P020x faults, test injector resistance, power feed, harness movement and PCM command before replacing injectors.',
      },
      {
        code: '1.0L EcoBoost',
        name: '1.0L turbocharged EcoBoost',
        years: '2012-2018',
        displacement: '1.0L',
        fuel: 'Gasoline',
        induction: 'Turbocharged',
        oilViscosity: 'Ford specification oil, commonly 5W-20 or market-specific EcoBoost oil.',
        oilCapacity: 'Verify by VIN and market; small displacement turbo engines are sensitive to oil quality.',
        timingDrive: 'Belt-in-oil family on many applications',
        commonIssues: ['Boost plausibility issues', 'Coolant system concerns', 'Oil quality sensitivity'],
        relatedCodes: ['P0234', 'P0235', 'P0299', 'P0128'],
        notes: 'Turbo diagnosis should include boost hoses, wastegate/actuator command, MAP sensor data and smoke testing.',
      },
      {
        code: '2.0L EcoBoost ST',
        name: '2.0L turbocharged EcoBoost ST',
        years: '2013-2018',
        displacement: '2.0L',
        fuel: 'Gasoline',
        induction: 'Turbocharged',
        oilViscosity: '5W-30 class Ford specification commonly used; verify ST manual.',
        oilCapacity: 'Approximately 5.4 L class with filter; verify by VIN.',
        timingDrive: 'Timing chain',
        commonIssues: ['Boost leak or overboost faults', 'Misfire under load', 'PCV/intake leak complaints'],
        relatedCodes: ['P0234', 'P0299', 'P0300', 'P0171'],
        notes: 'Load-related misfires require plug gap, coil behavior, boost pressure and fuel pressure review together.',
      },
    ],
    transmissionVariants: [
      {
        code: 'DPS6 PowerShift',
        name: '6-speed dual-clutch automatic',
        years: '2012-2018',
        type: 'Dry dual-clutch automated manual',
        fluid: 'Ford dual-clutch fluid specification; do not substitute generic ATF.',
        serviceNote: 'Clutch adaptive learn and module data matter before mechanical conclusions.',
        commonIssues: ['Clutch shudder', 'Delayed engagement', 'TCM/module complaints', 'Input shaft seal contamination'],
        relatedCodes: ['P0700', 'P0805', 'P0902', 'P287A'],
      },
      {
        code: 'MTX75 / manual family',
        name: 'Manual transmission',
        years: '2012-2018',
        type: 'Manual',
        fluid: 'Manual transmission fluid per gearbox code.',
        serviceNote: 'Confirm clutch hydraulic condition before blaming gearbox internals.',
        commonIssues: ['Clutch wear', 'Hydraulic issues', 'Shift linkage wear'],
        relatedCodes: ['P0805', 'P0833'],
      },
    ],
    serviceIntervals: [
      { item: 'Engine oil and filter', interval: 'Shorter interval recommended for turbo, short-trip or severe service use', notes: 'Oil quality is critical on EcoBoost engines.', relatedCodes: ['P0011', 'P0016'] },
      { item: 'Spark plugs', interval: 'Inspect earlier on turbo or misfire complaints', notes: 'Plug gap and coil condition affect load misfires.', relatedCodes: ['P0300', 'P0301'] },
      { item: 'DPS6 adaptive and clutch inspection', interval: 'As symptoms appear; not a simple fluid-only issue', notes: 'Scanner data and clutch adaptive values are important.', relatedCodes: ['P0700', 'P287A'] },
    ],
    chronicProblems: [
      { title: 'PowerShift shudder and engagement complaints', affectedYears: '2012-2018 DPS6-equipped models', symptoms: ['Shudder on takeoff', 'Delayed engagement', 'Transmission warning'], firstChecks: ['TCM codes', 'Clutch adaptive data', 'Fluid/seal contamination', 'Battery voltage'], relatedCodes: ['P0700', 'P0805', 'P287A'], severity: 'high' },
      { title: 'Injector circuit faults', affectedYears: '2.0L GDI models', symptoms: ['Cylinder-specific misfire', 'Rough idle', 'Fuel smell possible'], firstChecks: ['Injector connector tension', 'Harness continuity', 'Power feed', 'PCM command'], relatedCodes: ['P0201', 'P0202', 'P0203', 'P0204'], severity: 'moderate' },
    ],
    diagnosticNotes: [
      { system: 'Injection', priority: 'Circuit tests before injector replacement.', notes: ['Backprobe carefully; do not pierce sealed wiring unless repair is planned.', 'Wiggle-test harness near engine movement points.'], relatedCodes: ['P0201', 'P0202', 'P0203', 'P0204'] },
      { system: 'Transmission', priority: 'PowerShift diagnosis requires module data.', notes: ['Battery voltage and TCM communication can change symptoms.', 'Clutch shudder is not diagnosed like a traditional torque-converter automatic.'], relatedCodes: ['P0700', 'P287A'] },
    ],
    sourceNotes: ['Structured from common service-pattern research and Ford platform diagnostics. VIN-specific workshop data remains required for final fluid and procedure confirmation.'],
  },
  {
    make: 'suzuki',
    model: 'jimny',
    displayName: 'Suzuki Jimny',
    generation: 'JB43/JB74',
    years: '1998-2024',
    bodyStyle: 'Compact 4x4 SUV',
    markets: ['Europe', 'Japan', 'Australia', 'Middle East', 'Latin America', 'selected global markets'],
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
    coverageLevel: 'expanded',
    yearRanges: [
      { years: '1998-2018', generation: 'JB43', notes: 'Long-running third-generation Jimny with market-specific 1.3L gasoline engines and simple 4x4 drivetrain.' },
      { years: '2018-2024', generation: 'JB74', notes: 'Fourth-generation Jimny with 1.5L K15B gasoline engine, ladder-frame chassis and market-specific emissions equipment.' },
    ],
    engineVariants: [
      {
        code: 'M13A',
        name: '1.3L inline-4',
        years: '1998-2018',
        displacement: '1.3L',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '5W-30 commonly used; verify climate and market manual.',
        oilCapacity: 'Approximately 3.7-4.0 L with filter depending on market.',
        timingDrive: 'Timing chain',
        commonIssues: ['Vacuum hose cracking', 'Injector circuit faults', 'Ignition misfire after water/off-road exposure'],
        relatedCodes: ['P0203', 'P0204', 'P0300', 'P0171'],
        notes: 'Off-road use makes connector contamination and wiring checks more important than parts guessing.',
      },
      {
        code: 'K15B',
        name: '1.5L inline-4',
        years: '2018-2024',
        displacement: '1.5L',
        fuel: 'Gasoline',
        induction: 'Naturally aspirated',
        oilViscosity: '0W-20 or 5W-30 depending on market and climate.',
        oilCapacity: 'Approximately 3.6-4.0 L with filter; verify market manual.',
        timingDrive: 'Timing chain',
        commonIssues: ['MAP sensor plausibility complaints', 'Vacuum leaks', 'Off-road intake contamination'],
        relatedCodes: ['P0235', 'P0106', 'P0171', 'P0300'],
        notes: 'P0235 on naturally aspirated variants should be treated as MAP/barometric plausibility, wiring or sensor-data issue rather than turbo boost.',
      },
    ],
    transmissionVariants: [
      {
        code: '5MT',
        name: '5-speed manual',
        years: '1998-2024',
        type: 'Manual',
        fluid: 'Manual gear oil per market specification.',
        serviceNote: 'Off-road water crossings justify earlier fluid inspection.',
        commonIssues: ['Clutch wear', 'Shift bushing wear', 'Contaminated fluid after off-road use'],
        relatedCodes: ['P0805'],
      },
      {
        code: '4AT',
        name: '4-speed automatic',
        years: '1998-2024',
        type: 'Torque-converter automatic',
        fluid: 'Suzuki ATF specification by transmission code.',
        serviceNote: 'Inspect fluid after towing, heat or off-road use.',
        commonIssues: ['Delayed engagement on neglected fluid', 'Heat-related shift concerns'],
        relatedCodes: ['P0700', 'P0715'],
      },
    ],
    serviceIntervals: [
      { item: 'Engine oil and filter', interval: 'Shorter interval after dusty/off-road use', notes: 'Dust contamination makes air filter and oil service more important.', relatedCodes: ['P0171', 'P0106'] },
      { item: 'Transfer case and differential fluids', interval: 'Inspect after water crossings or heavy off-road use', notes: 'Water contamination can damage drivetrain bearings.', relatedCodes: [] },
      { item: 'Air filter', interval: 'Inspect frequently in dusty use', notes: 'Restricted or contaminated intake can affect MAP/fuel trim diagnosis.', relatedCodes: ['P0106', 'P0171'] },
    ],
    chronicProblems: [
      { title: 'Injector circuit faults on individual cylinders', affectedYears: 'M13A/K15B variants depending on wiring condition', symptoms: ['Rough idle', 'Cylinder-specific misfire', 'Check engine light'], firstChecks: ['Injector connector', 'Harness continuity', 'Power feed', 'Injector resistance'], relatedCodes: ['P0203', 'P0204', 'P0303', 'P0304'], severity: 'moderate' },
      { title: 'MAP/barometric plausibility after intake contamination', affectedYears: 'Off-road or dusty-use vehicles', symptoms: ['Poor acceleration', 'Check engine under load', 'Lean trim'], firstChecks: ['MAP sensor data', 'Vacuum hoses', 'Air filter sealing', 'Connector contamination'], relatedCodes: ['P0235', 'P0106', 'P0171'], severity: 'moderate' },
    ],
    diagnosticNotes: [
      { system: 'Off-road electrical', priority: 'Inspect connectors before replacing sensors.', notes: ['Mud and water intrusion can create intermittent circuit faults.', 'Harness movement near engine/transmission should be checked during live-data review.'], relatedCodes: ['P0203', 'P0204', 'P0235'] },
      { system: 'Air intake', priority: 'Treat MAP/lean faults as system diagnosis.', notes: ['Check air filter sealing and vacuum hoses first.', 'A sensor code does not prove the sensor is bad.'], relatedCodes: ['P0106', 'P0171', 'P0235'] },
    ],
    sourceNotes: ['Structured from platform-level service-pattern research and OBD2HQ editorial normalization. Final capacities and specifications must be checked against market owner manual and VIN-specific service data.'],
  },
];

export function getVehicleKnowledge(make: string, model: string) {
  return vehicleKnowledgeProfiles.find(vehicle => vehicle.make === make && vehicle.model === model) || null;
}

export function getVehicleYearTrimVariant(make: string, model: string, year: string | number, variant: string) {
  const vehicle = getVehicleKnowledge(make, model);
  if (!vehicle) return null;
  return vehicle.yearTrimVariants?.find(item => item.year === Number(year) && item.slug === variant) || null;
}

export function getVehicleYearTrimStaticParams() {
  return vehicleKnowledgeProfiles.flatMap(vehicle => (vehicle.yearTrimVariants || []).map(item => ({
    make: vehicle.make,
    model: vehicle.model,
    year: String(item.year),
    variant: item.slug,
  })));
}
