const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const basePath = path.join(ROOT, 'src/data/base_codes.json');
const routesPath = path.join(ROOT, 'src/data/valid_routes.json');
const messagesDir = path.join(ROOT, 'messages');

const symptomTokens = {
  en: {
    symp_abs_warning: 'ABS / traction control warning light is on',
    symp_airbag_warning: 'Airbag or SRS warning light is on',
    symp_module_warning: 'Multiple warning lights or module communication warnings',
  },
  tr: {
    symp_abs_warning: 'ABS / çekiş kontrol uyarı lambası yanıyor',
    symp_airbag_warning: 'Airbag veya SRS uyarı lambası yanıyor',
    symp_module_warning: 'Birden fazla uyarı lambası veya modül iletişim uyarısı var',
  },
  de: {
    symp_abs_warning: 'ABS- oder Traktionskontrollleuchte ist an',
    symp_airbag_warning: 'Airbag- oder SRS-Warnleuchte ist an',
    symp_module_warning: 'Mehrere Warnleuchten oder Modul-Kommunikationswarnungen',
  },
  es: {
    symp_abs_warning: 'Luz de ABS o control de tracción encendida',
    symp_airbag_warning: 'Luz de airbag o SRS encendida',
    symp_module_warning: 'Varias luces de advertencia o avisos de comunicación de módulos',
  },
  fr: {
    symp_abs_warning: 'Voyant ABS ou antipatinage allumé',
    symp_airbag_warning: 'Voyant airbag ou SRS allumé',
    symp_module_warning: 'Plusieurs voyants ou alertes de communication entre modules',
  },
};

const systemProfiles = {
  chassis: {
    symptoms: ['symp_abs_warning', 'symp_speedometer_erratic', 'symp_cruise_not_working', 'symp_vibration', 'symp_reduced_power_mode'],
    causes: ['cause_wiring_damage', 'cause_connector_corrosion', 'cause_vss', 'cause_brake_switch', 'cause_power_steering_sensor'],
    difficulty: 'diff_moderate',
    cost: '$80 - $1200',
  },
  body: {
    symptoms: ['symp_airbag_warning', 'symp_module_warning', 'symp_battery_drain', 'symp_no_start', 'symp_cruise_not_working'],
    causes: ['cause_wiring_damage', 'cause_connector_corrosion', 'cause_battery', 'cause_pcm_failure', 'cause_pcm_software'],
    difficulty: 'diff_professional',
    cost: '$100 - $1500',
  },
  network: {
    symptoms: ['symp_module_warning', 'symp_check_engine', 'symp_no_start', 'symp_reduced_power_mode', 'symp_battery_drain'],
    causes: ['cause_wiring_damage', 'cause_connector_corrosion', 'cause_battery', 'cause_alternator', 'cause_pcm_failure'],
    difficulty: 'diff_professional',
    cost: '$120 - $2000',
  },
};

const seedCodes = [
  ['C0035', 'chassis', 'Left Front Wheel Speed Sensor Circuit'],
  ['C0040', 'chassis', 'Right Front Wheel Speed Sensor Circuit'],
  ['C0045', 'chassis', 'Left Rear Wheel Speed Sensor Circuit'],
  ['C0050', 'chassis', 'Right Rear Wheel Speed Sensor Circuit'],
  ['C0051', 'chassis', 'Steering Wheel Position Sensor'],
  ['C0110', 'chassis', 'Pump Motor Circuit'],
  ['C0121', 'chassis', 'Valve Relay Circuit'],
  ['C0161', 'chassis', 'ABS / TCS Brake Switch Circuit'],
  ['B0012', 'body', 'Driver Frontal Deployment Loop Stage 1'],
  ['B0013', 'body', 'Driver Frontal Deployment Loop Stage 2'],
  ['B0016', 'body', 'Passenger Frontal Deployment Loop Stage 1'],
  ['B0019', 'body', 'Passenger Frontal Deployment Loop Stage 2'],
  ['B0020', 'body', 'Left Side Airbag Deployment Control'],
  ['B0022', 'body', 'Driver Side Deployment Loop'],
  ['B0028', 'body', 'Passenger Side Airbag Deployment Control'],
  ['B0051', 'body', 'Deployment Commanded'],
  ['B0079', 'body', 'Driver Seatbelt Pretensioner'],
  ['B0081', 'body', 'Passenger Presence System'],
  ['U0001', 'network', 'High Speed CAN Communication Bus'],
  ['U0002', 'network', 'High Speed CAN Communication Bus Performance'],
  ['U0003', 'network', 'High Speed CAN Communication Bus (+) Open'],
  ['U0004', 'network', 'High Speed CAN Communication Bus (+) Low'],
  ['U0005', 'network', 'High Speed CAN Communication Bus (+) High'],
  ['U0100', 'network', 'Lost Communication With ECM/PCM A'],
  ['U0101', 'network', 'Lost Communication With Transmission Control Module'],
  ['U0102', 'network', 'Lost Communication With Transfer Case Control Module'],
  ['U0121', 'network', 'Lost Communication With Anti-Lock Brake System Control Module'],
  ['U0126', 'network', 'Lost Communication With Steering Angle Sensor Module'],
  ['U0140', 'network', 'Lost Communication With Body Control Module'],
  ['U0151', 'network', 'Lost Communication With Restraints Control Module'],
  ['U0155', 'network', 'Lost Communication With Instrument Panel Cluster Control Module'],
  ['U0164', 'network', 'Lost Communication With HVAC Control Module'],
  ['U0184', 'network', 'Lost Communication With Radio'],
  ['U0235', 'network', 'Lost Communication With Cruise Control Front Distance Range Sensor'],
  ['U0401', 'network', 'Invalid Data Received From ECM/PCM A'],
  ['U0415', 'network', 'Invalid Data Received From Anti-Lock Brake System Control Module'],
  ['U0422', 'network', 'Invalid Data Received From Body Control Module'],
  ['U0428', 'network', 'Invalid Data Received From Steering Angle Sensor Module'],
];

function titleLocales(code, title) {
  return {
    en: title,
    tr: `${code} ${title} arızası`,
    de: `${title} Fehler`,
    es: `Falla de ${title}`,
    fr: `Défaut ${title}`,
  };
}

function descriptionLocales(code, title, system) {
  const label = system === 'chassis' ? 'ABS/chassis' : system === 'body' ? 'body/SRS' : 'CAN/module communication';
  return {
    en: `${code} indicates a fault related to ${title}. This is handled as a ${label} diagnostic code. Confirm it with a scan tool that can access the correct module, check related codes, inspect power, ground, wiring and connectors, and verify the repair before replacing expensive modules or safety components.`,
    tr: `${code}, ${title} ile ilişkili bir arızayı gösterir. Bu kod ${label} sistemi içinde değerlendirilmelidir. Doğru modüle erişebilen bir teşhis cihazıyla doğrulayın, ilişkili kodları okuyun, güç, şase, kablo ve soketleri kontrol edin; pahalı modül veya güvenlik parçası değiştirmeden önce onarımı doğrulayın.`,
    de: `${code} weist auf einen Fehler im Zusammenhang mit ${title} hin. Dieser Code gehört zum Bereich ${label}. Mit einem Diagnosegerät für das passende Modul bestätigen, verwandte Codes prüfen, Stromversorgung, Masse, Kabel und Stecker kontrollieren und die Reparatur verifizieren.`,
    es: `${code} indica una falla relacionada con ${title}. Este código pertenece al sistema ${label}. Confírmalo con un escáner que acceda al módulo correcto, revisa códigos relacionados, alimentación, masa, cableado y conectores antes de cambiar módulos o componentes de seguridad.`,
    fr: `${code} indique un défaut lié à ${title}. Ce code concerne le système ${label}. Confirmez-le avec un outil capable d'accéder au bon module, vérifiez les codes associés, l'alimentation, la masse, le câblage et les connecteurs avant de remplacer des modules ou éléments de sécurité.`,
  };
}

for (const locale of Object.keys(symptomTokens)) {
  const file = path.join(messagesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.DB = { ...data.DB, ...symptomTokens[locale] };
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const baseCodes = JSON.parse(fs.readFileSync(basePath, 'utf8'));
for (const [code, system, title] of seedCodes) {
  const profile = systemProfiles[system];
  baseCodes[code] = {
    title: titleLocales(code, title),
    description: descriptionLocales(code, title, system),
    symptoms: profile.symptoms,
    causes: profile.causes,
    fixDifficulty: profile.difficulty,
    estimatedCost: profile.cost,
    verifiedSource: system === 'network'
      ? 'Generic OBD-II network communication listings and module communication DTC references.'
      : system === 'body'
        ? 'Generic OBD-II body/SRS DTC references and restraint-system service bulletin terminology.'
        : 'Generic OBD-II chassis/ABS DTC references and wheel-speed/ABS diagnostic terminology.',
  };
}

const ordered = Object.fromEntries(Object.entries(baseCodes).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(basePath, `${JSON.stringify(ordered, null, 2)}\n`);

const validRoutes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
validRoutes.validCodes = Object.keys(ordered).map(code => code.toUpperCase());
fs.writeFileSync(routesPath, `${JSON.stringify(validRoutes, null, 2)}\n`);

console.log(`Added/updated ${seedCodes.length} C/B/U seed codes. Total codes: ${validRoutes.validCodes.length}`);
