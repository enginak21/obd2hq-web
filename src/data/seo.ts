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
