export const SUPPORTED_LOCALES = ['en', 'de', 'es', 'tr', 'fr'] as const;

export const PRIORITY_CODES = ['P0420', 'P0300', 'P0171', 'P0455', 'P0442', 'P0128', 'P0135', 'P0174', 'P0430', 'P0101', 'P0113', 'P0102'];
export const SEO_LAST_REVIEWED = '2026-07-14T12:00:00.000Z';

export const CODE_CATEGORIES = [
  { label: 'Engine', codes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0507'] },
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

export function getFallbackDiagnosticSteps(code: string, make: string, model: string, locale = 'en') {
  const upperCode = code.toUpperCase();
  const vehicle = `${make} ${model}`.replace(/\b\w/g, char => char.toUpperCase());

  if (locale === 'tr') {
    return [
      `${upperCode} kodunu kaliteli bir OBD2 cihazıyla doğrulayın ve hiçbir şeyi silmeden önce freeze-frame verisini kaydedin.`,
      `${vehicle} motor bölmesinde gevşek soket, hasarlı kablo, çatlak vakum hortumu, yanmış sigorta veya belirgin egzoz kaçağı var mı kontrol edin.`,
      `${upperCode} kodunun işaret ettiği sensör veya sistem için canlı veriyi okuyun; voltaj, sıcaklık, yakıt trim veya çalışma davranışını normal değerlerle karşılaştırın.`,
      `Önce doğrulanmış en basit arızayı onarın, sonra kodu silip monitör tekrar çalışana kadar sürüş döngüsünü tamamlayın.`,
      `${upperCode} temel kontrollerden sonra geri gelirse parça değiştirmeyi bırakın ve devreyi multimetre ya da profesyonel teşhis cihazıyla doğrulayın.`,
    ];
  }

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

const LOCALIZED_SYSTEM_CONTENT = {
  tr: {
    catalyst: {
      label: 'Katalizör ve oksijen sensörü izleme sistemi',
      firstChecks: ['Alt oksijen sensöründen önce egzoz kaçağı var mı kontrol edin.', 'Motor tamamen ısındıktan sonra üst ve alt O2 sensörü canlı verilerini karşılaştırın.', 'Katalizör değiştirmeden önce yakıt trim değerlerini ve tekleme geçmişini kontrol edin.'],
      mistake: 'Egzoz kaçağı, O2 sensörü davranışı, yakıt trimleri ve tekleme geçmişi kontrol edilmeden katalizörü değiştirmek.',
      costNote: 'Ucuz çözümler genelde kaçak, kablo veya sensör soketi onarımıdır; katalizör değişimi testler gerçekten düşük verim gösterdikten sonra son adımdır.',
    },
    evap: {
      label: 'EVAP kaçak ve purge sistemi',
      firstChecks: ['Yakıt kapağının doğru kapandığını ve araca uygun olduğunu doğrulayın.', 'EVAP hortumlarını, purge valfini, vent valfini ve karbon filtre bağlantılarını kontrol edin.', 'Birden fazla EVAP parçası değiştirmeden önce duman testi yapın.'],
      mistake: 'EVAP sistemini duman testiyle kontrol etmeden veya purge/vent valfini ölçmeden sürekli yakıt kapağı değiştirmek.',
      costNote: 'Birçok EVAP onarımı düşük veya orta maliyetlidir; duman testi gereksiz parça değişimini önler.',
    },
    misfire: {
      label: 'Tekleme ve yanma sistemi',
      firstChecks: ['Pahalı parça değiştirmeden önce buji, bobin, enjektör dengesi ve kompresyonu kontrol edin.', 'Teklemenin hangi devir ve yükte oluştuğunu görmek için freeze-frame verisini inceleyin.', 'Çoklu silindir teklemesine yol açabilecek yakıt trim veya vakum kaçağı kodlarını arayın.'],
      mistake: 'Bobinleri yer değiştirme testi yapmadan, bujileri kontrol etmeden veya yakıt ve kompresyonun sağlıklı olduğunu doğrulamadan ateşleme bobini değiştirmek.',
      costNote: 'Tek silindir ateşleme sorunları çoğu zaman makul maliyetlidir; kompresyon veya zamanlama sorunları profesyonel teşhis gerektirir.',
    },
    'fuel-trim': {
      label: 'Yakıt trim ve hava ölçüm sistemi',
      firstChecks: ['Rölantide ve sabit hızda kısa ve uzun dönem yakıt trimlerini okuyun.', 'Emme hortumları, vakum hatları, PCV bağlantıları ve MAF sensörü kirlenmesini kontrol edin.', 'Trimler yük altında fakir karışıma işaret ediyorsa yakıt basıncını ölçün.'],
      mistake: 'Gerçek neden hava kaçağı, yakıt basıncı veya MAF verisi iken oksijen sensörünü değiştirmek.',
      costNote: 'Vakum kaçakları ve temizlik ucuzdur; yakıt pompası, enjektör veya MAF değişimi daha pahalıdır ve doğrulanmalıdır.',
    },
    sensor: {
      label: 'Sensör devresi ve canlı veri',
      firstChecks: ['Sokette korozyon, kırık kilit, yağ girişi veya ısı hasarı var mı kontrol edin.', 'Uygunsa 5V referans, şase ve sinyal hattını multimetreyle doğrulayın.', 'Canlı sensör verisini gerçekçi motor sıcaklığı, basınç, hava akışı veya gaz kelebeği değerleriyle karşılaştırın.'],
      mistake: 'Güç, şase, sinyal ve kablo sürekliliği test edilmeden adı geçen sensörü değiştirmek.',
      costNote: 'Sensör değişimi orta maliyetli olabilir; kablo ve soket onarımları sık görülür ve çoğu zaman daha ucuzdur.',
    },
    transmission: {
      label: 'Şanzıman kontrol ve vites izleme sistemi',
      firstChecks: ['Araç tasarımı izin veriyorsa şanzıman yağı seviyesini ve durumunu kontrol edin.', 'Sadece motor kodlarını değil, şanzıman modülü verilerini de tarayın.', 'İç şanzıman arızası varsaymadan önce hız sensörü, solenoid ve elektrik kodlarını arayın.'],
      mistake: 'Yağ, sensör, solenoid, kablo ve kontrol modülü kodları kontrol edilmeden şanzıman revizyonu gerektiğini varsaymak.',
      costNote: 'Elektrik onarımları orta maliyetli olabilir; iç şanzıman onarımları pahalıdır ve profesyonel doğrulama ister.',
    },
    'idle-speed': {
      label: 'Rölanti devri ve gaz kelebeği kontrolü',
      firstChecks: ['Emme kaçağı ve gaz kelebeği karbon birikimini kontrol edin.', 'Rölanti hava kontrolü veya elektronik gaz kelebeği canlı verisini okuyun.', 'Gaz kelebeği temizlendiyse veya değiştiyse akü voltajını ve adaptasyon işlemini doğrulayın.'],
      mistake: 'Temizlik, hava kaçağı kontrolü ve doğru rölanti adaptasyonu yapılmadan gaz kelebeği parçalarını değiştirmek.',
      costNote: 'Temizlik ve adaptasyon ucuzdur; aktüatör veya gaz kelebeği değişimi veriyle doğrulanmalıdır.',
    },
    'control-module': {
      label: 'Kontrol modülü, güç ve haberleşme sistemi',
      firstChecks: ['Akü sağlığı, şarj voltajı, sigortalar, şase bağlantıları ve modül soketlerini kontrol edin.', 'Ağ haberleşme kodlarını ve birden fazla modülde arıza olup olmadığını arayın.', 'PCM/ECM/TCM arızasından şüphelenmeden önce güç ve şaseyi doğrulayın.'],
      mistake: 'Voltaj beslemesi, şaseler, sigortalar, su girişi ve soket durumu kontrol edilmeden kontrol modülü değiştirmek.',
      costNote: 'Güç ve şase onarımları genelde modül değişiminden ucuzdur; modül değişimi programlama da gerektirebilir.',
    },
    powertrain: {
      label: 'Genel güç aktarma devresi',
      firstChecks: ['Arızayı silmeden önce freeze-frame verisini ve ilişkili kodları kaydedin.', 'İlgili sisteme ait kablo, soket, vakum hattı, sıvı kaçağı ve sigortaları kontrol edin.', 'Parça değiştirmeden önce canlı veri veya multimetre ile arızalı devreyi doğrulayın.'],
      mistake: 'Kod açıklamasını parça listesi gibi görmek ve devreyi, çalışma koşullarını ve ilişkili kodları doğrulamamak.',
      costNote: 'Maliyet geniş aralıkta değişir; gereksiz parça değişimini önlemek için görsel kontrol ve devre doğrulamasıyla başlayın.',
    },
  },
} as const;

export function getLocalizedSystemContent(code: string, locale: string) {
  const system = getCodeSystem(code);
  if (locale === 'tr') return LOCALIZED_SYSTEM_CONTENT.tr[system];
  return getSystemContent(code);
}

export function getRepairTiers(code: string, estimatedCost: string, locale = 'en') {
  const system = getCodeSystem(code);
  if (locale === 'tr') {
    const cheap = system === 'catalyst' ? 'Egzoz kaçağı kontrolü, kablo onarımı veya sensör soketi onarımı' :
      system === 'evap' ? 'Yakıt kapağı, hortum kelepçesi veya küçük EVAP hortumu onarımı' :
      system === 'misfire' ? 'Buji, bobin yer değiştirme testi veya soket onarımı' :
      system === 'fuel-trim' ? 'Vakum kaçağı onarımı, MAF temizliği veya PCV hortumu onarımı' :
      'Sigorta, soket, kablo, temizlik veya temel kontrol';

    const expensive = system === 'catalyst' ? 'Katalizör verimsizliği testlerle doğrulandıktan sonra katalitik konvertör değişimi' :
      system === 'transmission' ? 'Elektrik kontrollerinden sonra iç şanzıman onarımı veya modül programlama' :
      system === 'control-module' ? 'Güç/şase doğrulandıktan sonra kontrol modülü değişimi ve programlama' :
      'Canlı veri ve devre testleri arızayı doğruladıktan sonra büyük parça değişimi';

    return { cheap, typical: estimatedCost, expensive };
  }

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

const CODE_PAGE_COPY = {
  en: {
    modelSpecific: 'Model-specific diagnostic notes',
    genericInsight: (make: string, model: string, code: string, system: string) =>
      `${make} ${model} ${code} is being handled as a ${system.toLowerCase()} fault. Start with scan data, related codes, wiring, connectors, and live data before replacing parts.`,
    likelySymptoms: 'Symptoms that matter most',
    firstTests: 'Tests to run before buying parts',
    avoidReplacing: 'Do not replace first',
    liveData: 'Live data to compare',
    repairVerification: 'Repair verification',
    verificationCopy: (code: string) =>
      `After the repair, clear ${code}, complete a drive cycle, and confirm the monitor runs without the code returning. Save the before/after scan report if the vehicle needs emissions inspection.`,
    clusterTitle: 'Build the full diagnosis',
    sameSystem: 'Same system',
    sameVehicle: 'Same vehicle',
    pillarGuide: 'Pillar guide',
  },
  tr: {
    modelSpecific: 'Modele özel teşhis notları',
    genericInsight: (make: string, model: string, code: string, system: string) =>
      `${make} ${model} ${code} arızası ${system.toLowerCase()} sistemi içinde değerlendirilmelidir. Parça almadan önce tarama verisi, ilişkili kodlar, kablo/soket ve canlı veri kontrol edilmelidir.`,
    likelySymptoms: 'En önemli belirtiler',
    firstTests: 'Parça almadan önce yapılacak testler',
    avoidReplacing: 'İlk değiştirilecek parça değil',
    liveData: 'Karşılaştırılacak canlı veri',
    repairVerification: 'Onarım sonrası doğrulama',
    verificationCopy: (code: string) =>
      `Onarımdan sonra ${code} kodunu silin, sürüş döngüsünü tamamlayın ve monitör çalıştığında kodun geri dönmediğini doğrulayın. Muayene/emisyon için önce-sonra tarama kaydını saklayın.`,
    clusterTitle: 'Teşhisi tamamlayan rehberler',
    sameSystem: 'Aynı sistem',
    sameVehicle: 'Aynı araç',
    pillarGuide: 'Ana rehber',
  },
  de: {
    modelSpecific: 'Modellspezifische Diagnosenotizen',
    genericInsight: (make: string, model: string, code: string, system: string) =>
      `${make} ${model} ${code} sollte als Fehler im Bereich ${system.toLowerCase()} geprüft werden. Beginnen Sie mit Scandaten, verwandten Codes, Kabeln, Steckern und Live-Daten, bevor Teile ersetzt werden.`,
    likelySymptoms: 'Wichtigste Symptome',
    firstTests: 'Tests vor dem Teilekauf',
    avoidReplacing: 'Nicht zuerst ersetzen',
    liveData: 'Zu vergleichende Live-Daten',
    repairVerification: 'Reparatur bestätigen',
    verificationCopy: (code: string) =>
      `Nach der Reparatur ${code} löschen, einen Fahrzyklus durchführen und bestätigen, dass der Monitor ohne Rückkehr des Codes läuft.`,
    clusterTitle: 'Diagnose vertiefen',
    sameSystem: 'Gleiches System',
    sameVehicle: 'Gleiches Fahrzeug',
    pillarGuide: 'Hauptleitfaden',
  },
  es: {
    modelSpecific: 'Notas de diagnóstico específicas del modelo',
    genericInsight: (make: string, model: string, code: string, system: string) =>
      `${make} ${model} ${code} debe tratarse como una falla del sistema ${system.toLowerCase()}. Empiece con datos del escáner, códigos relacionados, cableado, conectores y datos en vivo antes de cambiar piezas.`,
    likelySymptoms: 'Síntomas más importantes',
    firstTests: 'Pruebas antes de comprar piezas',
    avoidReplacing: 'No reemplazar primero',
    liveData: 'Datos en vivo para comparar',
    repairVerification: 'Verificación de la reparación',
    verificationCopy: (code: string) =>
      `Después de reparar, borre ${code}, complete un ciclo de manejo y confirme que el monitor se ejecuta sin que vuelva el código.`,
    clusterTitle: 'Completar el diagnóstico',
    sameSystem: 'Mismo sistema',
    sameVehicle: 'Mismo vehículo',
    pillarGuide: 'Guía principal',
  },
  fr: {
    modelSpecific: 'Notes de diagnostic propres au modèle',
    genericInsight: (make: string, model: string, code: string, system: string) =>
      `${make} ${model} ${code} doit être traité comme une panne du système ${system.toLowerCase()}. Commencez par les données de diagnostic, les codes associés, le câblage, les connecteurs et les données en direct avant de remplacer des pièces.`,
    likelySymptoms: 'Symptômes les plus importants',
    firstTests: 'Tests avant achat de pièces',
    avoidReplacing: 'Ne pas remplacer en premier',
    liveData: 'Données en direct à comparer',
    repairVerification: 'Vérification après réparation',
    verificationCopy: (code: string) =>
      `Après la réparation, effacez ${code}, effectuez un cycle de conduite et confirmez que le moniteur s’exécute sans retour du code.`,
    clusterTitle: 'Compléter le diagnostic',
    sameSystem: 'Même système',
    sameVehicle: 'Même véhicule',
    pillarGuide: 'Guide principal',
  },
} as const;

const SYSTEM_LIVE_DATA: Record<string, string[]> = {
  catalyst: ['Upstream vs downstream O2 sensor switching', 'Short-term and long-term fuel trim', 'Misfire counters and catalyst monitor readiness'],
  evap: ['Purge command vs fuel tank pressure response', 'Vent valve command', 'Smoke test result and cap seal condition'],
  misfire: ['Mode $06 misfire counters', 'Fuel trim at idle and cruise', 'Coil/injector swap result and compression reading'],
  'fuel-trim': ['STFT/LTFT at idle and 2500 RPM', 'MAF grams per second', 'Fuel pressure under load'],
  sensor: ['5V reference, ground, and signal voltage', 'Sensor value compared with realistic engine conditions', 'Connector wiggle-test result'],
  transmission: ['Transmission module codes', 'Input/output speed sensor data', 'Solenoid command vs gear ratio'],
  'idle-speed': ['Throttle position and commanded idle', 'MAF/MAP at idle', 'Battery voltage and relearn status'],
  'control-module': ['Battery voltage while cranking', 'Module power and ground voltage drop', 'Network communication codes'],
  powertrain: ['Freeze-frame conditions', 'Related codes', 'Circuit voltage and continuity'],
};

const PRIORITY_MODEL_INSIGHTS: Record<string, {
  insight: Record<string, string>;
  likelySymptoms: string[];
  firstTests: string[];
  avoidReplacing: string;
}> = {
  'ford/focus/P0213': {
    insight: {
      en: 'For a Ford Focus, P0213 should be verified as an injector control or cold-start enrichment circuit issue before assuming an injector is faulty. Heat-damaged wiring, connector tension, fuse power, and PCM command are the high-value checks.',
      tr: 'Ford Focus için P0213, enjektör veya soğuk çalıştırma zenginleştirme devresi olarak doğrulanmadan enjektör arızası kabul edilmemelidir. Isı hasarlı kablo, soket sıkılığı, sigorta beslemesi ve PCM komutu en değerli kontrollerdir.',
      de: 'Beim Ford Focus muss P0213 als Einspritz- oder Kaltstart-Ansteuerungsproblem bestätigt werden, bevor ein Injektor verdächtigt wird. Kabelschäden, Steckersitz, Sicherungsspannung und PCM-Ansteuerung sind die wichtigsten Prüfungen.',
      es: 'En un Ford Focus, P0213 debe confirmarse como un problema de control del inyector o enriquecimiento en frío antes de culpar al inyector. Cableado por calor, tensión del conector, fusible y comando del PCM son las pruebas clave.',
      fr: 'Sur Ford Focus, P0213 doit être confirmé comme un problème de commande d’injecteur ou d’enrichissement à froid avant d’accuser l’injecteur. Câblage chauffé, connecteur, alimentation fusible et commande PCM sont prioritaires.',
    },
    likelySymptoms: ['Hard cold start', 'Rough idle after startup', 'Fuel smell or extended crank'],
    firstTests: ['Check injector/cold-start circuit fuse power', 'Back-probe connector power and ground command', 'Inspect harness where it passes hot engine areas'],
    avoidReplacing: 'Fuel injector or PCM before confirming power, ground, command, and wiring continuity.',
  },
  'suzuki/jimny/P0235': {
    insight: {
      en: 'On a Suzuki Jimny, P0235 should be approached as a boost/MAP signal plausibility problem. Compare key-on engine-off pressure, idle pressure, and boost under load before replacing the sensor.',
      tr: 'Suzuki Jimny için P0235, boost/MAP sinyali tutarlılık problemi olarak ele alınmalıdır. Sensör değiştirmeden önce kontak açık motor kapalı basınç, rölanti basıncı ve yük altındaki boost değeri karşılaştırılmalıdır.',
      de: 'Beim Suzuki Jimny sollte P0235 als Plausibilitätsproblem des Ladedruck/MAP-Signals geprüft werden. Vergleichen Sie Druck bei Zündung ein, Leerlauf und Last, bevor der Sensor ersetzt wird.',
      es: 'En Suzuki Jimny, P0235 debe tratarse como un problema de plausibilidad de señal boost/MAP. Compare presión con contacto, ralentí y carga antes de cambiar el sensor.',
      fr: 'Sur Suzuki Jimny, P0235 doit être vu comme un problème de plausibilité du signal boost/MAP. Comparez pression contact mis, ralenti et charge avant de remplacer le capteur.',
    },
    likelySymptoms: ['Low boost or limp mode', 'Poor acceleration', 'Check engine light under load'],
    firstTests: ['Compare MAP/boost value key-on engine-off to barometric pressure', 'Inspect boost hoses and intercooler pipes', 'Check 5V reference, ground, and signal wire'],
    avoidReplacing: 'Turbocharger before sensor signal, boost leaks, vacuum control, and wiring are verified.',
  },
  'suzuki/jimny/P0203': {
    insight: {
      en: 'For Suzuki Jimny P0203, prove the cylinder 3 injector circuit electrically before replacing the injector. A connector, harness rub-through, or driver command issue can mimic a failed injector.',
      tr: 'Suzuki Jimny P0203 için enjektörü değiştirmeden önce 3. silindir enjektör devresi elektriksel olarak kanıtlanmalıdır. Soket, kablo sürtmesi veya sürücü komutu sorunu enjektör arızası gibi görünebilir.',
      de: 'Bei Suzuki Jimny P0203 muss der Injektor-3-Stromkreis elektrisch geprüft werden, bevor der Injektor ersetzt wird. Stecker, Kabelscheuerung oder Ansteuerung können einen defekten Injektor vortäuschen.',
      es: 'Para Suzuki Jimny P0203, confirme eléctricamente el circuito del inyector 3 antes de reemplazarlo. Conector, cable rozado o comando del driver pueden imitar un inyector malo.',
      fr: 'Pour Suzuki Jimny P0203, confirmez électriquement le circuit injecteur cylindre 3 avant de remplacer l’injecteur. Connecteur, faisceau ou commande peuvent imiter une panne d’injecteur.',
    },
    likelySymptoms: ['Misfire on cylinder 3', 'Fuel smell or rough idle', 'Reduced power'],
    firstTests: ['Check injector resistance against other cylinders', 'Use a noid light or scope for injector pulse', 'Inspect harness movement near cylinder 3'],
    avoidReplacing: 'Injector before confirming resistance, pulse, power feed, and harness integrity.',
  },
  'suzuki/jimny/P0204': {
    insight: {
      en: 'Suzuki Jimny P0204 is a cylinder 4 injector circuit fault until proven otherwise. Compare cylinder 4 resistance, power feed, and pulse with the other injectors.',
      tr: 'Suzuki Jimny P0204 aksi kanıtlanana kadar 4. silindir enjektör devresi arızasıdır. 4. silindir direnç, besleme ve pulse değerini diğer enjektörlerle karşılaştırın.',
      de: 'Suzuki Jimny P0204 ist bis zum Gegenbeweis ein Fehler im Injektor-4-Stromkreis. Vergleichen Sie Widerstand, Versorgung und Impuls mit den anderen Injektoren.',
      es: 'Suzuki Jimny P0204 es una falla del circuito del inyector 4 hasta demostrar lo contrario. Compare resistencia, alimentación y pulso con los demás inyectores.',
      fr: 'Suzuki Jimny P0204 est une panne du circuit injecteur 4 jusqu’à preuve contraire. Comparez résistance, alimentation et impulsion avec les autres injecteurs.',
    },
    likelySymptoms: ['Cylinder 4 misfire', 'Rough running', 'Poor fuel economy'],
    firstTests: ['Compare injector resistance across cylinders', 'Check injector pulse on cylinder 4', 'Inspect injector harness for rub-through'],
    avoidReplacing: 'ECM or injector rail before confirming the cylinder 4 circuit.',
  },
  'acura/tlx/P0102': {
    insight: {
      en: 'On an Acura TLX, P0102 often needs intake and MAF signal validation before replacing the MAF sensor. Check for intake leaks, dirty sensor element, low signal voltage, and aftermarket intake turbulence.',
      tr: 'Acura TLX için P0102, MAF sensörü değişmeden önce emme hattı ve MAF sinyali doğrulaması gerektirir. Emme kaçağı, kirli sensör elemanı, düşük sinyal voltajı ve yan sanayi emme sistemi türbülansı kontrol edilmelidir.',
      de: 'Beim Acura TLX erfordert P0102 eine Prüfung von Ansaugung und MAF-Signal, bevor der MAF ersetzt wird. Prüfen Sie Lecks, Verschmutzung, niedrige Signalspannung und Zubehör-Ansaugung.',
      es: 'En Acura TLX, P0102 requiere validar admisión y señal MAF antes de reemplazar el sensor. Revise fugas, suciedad, bajo voltaje y turbulencia por admisión aftermarket.',
      fr: 'Sur Acura TLX, P0102 demande de valider l’admission et le signal MAF avant remplacement. Vérifiez fuite, élément sale, tension basse et admission non d’origine.',
    },
    likelySymptoms: ['Hesitation on acceleration', 'Lean fuel trims', 'Stalling or rough idle'],
    firstTests: ['Inspect intake duct after the MAF', 'Compare MAF g/s at idle and 2500 RPM', 'Check MAF power, ground, and signal voltage'],
    avoidReplacing: 'MAF sensor before checking intake leaks, dirty element, wiring, and fuel trim data.',
  },
};

export function getCodePageCopy(locale: string) {
  return CODE_PAGE_COPY[(locale as keyof typeof CODE_PAGE_COPY)] || CODE_PAGE_COPY.en;
}

export function getModelSpecificInsight(make: string, model: string, code: string, locale = 'en') {
  const system = getSystemContent(code);
  const key = `${make}/${model}/${code.toUpperCase()}`;
  const priority = PRIORITY_MODEL_INSIGHTS[key];
  if (priority) {
    return {
      insight: priority.insight[locale] || priority.insight.en,
      likelySymptoms: priority.likelySymptoms,
      firstTests: priority.firstTests,
      avoidReplacing: priority.avoidReplacing,
      liveData: SYSTEM_LIVE_DATA[getCodeSystem(code)] || SYSTEM_LIVE_DATA.powertrain,
    };
  }

  const copy = getCodePageCopy(locale);
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  return {
    insight: copy.genericInsight(capMake, capModel, code.toUpperCase(), system.label),
    likelySymptoms: system.firstChecks.slice(0, 2),
    firstTests: system.firstChecks,
    avoidReplacing: system.mistake,
    liveData: SYSTEM_LIVE_DATA[getCodeSystem(code)] || SYSTEM_LIVE_DATA.powertrain,
  };
}

export function getClusterLinks(locale: string, make: string, model: string, code: string) {
  const upperCode = code.toUpperCase();
  const system = getCodeSystem(upperCode);
  const p0300Slugs: Record<string, string> = {
    en: 'p0300-symptoms-random-misfire',
    tr: 'p0300-belirtileri-rastgele-tekleme',
    de: 'p0300-symptome-zufallsfehlzuendung',
    es: 'p0300-symptoms-random-misfire',
    fr: 'p0300-symptoms-random-misfire',
  };
  const pillar = system === 'catalyst'
    ? { label: upperCode === 'P0420' ? 'How to fix P0420' : 'P0420 catalyst guide', href: `/${locale}/blog/${locale === 'tr' ? 'p0420-ariza-kodu-nasil-cozulur' : 'how-to-fix-p0420'}` }
    : system === 'misfire'
      ? { label: 'P0300 symptoms guide', href: `/${locale}/blog/${p0300Slugs[locale] || p0300Slugs.en}` }
      : { label: 'OBD2 code lookup', href: `/${locale}/search?q=${upperCode}` };

  return [
    pillar,
    { label: `${make.replace('-', ' ')} ${model.replace('-', ' ')} warning lights`, href: `/${locale}/${make}/${model}/lights` },
    ...getRelatedCodes(upperCode, PRIORITY_CODES, 3).map(related => ({
      label: `${related} related code`,
      href: `/${locale}/${make}/${model}/${related.toLowerCase()}`,
    })),
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
