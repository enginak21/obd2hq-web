export type LocalizedText = Record<'en' | 'tr' | 'de' | 'es' | 'fr', string>;

export interface SymptomGuide {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  searchIntents: string[];
  likelyCauses: string[];
  firstChecks: string[];
  relatedCodes: string[];
  relatedSystems: string[];
  driveAdvice: LocalizedText;
}

export const symptomGuides: SymptomGuide[] = [
  {
    slug: 'check-engine-light-flashing',
    title: {
      en: 'Check Engine Light Flashing',
      tr: 'Motor Arıza Lambası Yanıp Sönüyor',
      de: 'Motorkontrollleuchte blinkt',
      es: 'Luz de check engine parpadeando',
      fr: 'Voyant moteur clignotant',
    },
    description: {
      en: 'A flashing check engine light usually means an active misfire that can damage the catalytic converter. Diagnose it before driving hard.',
      tr: 'Yanıp sönen motor arıza lambası çoğunlukla aktif tekleme anlamına gelir ve katalizöre zarar verebilir.',
      de: 'Eine blinkende Motorkontrollleuchte weist meist auf aktive Fehlzündungen hin, die den Katalysator beschädigen können.',
      es: 'Una luz de check engine parpadeando suele indicar una falla de encendido activa que puede dañar el catalizador.',
      fr: 'Un voyant moteur clignotant indique souvent un raté actif pouvant endommager le catalyseur.',
    },
    severity: 'Critical',
    searchIntents: ['check engine light flashing', 'car shaking check engine light', 'motor arıza lambası yanıp sönüyor'],
    likelyCauses: ['Active misfire', 'Ignition coil or spark plug failure', 'Injector fault', 'Vacuum leak', 'Low compression'],
    firstChecks: ['Stop heavy acceleration', 'Scan for P0300-P0308', 'Check misfire counters', 'Inspect plugs, coils, injector connectors', 'Verify fuel trim and vacuum leaks'],
    relatedCodes: ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0420'],
    relatedSystems: ['Misfire', 'Ignition', 'Fuel delivery', 'Catalyst protection'],
    driveAdvice: {
      en: 'Do not keep driving under load. If the engine shakes heavily, tow the vehicle or drive only a very short distance to safety.',
      tr: 'Aracı yük altında kullanmaya devam etmeyin. Motor ciddi titriyorsa çekici daha güvenlidir.',
      de: 'Nicht weiter unter Last fahren. Bei starkem Schütteln ist Abschleppen sicherer.',
      es: 'No siga conduciendo con carga. Si el motor vibra fuerte, es mejor remolcar.',
      fr: 'Ne continuez pas à rouler en charge. Si le moteur tremble fortement, le remorquage est plus sûr.',
    },
  },
  {
    slug: 'engine-shaking',
    title: {
      en: 'Engine Shaking or Rough Idle',
      tr: 'Motor Titriyor veya Rölanti Bozuk',
      de: 'Motor ruckelt oder läuft unruhig',
      es: 'Motor vibra o ralentí irregular',
      fr: 'Moteur qui tremble ou ralenti instable',
    },
    description: {
      en: 'Engine shaking is most often caused by misfire, air leaks, fuel delivery problems, dirty throttle body, or engine mount issues.',
      tr: 'Motor titremesi çoğunlukla tekleme, hava kaçağı, yakıt besleme sorunu, kirli gaz kelebeği veya motor kulağı kaynaklıdır.',
      de: 'Motorruckeln entsteht häufig durch Fehlzündung, Luftleck, Kraftstoffproblem, verschmutzte Drosselklappe oder Motorlager.',
      es: 'La vibración del motor suele venir de misfire, fuga de aire, combustible, cuerpo de aceleración sucio o soportes.',
      fr: 'Les tremblements moteur viennent souvent de ratés, fuite d’air, carburant, papillon sale ou supports moteur.',
    },
    severity: 'High',
    searchIntents: ['engine shaking', 'rough idle', 'car vibrating at idle'],
    likelyCauses: ['Misfire', 'Vacuum leak', 'Dirty throttle body', 'Fuel injector imbalance', 'Worn engine mount'],
    firstChecks: ['Scan for misfire and fuel trim codes', 'Compare STFT/LTFT at idle and cruise', 'Inspect intake hoses and PCV lines', 'Check plugs and coils', 'Inspect engine mounts'],
    relatedCodes: ['P0300', 'P0171', 'P0174', 'P0505', 'P0101'],
    relatedSystems: ['Ignition', 'Air intake', 'Fuel trim', 'Idle control'],
    driveAdvice: {
      en: 'If the check engine light flashes or power is low, stop driving. If vibration is mild and the light is solid, drive gently to diagnosis.',
      tr: 'Arıza lambası yanıp sönüyorsa veya çekiş düştüyse sürmeyin. Hafif titremede düşük yükle servise gidilebilir.',
      de: 'Blinkt die Leuchte oder fehlt Leistung, nicht weiterfahren. Bei mildem Ruckeln vorsichtig zur Diagnose fahren.',
      es: 'Si la luz parpadea o falta potencia, no conduzca. Si es leve, conduzca suave hasta diagnóstico.',
      fr: 'Si le voyant clignote ou manque de puissance, arrêtez. Si c’est léger, roulez doucement vers un diagnostic.',
    },
  },
  {
    slug: 'loss-of-power',
    title: {
      en: 'Car Has No Power or Poor Acceleration',
      tr: 'Araç Çekişten Düştü',
      de: 'Auto hat keine Leistung',
      es: 'El coche no tiene potencia',
      fr: 'La voiture manque de puissance',
    },
    description: {
      en: 'Poor acceleration can come from limp mode, boost leaks, MAF/MAP signal faults, clogged exhaust, fuel pressure, or transmission problems.',
      tr: 'Çekiş düşüklüğü limp mode, boost kaçağı, MAF/MAP sinyal hatası, tıkalı egzoz, yakıt basıncı veya şanzıman kaynaklı olabilir.',
      de: 'Leistungsmangel kann von Notlauf, Ladedruckleck, MAF/MAP, Abgasstau, Kraftstoffdruck oder Getriebe kommen.',
      es: 'La falta de potencia puede venir de modo emergencia, fuga de boost, MAF/MAP, escape obstruido, combustible o transmisión.',
      fr: 'Le manque de puissance peut venir du mode dégradé, fuite de turbo, MAF/MAP, échappement bouché, carburant ou transmission.',
    },
    severity: 'High',
    searchIntents: ['car no power', 'poor acceleration', 'limp mode'],
    likelyCauses: ['Limp mode', 'MAF/MAP sensor issue', 'Boost leak', 'Clogged catalytic converter', 'Low fuel pressure'],
    firstChecks: ['Scan engine and transmission modules', 'Check MAF/MAP live data', 'Inspect intake and boost hoses', 'Review fuel trims and fuel pressure', 'Check catalyst backpressure if P0420/P0430 exists'],
    relatedCodes: ['P0101', 'P0102', 'P0235', 'P0299', 'P0420', 'P0700'],
    relatedSystems: ['Air metering', 'Turbo/boost', 'Fuel delivery', 'Transmission'],
    driveAdvice: {
      en: 'Avoid highways and heavy acceleration until the cause is known. Limp mode means the vehicle is protecting itself.',
      tr: 'Neden bilinmeden yüksek hız ve ani hızlanmadan kaçının. Limp mode aracın kendini koruduğunu gösterir.',
      de: 'Autobahn und starke Beschleunigung vermeiden. Notlauf bedeutet Selbstschutz des Fahrzeugs.',
      es: 'Evite autopista y aceleración fuerte. El modo emergencia protege el vehículo.',
      fr: 'Évitez autoroute et forte accélération. Le mode dégradé protège le véhicule.',
    },
  },
  {
    slug: 'fuel-smell',
    title: {
      en: 'Fuel Smell Inside or Around the Car',
      tr: 'Araçta Benzin Kokusu',
      de: 'Kraftstoffgeruch im oder am Auto',
      es: 'Olor a gasolina en el coche',
      fr: 'Odeur de carburant dans la voiture',
    },
    description: {
      en: 'Fuel smell can indicate an EVAP leak, rich running, injector leak, fuel line leak, or exhaust leak. Treat strong raw fuel smell as a safety issue.',
      tr: 'Benzin kokusu EVAP kaçağı, zengin karışım, enjektör kaçağı, yakıt hattı kaçağı veya egzoz kaçağı olabilir.',
      de: 'Kraftstoffgeruch kann EVAP-Leck, fettes Gemisch, Injektorleck, Kraftstoffleitung oder Abgasleck bedeuten.',
      es: 'El olor a gasolina puede indicar fuga EVAP, mezcla rica, inyector, línea de combustible o fuga de escape.',
      fr: 'Une odeur de carburant peut indiquer EVAP, mélange riche, injecteur, conduite ou fuite d’échappement.',
    },
    severity: 'Critical',
    searchIntents: ['car smells like gas', 'fuel smell in car', 'gas smell check engine light'],
    likelyCauses: ['Fuel leak', 'EVAP leak', 'Stuck injector', 'Rich fuel trim', 'Loose fuel cap'],
    firstChecks: ['Do not park near flames or heat', 'Inspect visible fuel leaks', 'Scan for EVAP and fuel trim codes', 'Check fuel cap seal', 'Smoke-test EVAP system'],
    relatedCodes: ['P0442', 'P0455', 'P0456', 'P0172', 'P0175'],
    relatedSystems: ['EVAP', 'Fuel delivery', 'Fuel trim', 'Safety'],
    driveAdvice: {
      en: 'If raw fuel smell is strong or you see liquid fuel, stop driving and tow the vehicle.',
      tr: 'Çiğ yakıt kokusu kuvvetliyse veya sıvı yakıt görüyorsanız aracı kullanmayın, çekici çağırın.',
      de: 'Bei starkem Kraftstoffgeruch oder sichtbarem Kraftstoff nicht fahren, abschleppen lassen.',
      es: 'Si el olor es fuerte o hay combustible visible, no conduzca y remolque.',
      fr: 'Si l’odeur est forte ou du carburant est visible, ne roulez pas et faites remorquer.',
    },
  },
  {
    slug: 'black-smoke',
    title: {
      en: 'Black Smoke From Exhaust',
      tr: 'Egzozdan Siyah Duman',
      de: 'Schwarzer Rauch aus dem Auspuff',
      es: 'Humo negro del escape',
      fr: 'Fumée noire à l’échappement',
    },
    description: {
      en: 'Black smoke usually means the engine is running rich: too much fuel, not enough air, or incorrect sensor data.',
      tr: 'Siyah duman çoğunlukla motorun zengin çalıştığını gösterir: fazla yakıt, az hava veya hatalı sensör verisi.',
      de: 'Schwarzer Rauch bedeutet meist fettes Gemisch: zu viel Kraftstoff, zu wenig Luft oder falsche Sensordaten.',
      es: 'El humo negro suele indicar mezcla rica: demasiado combustible, poco aire o datos de sensor incorrectos.',
      fr: 'La fumée noire indique souvent un mélange riche: trop de carburant, pas assez d’air ou mauvais capteur.',
    },
    severity: 'High',
    searchIntents: ['black smoke from exhaust', 'car running rich', 'diesel black smoke'],
    likelyCauses: ['Rich fuel trim', 'Dirty MAF', 'Leaking injector', 'Clogged air filter', 'Turbo/boost leak on diesel'],
    firstChecks: ['Check air filter and intake restriction', 'Review fuel trims', 'Inspect MAF/MAP readings', 'Check injector balance', 'Inspect boost hoses on turbo engines'],
    relatedCodes: ['P0172', 'P0175', 'P0101', 'P0102', 'P0299'],
    relatedSystems: ['Fuel trim', 'Air intake', 'Injectors', 'Turbo/boost'],
    driveAdvice: {
      en: 'Avoid long driving because rich running can damage the catalytic converter and wash oil from cylinder walls.',
      tr: 'Uzun süre kullanmayın; zengin karışım katalizöre ve silindir yağlamasına zarar verebilir.',
      de: 'Lange Fahrten vermeiden; fettes Gemisch kann Katalysator und Zylinderwände schädigen.',
      es: 'Evite conducir mucho; mezcla rica puede dañar catalizador y cilindros.',
      fr: 'Évitez les longs trajets; mélange riche peut endommager catalyseur et cylindres.',
    },
  },
  {
    slug: 'hard-start',
    title: {
      en: 'Hard Start or Long Crank',
      tr: 'Geç Çalışma veya Uzun Marş',
      de: 'Schwerer Start oder langes Orgeln',
      es: 'Arranque difícil o largo',
      fr: 'Démarrage difficile ou long',
    },
    description: {
      en: 'Hard starting is commonly caused by weak battery voltage, fuel pressure bleed-down, crank/cam sensor issues, temperature sensor errors, or air leaks.',
      tr: 'Geç çalışma zayıf akü voltajı, yakıt basıncı düşmesi, krank/eksantrik sensörü, sıcaklık sensörü veya hava kaçağı kaynaklı olabilir.',
      de: 'Schwerstart kommt oft von Batteriespannung, Kraftstoffdruck, Kurbel/Nockenwellensensor, Temperatursensor oder Luftleck.',
      es: 'Arranque difícil suele venir de batería, presión de combustible, sensor cigüeñal/árbol, temperatura o fuga de aire.',
      fr: 'Démarrage difficile: batterie, pression carburant, capteur vilebrequin/arbre, température ou fuite d’air.',
    },
    severity: 'Moderate',
    searchIntents: ['hard start', 'long crank', 'car takes long to start'],
    likelyCauses: ['Weak battery', 'Fuel pressure bleed-down', 'Crank sensor issue', 'Coolant temperature sensor error', 'Vacuum leak'],
    firstChecks: ['Measure battery voltage while cranking', 'Scan for crank/cam and temperature codes', 'Check fuel pressure hold', 'Review coolant temp live data cold', 'Inspect intake leaks'],
    relatedCodes: ['P0335', 'P0340', 'P0115', 'P0171', 'P0191'],
    relatedSystems: ['Starting', 'Fuel pressure', 'Sensors', 'Air intake'],
    driveAdvice: {
      en: 'Usually driveable after starting, but repeated long cranking can damage the starter and leave you stranded.',
      tr: 'Çalıştıktan sonra genelde gidilebilir ama uzun marş marş motoruna zarar verebilir ve yolda bırakabilir.',
      de: 'Nach dem Start meist fahrbar, aber langes Orgeln kann den Anlasser beschädigen.',
      es: 'Suele poder conducirse tras arrancar, pero arranques largos dañan el motor de arranque.',
      fr: 'Souvent roulable après démarrage, mais les longs démarrages usent le démarreur.',
    },
  },
];

export function getSymptomBySlug(slug: string) {
  return symptomGuides.find(symptom => symptom.slug === slug) || null;
}

export function localizeSymptom(symptom: SymptomGuide, locale: string) {
  const key = (['en', 'tr', 'de', 'es', 'fr'].includes(locale) ? locale : 'en') as keyof LocalizedText;
  return {
    title: symptom.title[key],
    description: symptom.description[key],
    driveAdvice: symptom.driveAdvice[key],
  };
}
