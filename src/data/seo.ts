export const SUPPORTED_LOCALES = ['en', 'de', 'es', 'tr', 'fr'] as const;

export const PRIORITY_CODES = ['P0420', 'P0300', 'P0171', 'P0455', 'P0442', 'P0128', 'P0135', 'P0174', 'P0430', 'P0011', 'P0101', 'P0113'];

export const CODE_CATEGORIES = [
  { label: 'Engine', codes: ['P0300', 'P0301', 'P0302', 'P0011', 'P0014', 'P0507'] },
  { label: 'Emissions', codes: ['P0420', 'P0430', 'P0455', 'P0442', 'P0456', 'P0401'] },
  { label: 'Fuel Trim', codes: ['P0171', 'P0174', 'P0172', 'P0175', 'P0191', 'P0087'] },
  { label: 'Sensors', codes: ['P0101', 'P0102', 'P0113', 'P0128', 'P0135', 'P0335'] },
  { label: 'Transmission', codes: ['P0700', 'P0715', 'P0720', 'P0730', 'P0740', 'P0750'] },
];

export function getCodeCategoryLabel(code: string) {
  const match = CODE_CATEGORIES.find(category => category.codes.includes(code.toUpperCase()));
  if (match) return match.label;

  const system = getCodeSystem(code);
  if (system === 'misfire') return 'Engine';
  if (system === 'evap' || system === 'catalyst') return 'Emissions';
  if (system === 'fuel-trim') return 'Fuel Trim';
  if (system === 'sensor') return 'Sensors';
  if (system === 'transmission') return 'Transmission';
  return 'Powertrain';
}

const RELATED_CODE_GROUPS = [
  ['P0420', 'P0430', 'P0136', 'P0141', 'P0171', 'P0300'],
  ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0171'],
  ['P0171', 'P0174', 'P0101', 'P0102', 'P0131', 'P0300'],
  ['P0455', 'P0442', 'P0456', 'P0440', 'P0441', 'P0457'],
  ['P0128', 'P0115', 'P0116', 'P0117', 'P0118', 'P2181'],
  ['P0101', 'P0102', 'P0103', 'P0113', 'P0171', 'P0174'],
  ['P0700', 'P0715', 'P0720', 'P0730', 'P0740', 'P0750'],
];

export function getRelatedCodes(code: string, availableCodes: string[], limit = 5) {
  const upperCode = code.toUpperCase();
  const exactGroup = RELATED_CODE_GROUPS.find(group => group.includes(upperCode));
  const candidates = exactGroup || RELATED_CODE_GROUPS.find(group => group[0][1] === upperCode[1]) || PRIORITY_CODES;
  const related = candidates.filter(candidate => candidate !== upperCode && availableCodes.includes(candidate));

  if (related.length >= limit) return related.slice(0, limit);

  const fallback = PRIORITY_CODES.filter(candidate => candidate !== upperCode && availableCodes.includes(candidate) && !related.includes(candidate));
  return [...related, ...fallback].slice(0, limit);
}

export function getFallbackDiagnosticSteps(code: string, make: string, model: string) {
  const upperCode = code.toUpperCase();
  const vehicle = `${make} ${model}`.replace(/\b\w/g, char => char.toUpperCase());

  return [
    `Confirm ${upperCode} with a quality OBD2 scanner and record freeze-frame data before clearing anything.`,
    `Inspect the ${vehicle} engine bay for loose connectors, damaged wiring, cracked vacuum hoses, blown fuses, or obvious exhaust leaks.`,
    `Check live data for the sensor or system named by ${upperCode}; compare voltage, temperature, fuel trim, or switching behavior against normal operating ranges.`,
    `Repair the simplest verified fault first, then clear the code and complete a drive cycle until the monitor runs again.`,
    `If ${upperCode} returns after basic checks, stop replacing parts blindly and verify the circuit with a multimeter or a professional diagnostic scan tool.`,
  ];
}

export function getCodeSystem(code: string) {
  const upperCode = code.toUpperCase();
  if (/^P03/.test(upperCode)) return 'misfire';
  if (/^P04(4|5)/.test(upperCode)) return 'evap';
  if (/^P04(2|3)/.test(upperCode)) return 'catalyst';
  if (/^P017/.test(upperCode)) return 'fuel-trim';
  if (/^P01(0|1|2|3)/.test(upperCode)) return 'sensor';
  if (/^P07/.test(upperCode)) return 'transmission';
  if (/^P05/.test(upperCode)) return 'idle-speed';
  if (/^P06/.test(upperCode)) return 'control-module';
  return 'powertrain';
}

const SYSTEM_CONTENT = {
  catalyst: {
    label: 'Catalyst and oxygen sensor monitor',
    firstChecks: ['Inspect for exhaust leaks before the downstream oxygen sensor.', 'Compare upstream and downstream O2 sensor live data after the engine is fully warm.', 'Check fuel trim and misfire history before replacing the catalytic converter.'],
    mistake: 'Replacing the catalytic converter before checking exhaust leaks, O2 sensor behavior, fuel trims, and misfire history.',
    costNote: 'Cheap fixes are usually leaks, wiring, or sensors; converter replacement is the expensive last step after tests confirm low catalyst efficiency.',
  },
  evap: {
    label: 'EVAP leak and purge system',
    firstChecks: ['Confirm the fuel cap seals correctly and is the right type for the vehicle.', 'Inspect EVAP hoses, purge valve, vent valve, and charcoal canister connections.', 'Use a smoke test before replacing multiple EVAP parts.'],
    mistake: 'Replacing the gas cap repeatedly without smoke-testing the EVAP system or checking purge and vent valve operation.',
    costNote: 'Many EVAP fixes are low to moderate cost, but smoke testing saves money by locating the exact leak.',
  },
  misfire: {
    label: 'Misfire and combustion',
    firstChecks: ['Check spark plugs, coils, injector balance, and compression before replacing expensive parts.', 'Review freeze-frame RPM/load to see when the misfire occurs.', 'Look for fuel trim or vacuum leak codes that can cause multiple-cylinder misfires.'],
    mistake: 'Replacing ignition coils without moving coils, checking plugs, or confirming fuel and compression are healthy.',
    costNote: 'Single-cylinder ignition fixes are often affordable; compression or timing problems require professional diagnosis.',
  },
  'fuel-trim': {
    label: 'Fuel trim and air metering',
    firstChecks: ['Read short-term and long-term fuel trims at idle and cruise.', 'Inspect intake boots, vacuum hoses, PCV plumbing, and MAF sensor contamination.', 'Check fuel pressure if trims suggest a lean condition under load.'],
    mistake: 'Replacing oxygen sensors because they report lean/rich exhaust when the real cause is air, fuel pressure, or MAF data.',
    costNote: 'Vacuum leaks and cleaning are cheap; fuel pump, injector, or MAF replacement costs more and should be verified.',
  },
  sensor: {
    label: 'Sensor circuit and live data',
    firstChecks: ['Inspect the connector for corrosion, broken locks, oil intrusion, or heat damage.', 'Verify 5V reference, ground, and signal with a multimeter where applicable.', 'Compare live sensor data to realistic engine temperature, pressure, airflow, or throttle values.'],
    mistake: 'Replacing the named sensor without testing power, ground, signal, and wiring continuity first.',
    costNote: 'Sensor replacement can be moderate cost, but wiring and connector repairs are common and cheaper.',
  },
  transmission: {
    label: 'Transmission control and shift monitoring',
    firstChecks: ['Check fluid level and condition when the vehicle design allows it.', 'Scan transmission module data, not only generic engine codes.', 'Look for speed sensor, solenoid, and electrical codes before assuming internal transmission failure.'],
    mistake: 'Assuming the transmission needs rebuilding before checking fluid, sensors, solenoids, wiring, and control-module codes.',
    costNote: 'Electrical repairs may be moderate; internal transmission repairs can be expensive and need professional confirmation.',
  },
  'idle-speed': {
    label: 'Idle speed and throttle control',
    firstChecks: ['Inspect intake leaks and throttle body carbon buildup.', 'Check idle air or electronic throttle live data.', 'Verify battery voltage and recent relearn procedures if the throttle body was cleaned or replaced.'],
    mistake: 'Replacing throttle parts before cleaning, checking air leaks, and completing the correct idle relearn.',
    costNote: 'Cleaning and relearn are cheap; actuator or throttle body replacement should be data-confirmed.',
  },
  'control-module': {
    label: 'Control module, power, and communication',
    firstChecks: ['Check battery health, charging voltage, fuses, grounds, and module connectors.', 'Look for network communication codes and multiple-module failures.', 'Confirm power and ground before suspecting a failed PCM/ECM/TCM.'],
    mistake: 'Replacing a control module before checking voltage supply, grounds, fuses, water intrusion, and connector condition.',
    costNote: 'Power and ground repairs are often cheaper than module replacement, which may also require programming.',
  },
  powertrain: {
    label: 'General powertrain circuit',
    firstChecks: ['Record freeze-frame data and related codes before clearing the fault.', 'Inspect wiring, connectors, vacuum lines, fluid leaks, and fuses tied to the named system.', 'Use live data or a multimeter to confirm the failed circuit before replacing parts.'],
    mistake: 'Treating the code description as a parts list instead of verifying the circuit, operating conditions, and related codes.',
    costNote: 'Costs vary widely; start with visual inspection and circuit confirmation to avoid unnecessary parts.',
  },
} as const;

export function getSystemContent(code: string) {
  return SYSTEM_CONTENT[getCodeSystem(code)];
}

export function getRepairTiers(code: string, estimatedCost: string) {
  const system = getCodeSystem(code);
  const cheap = system === 'catalyst' ? 'Exhaust leak check, wiring repair, or sensor connector repair' :
    system === 'evap' ? 'Fuel cap, hose clamp, or small EVAP hose repair' :
    system === 'misfire' ? 'Spark plug, coil swap test, or connector repair' :
    system === 'fuel-trim' ? 'Vacuum leak repair, MAF cleaning, or PCV hose repair' :
    'Fuse, connector, wiring, cleaning, or basic inspection';

  const expensive = system === 'catalyst' ? 'Catalytic converter replacement after verified failed catalyst monitor' :
    system === 'transmission' ? 'Internal transmission repair or module programming after electrical checks' :
    system === 'control-module' ? 'Control module replacement and programming after power/ground verification' :
    'Major component replacement after live data and circuit tests confirm failure';

  return {
    cheap,
    typical: estimatedCost,
    expensive,
  };
}

export const CONTENT_ROADMAP = {
  en: [
    'How to fix P0420 without replacing the catalytic converter',
    'P0171 lean code diagnosis checklist',
    'P0300 random misfire causes by symptom',
    'EVAP leak codes P0442 vs P0455 vs P0456',
    'Best OBD2 scanner for beginners',
    'How to read freeze-frame data',
    'O2 sensor live data explained',
    'Fuel trim diagnosis for DIY drivers',
    'When a check engine light is safe to drive',
    'How to pass emissions after clearing codes',
    'Toyota Camry P0420 diagnostic guide',
    'Ford F-150 P0171 diagnostic guide',
    'Honda Civic P0300 diagnostic guide',
    'Suzuki Jimny injector circuit codes',
    'Ford Focus P0213 diagnosis',
    'Catalyst monitor not ready explained',
    'MAP sensor codes P0106-P0108 explained',
    'MAF sensor codes P0101-P0103 explained',
    'Coolant thermostat code P0128 explained',
    'Transmission code P0700 explained',
  ],
  tr: [
    'P0420 katalizor degismeden nasil cozulur',
    'P0171 fakir karisim ariza kodu kontrol listesi',
    'P0300 rastgele tekleme nedenleri',
    'P0442 P0455 P0456 EVAP kacagi farklari',
    'Yeni baslayanlar icin OBD2 cihaz rehberi',
    'Freeze frame verisi nasil okunur',
    'Oksijen sensoru canli veri yorumlama',
    'Yakit trim degerleri nasil yorumlanir',
    'Motor ariza lambasi yanarken arac kullanilir mi',
    'Ariza kodu silindikten sonra muayene hazirlik',
  ],
};
