export const SUPPORTED_LOCALES = ['en', 'de', 'es', 'tr', 'fr'] as const;

export const PRIORITY_CODES = ['P0420', 'P0300', 'P0171', 'P0455', 'P0442', 'P0128', 'P0135', 'P0174', 'P0430', 'P0011', 'P0101', 'P0113'];

export const CODE_CATEGORIES = [
  { label: 'Engine', codes: ['P0300', 'P0301', 'P0302', 'P0011', 'P0014', 'P0507'] },
  { label: 'Emissions', codes: ['P0420', 'P0430', 'P0455', 'P0442', 'P0456', 'P0401'] },
  { label: 'Fuel Trim', codes: ['P0171', 'P0174', 'P0172', 'P0175', 'P0191', 'P0087'] },
  { label: 'Sensors', codes: ['P0101', 'P0102', 'P0113', 'P0128', 'P0135', 'P0335'] },
  { label: 'Transmission', codes: ['P0700', 'P0715', 'P0720', 'P0730', 'P0740', 'P0750'] },
];

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
