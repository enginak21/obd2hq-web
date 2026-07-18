import generatedSynonyms from './generated/problem-finder-synonyms.json';

export const PROBLEM_FINDER_LOCALES = ['en', 'tr', 'de', 'es', 'fr'] as const;
export type ProblemFinderLocale = typeof PROBLEM_FINDER_LOCALES[number];

export const problemFinderBasePaths: Record<ProblemFinderLocale, string> = {
  en: 'car-problem-finder',
  tr: 'ariza-bulucu',
  de: 'auto-problemfinder',
  es: 'buscador-fallas',
  fr: 'trouver-panne',
};

type LocalizedString = Record<ProblemFinderLocale, string>;
type CostLevel = 'low' | 'medium' | 'high' | 'unknown';
type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface ProblemFinderIntent {
  intentKey: string;
  category: string;
  severity: Severity;
  costLevel: CostLevel;
  slugs: LocalizedString;
  titles: LocalizedString;
  searchPhrases: Record<ProblemFinderLocale, string[]>;
  plainExplanation: LocalizedString;
  likelyCauses: Record<ProblemFinderLocale, string[]>;
  firstChecks: Record<ProblemFinderLocale, string[]>;
  doNotReplaceYet: LocalizedString;
  safeToDrive: LocalizedString;
  relatedCodes: string[];
  relatedSymptoms: string[];
  internalLinks: Record<ProblemFinderLocale, Array<{ label: string; href: string }>>;
}

const localeNames: Record<ProblemFinderLocale, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
};

const hubLabels: Record<ProblemFinderLocale, string> = {
  en: 'Car Problem Finder',
  tr: 'Arıza Bulucu',
  de: 'Auto Problemfinder',
  es: 'Buscador de fallas',
  fr: 'Trouver une panne',
};

const doNotReplaceLabels: Record<ProblemFinderLocale, string> = {
  en: 'Do not replace expensive parts before these basic checks confirm the fault path.',
  tr: 'Bu temel kontroller arıza yönünü doğrulamadan pahalı parçaları değiştirmeyin.',
  de: 'Teure Teile erst ersetzen, wenn diese Grundprüfungen die Fehler Richtung bestätigen.',
  es: 'No cambies piezas caras antes de confirmar la ruta de falla con estas revisiones.',
  fr: 'Ne remplacez pas de pièces coûteuses avant de confirmer la piste avec ces contrôles.',
};

const driveAdvice: Record<Severity, LocalizedString> = {
  low: {
    en: 'Usually drivable for a short trip if the car feels normal, but book a check soon.',
    tr: 'Araç normal davranıyorsa kısa mesafe kullanılabilir; yine de yakında kontrol ettirin.',
    de: 'Meist kurz fahrbar, wenn sich das Auto normal verhält. Zeitnah prüfen lassen.',
    es: 'Normalmente se puede conducir poco si el coche va normal, pero revisa pronto.',
    fr: 'Souvent roulable sur courte distance si la voiture réagit normalement, à contrôler vite.',
  },
  moderate: {
    en: 'Drive gently only if there is no smoke, strong smell, overheating, or flashing warning light.',
    tr: 'Duman, yoğun koku, hararet veya yanıp sönen uyarı yoksa sadece sakin kullanın.',
    de: 'Nur vorsichtig fahren, wenn kein Rauch, starker Geruch, Überhitzen oder blinkende Warnung var.',
    es: 'Conduce suave solo si no hay humo, olor fuerte, sobrecalentamiento o testigo parpadeando.',
    fr: 'Roulez doucement seulement sans fumée, odeur forte, surchauffe ou voyant clignotant.',
  },
  high: {
    en: 'Avoid driving until the cause is checked. Continuing may increase repair cost or safety risk.',
    tr: 'Sebep kontrol edilene kadar kullanmayın. Devam etmek masrafı veya güvenlik riskini artırabilir.',
    de: 'Bis zur Prüfung nicht weiterfahren. Weiterfahrt kann Kosten oder Sicherheitsrisiken erhöhen.',
    es: 'Evita conducir hasta revisar la causa. Seguir puede aumentar coste o riesgo.',
    fr: 'Évitez de rouler avant contrôle. Continuer peut augmenter le coût ou le risque.',
  },
  critical: {
    en: 'Stop safely as soon as possible and do not continue driving until inspected.',
    tr: 'Güvenli yerde durun ve kontrol edilene kadar aracı kullanmayın.',
    de: 'Sicher anhalten und bis zur Prüfung nicht weiterfahren.',
    es: 'Detente en un lugar seguro y no sigas conduciendo hasta revisar.',
    fr: 'Arrêtez-vous en sécurité et ne reprenez pas la route avant contrôle.',
  },
};

const categoryCopy: Record<string, {
  explanation: LocalizedString;
  causes: Record<ProblemFinderLocale, string[]>;
  checks: Record<ProblemFinderLocale, string[]>;
}> = {
  engine_performance: {
    explanation: {
      en: 'This usually points to air, fuel, ignition, compression, turbo, or sensor data being outside the range the engine needs.',
      tr: 'Bu genelde motorun ihtiyaç duyduğu hava, yakıt, ateşleme, kompresyon, turbo veya sensör verilerinden birinin doğru olmadığını gösterir.',
      de: 'Das weist meist darauf hin, dass Luft, Kraftstoff, Zündung, Kompression, Turbo oder Sensordaten nicht passen.',
      es: 'Suele indicar que aire, combustible, chispa, compresión, turbo o sensores no están dentro del rango correcto.',
      fr: 'Cela indique souvent un souci d’air, carburant, allumage, compression, turbo ou données capteur.',
    },
    causes: {
      en: ['Dirty air filter or intake restriction', 'Vacuum leak or loose hose', 'Weak coil, spark plug, or injector', 'Low fuel pressure', 'MAF, MAP, oxygen, or boost sensor data out of range'],
      tr: ['Kirli hava filtresi veya emiş kısıtlaması', 'Vakum kaçağı veya gevşek hortum', 'Zayıf bobin, buji veya enjektör', 'Düşük yakıt basıncı', 'MAF, MAP, oksijen veya turbo basınç sensörü verisinin normal dışı olması'],
      de: ['Verschmutzter Luftfilter oder Ansaugproblem', 'Falschluft oder loser Schlauch', 'Schwache Spule, Kerze oder Einspritzdüse', 'Niedriger Kraftstoffdruck', 'MAF-, MAP-, Lambda- oder Ladedruckdaten außerhalb des Bereichs'],
      es: ['Filtro de aire sucio o admisión restringida', 'Fuga de vacío o manguera floja', 'Bobina, bujía o inyector débil', 'Baja presión de combustible', 'Datos MAF, MAP, oxígeno o turbo fuera de rango'],
      fr: ['Filtre à air sale ou admission limitée', 'Fuite de dépression ou durite desserrée', 'Bobine, bougie ou injecteur faible', 'Pression carburant basse', 'Données MAF, MAP, oxygène ou turbo hors plage'],
    },
    checks: {
      en: ['Check air filter and intake hoses', 'Scan stored and pending fault codes', 'Compare fuel trim, MAF/MAP, and oxygen sensor live data', 'Inspect plugs, coils, and injector connectors', 'Confirm fuel pressure before replacing parts'],
      tr: ['Hava filtresi ve emiş hortumlarını kontrol ettir', 'Kayıtlı ve bekleyen arıza kodlarını okut', 'Yakıt trim, MAF/MAP ve oksijen sensörü canlı verisini karşılaştır', 'Buji, bobin ve enjektör soketlerini incelet', 'Parça değişmeden önce yakıt basıncını doğrulat'],
      de: ['Luftfilter und Ansaugschläuche prüfen', 'Gespeicherte und ausstehende Codes auslesen', 'Fuel Trim, MAF/MAP und Lambdawerte vergleichen', 'Kerzen, Spulen und Injektorstecker prüfen', 'Kraftstoffdruck vor Teiletausch bestätigen'],
      es: ['Revisar filtro de aire y mangueras de admisión', 'Leer códigos guardados y pendientes', 'Comparar fuel trim, MAF/MAP y datos de oxígeno', 'Revisar bujías, bobinas y conectores de inyectores', 'Confirmar presión de combustible antes de cambiar piezas'],
      fr: ['Contrôler filtre à air et durites d’admission', 'Lire les codes enregistrés et en attente', 'Comparer fuel trim, MAF/MAP et données oxygène', 'Inspecter bougies, bobines et connecteurs injecteurs', 'Confirmer la pression carburant avant remplacement'],
    },
  },
  warning_light: {
    explanation: {
      en: 'A warning light means a control module detected a condition that needs checks. The light alone is a direction, not a final diagnosis.',
      tr: 'Uyarı lambası, bir kontrol ünitesinin kontrol gerektiren durum algıladığını gösterir. Tek başına kesin teşhis değildir.',
      de: 'Eine Warnleuchte zeigt, dass ein Steuergerät einen prüfpflichtigen Zustand erkannt hat. Sie ist Hinweis, keine Diagnose.',
      es: 'Un testigo indica que un módulo detectó algo que debe revisarse. La luz orienta, no diagnostica por sí sola.',
      fr: 'Un voyant indique qu’un calculateur a détecté un problème à vérifier. C’est une piste, pas un diagnostic final.',
    },
    causes: {
      en: ['Stored module code', 'Low fluid or voltage', 'Sensor signal out of range', 'Wiring or connector issue', 'Mechanical fault detected by the module'],
      tr: ['Kayıtlı kontrol ünitesi arıza kodu', 'Düşük sıvı seviyesi veya voltaj', 'Sensör sinyalinin normal dışı olması', 'Kablo veya soket sorunu', 'Ünitenin algıladığı mekanik arıza'],
      de: ['Gespeicherter Steuergerätecode', 'Niedriger Flüssigkeitsstand oder Spannung', 'Sensorsignal außerhalb des Bereichs', 'Kabel- oder Steckproblem', 'Vom Steuergerät erkannter mechanischer Fehler'],
      es: ['Código guardado en el módulo', 'Nivel de fluido o voltaje bajo', 'Señal de sensor fuera de rango', 'Problema de cableado o conector', 'Falla mecánica detectada por el módulo'],
      fr: ['Code enregistré dans le module', 'Niveau de fluide ou tension bas', 'Signal capteur hors plage', 'Problème de faisceau ou connecteur', 'Défaut mécanique détecté par le module'],
    },
    checks: {
      en: ['Do not clear codes before recording them', 'Check fluid levels and battery voltage', 'Scan the correct module, not only engine ECU', 'Inspect related fuses and connectors', 'Road-test only if the warning is not safety-critical'],
      tr: ['Kodları kaydetmeden silme', 'Sıvı seviyeleri ve akü voltajını kontrol et', 'Sadece motor değil ilgili kontrol ünitesini de okut', 'İlgili sigorta ve soketleri incele', 'Güvenlik kritik değilse kısa test sürüşü yap'],
      de: ['Codes vor dem Löschen dokumentieren', 'Flüssigkeitsstände und Batteriespannung prüfen', 'Richtiges Steuergerät auslesen, nicht nur Motor-ECU', 'Sicherungen und Stecker prüfen', 'Probefahrt nur wenn nicht sicherheitskritisch'],
      es: ['No borrar códigos antes de guardarlos', 'Revisar fluidos y voltaje de batería', 'Escanear el módulo correcto, no solo ECU motor', 'Revisar fusibles y conectores', 'Probar en carretera solo si no es crítico'],
      fr: ['Ne pas effacer les codes avant de les noter', 'Contrôler niveaux et tension batterie', 'Lire le bon module, pas seulement moteur', 'Inspecter fusibles et connecteurs', 'Essai routier seulement si non critique'],
    },
  },
  smoke_smell: {
    explanation: {
      en: 'Smoke or strong smell can point to fuel, oil, coolant, exhaust, or overheating problems. Treat it as a safety issue first.',
      tr: 'Duman veya yoğun koku yakıt, yağ, soğutma suyu, egzoz veya hararet sorununa işaret edebilir. Önce güvenlik olarak değerlendirin.',
      de: 'Rauch oder starker Geruch kann Kraftstoff, Öl, Kühlmittel, Abgas oder Überhitzung betreffen. Zuerst als Sicherheitsrisiko behandeln.',
      es: 'Humo u olor fuerte puede venir de combustible, aceite, refrigerante, escape o sobrecalentamiento. Primero trátalo como seguridad.',
      fr: 'Fumée ou odeur forte peut venir du carburant, huile, liquide de refroidissement, échappement ou surchauffe. Priorité sécurité.',
    },
    causes: {
      en: ['Coolant entering combustion chamber', 'Oil burning or leaking onto hot parts', 'Rich fuel mixture or injector leak', 'Exhaust leak', 'Overheating or fluid leak'],
      tr: ['Soğutma suyunun yanma odasına girmesi', 'Yağ yakma veya sıcak parçaya yağ sızıntısı', 'Zengin karışım veya enjektör kaçağı', 'Egzoz kaçağı', 'Hararet veya sıvı kaçağı'],
      de: ['Kühlmittel im Brennraum', 'Ölverbrennung oder Öl auf heißen Teilen', 'Zu fettes Gemisch oder Injektorleck', 'Abgasleck', 'Überhitzung oder Flüssigkeitsleck'],
      es: ['Refrigerante entrando a combustión', 'Aceite quemándose o cayendo en piezas calientes', 'Mezcla rica o inyector con fuga', 'Fuga de escape', 'Sobrecalentamiento o fuga de fluido'],
      fr: ['Liquide de refroidissement dans la combustion', 'Huile brûlée ou fuite sur pièces chaudes', 'Mélange riche ou injecteur fuyard', 'Fuite d’échappement', 'Surchauffe ou fuite de fluide'],
    },
    checks: {
      en: ['Stop if smoke is heavy or smell is fuel-like', 'Check coolant and oil levels when cold', 'Look for visible leaks under the car', 'Scan fuel trim and misfire codes', 'Pressure-test cooling system if white smoke persists'],
      tr: ['Duman yoğunsa veya yakıt kokusu varsa dur', 'Motor soğukken yağ ve su seviyesini kontrol et', 'Aracın altında görünür kaçak ara', 'Yakıt trim ve tekleme kodlarını okut', 'Beyaz duman sürerse soğutma sistemine basınç testi yaptır'],
      de: ['Bei starkem Rauch oder Kraftstoffgeruch anhalten', 'Kühlmittel und Öl kalt prüfen', 'Sichtbare Lecks unter dem Auto suchen', 'Fuel Trim und Misfire-Codes auslesen', 'Kühlsystem bei weißem Rauch abdrücken'],
      es: ['Detenerse si el humo es fuerte o huele a combustible', 'Revisar aceite y refrigerante en frío', 'Buscar fugas visibles debajo del coche', 'Leer fuel trim y códigos de misfire', 'Probar presión de refrigeración si sigue el humo blanco'],
      fr: ['S’arrêter si fumée forte ou odeur carburant', 'Contrôler huile et liquide à froid', 'Chercher des fuites sous le véhicule', 'Lire fuel trim et codes ratés', 'Tester pression du circuit si fumée blanche persiste'],
    },
  },
  transmission: {
    explanation: {
      en: 'Shift problems can come from fluid level, clutch packs, solenoids, sensors, mounts, linkage, or software adaptation.',
      tr: 'Vites sorunları yağ seviyesi, kavrama grubu, solenoid, sensör, takoz, bağlantı mekanizması veya yazılım adaptasyonundan kaynaklanabilir.',
      de: 'Schaltprobleme können von Ölstand, Kupplungspaketen, Magnetventilen, Sensoren, Lagern, Gestänge oder Adaptionswerten kommen.',
      es: 'Los problemas de cambio pueden venir de fluido, embragues, solenoides, sensores, soportes, varillaje o adaptación.',
      fr: 'Les soucis de passage peuvent venir du fluide, embrayages, solénoïdes, capteurs, supports, tringlerie ou adaptation.',
    },
    causes: {
      en: ['Low or aged transmission fluid', 'Solenoid or valve body issue', 'Clutch wear', 'Gear selector or linkage fault', 'Transmission control code'],
      tr: ['Düşük veya eskimiş şanzıman yağı', 'Solenoid veya valf gövdesi sorunu', 'Kavrama aşınması', 'Vites seçici veya bağlantı arızası', 'Şanzıman kontrol ünitesi arıza kodu'],
      de: ['Niedriger oder alter Getriebeölstand', 'Magnetventil oder Ventilkörperproblem', 'Kupplungsverschleiß', 'Wählhebel- oder Gestängefehler', 'Getriebesteuergerätecode'],
      es: ['Fluido de transmisión bajo o viejo', 'Solenoide o cuerpo de válvulas', 'Desgaste de embragues', 'Selector o varillaje', 'Código del módulo de transmisión'],
      fr: ['Huile de boîte basse ou usée', 'Solénoïde ou bloc hydraulique', 'Usure embrayage', 'Sélecteur ou tringlerie', 'Code calculateur de boîte'],
    },
    checks: {
      en: ['Check fluid level using the correct procedure', 'Scan transmission module codes', 'Inspect leaks and mounts', 'Do not flush a failing high-mileage unit blindly', 'Verify adaptation or software updates when applicable'],
      tr: ['Yağ seviyesini doğru prosedürle kontrol ettir', 'Şanzıman kontrol ünitesini okut', 'Kaçak ve takozları incelet', 'Arızalı yüksek kilometreli kutuya körlemesine flush yaptırma', 'Varsa adaptasyon veya yazılım güncellemesini kontrol ettir'],
      de: ['Ölstand nach korrektem Verfahren prüfen', 'Getriebemodul auslesen', 'Lecks und Lager prüfen', 'Kein blindes Spülen bei beschädigtem Hochlaufgetriebe', 'Adaptation oder Softwarestand prüfen'],
      es: ['Revisar nivel con el procedimiento correcto', 'Escanear módulo de transmisión', 'Revisar fugas y soportes', 'No hacer flush a ciegas en una caja dañada', 'Verificar adaptación o software si aplica'],
      fr: ['Contrôler le niveau selon procédure', 'Lire le module boîte', 'Inspecter fuites et supports', 'Ne pas vidanger sous pression à l’aveugle une boîte usée', 'Vérifier adaptation ou logiciel si besoin'],
    },
  },
  chassis_brake: {
    explanation: {
      en: 'Brake, steering, vibration, and suspension symptoms are safety-related and should be checked before they become control problems.',
      tr: 'Fren, direksiyon, titreşim ve süspansiyon belirtileri güvenlikle ilgilidir; kontrol kaybına dönüşmeden incelenmelidir.',
      de: 'Brems-, Lenk-, Vibrations- und Fahrwerksprobleme sind sicherheitsrelevant und sollten früh geprüft werden.',
      es: 'Frenos, dirección, vibraciones y suspensión afectan la seguridad y deben revisarse antes de perder control.',
      fr: 'Freins, direction, vibrations et suspension touchent à la sécurité et doivent être contrôlés tôt.',
    },
    causes: {
      en: ['Worn pads, discs, or shoes', 'ABS sensor or wheel bearing signal issue', 'Unbalanced or damaged tire', 'Loose suspension or steering joint', 'Hydraulic leak or air in brake system'],
      tr: ['Aşınmış balata, disk veya kampana', 'ABS sensörü veya porya sinyali sorunu', 'Balansı bozuk veya hasarlı lastik', 'Gevşek süspansiyon veya direksiyon mafsalı', 'Hidrolik kaçak veya fren sisteminde hava'],
      de: ['Verschlissene Beläge, Scheiben oder Trommeln', 'ABS-Sensor oder Radlagersignal', 'Unwuchtiger oder beschädigter Reifen', 'Lose Fahrwerks- oder Lenkverbindung', 'Hydraulikleck oder Luft im Bremssystem'],
      es: ['Pastillas, discos o zapatas gastadas', 'Sensor ABS o señal de rodamiento', 'Neumático dañado o desbalanceado', 'Articulación de suspensión o dirección floja', 'Fuga hidráulica o aire en frenos'],
      fr: ['Plaquettes, disques ou tambours usés', 'Capteur ABS ou signal roulement', 'Pneu abîmé ou déséquilibré', 'Rotule de suspension ou direction lâche', 'Fuite hydraulique ou air dans les freins'],
    },
    checks: {
      en: ['Avoid driving if braking distance changed', 'Inspect tires, wheels, and visible brake parts', 'Scan ABS module when warning light is on', 'Check brake fluid level and leaks', 'Lift the car to inspect joints and wheel bearings'],
      tr: ['Fren mesafesi değiştiyse aracı kullanma', 'Lastik, jant ve görünen fren parçalarını kontrol et', 'ABS lambası yanıyorsa ABS modülünü okut', 'Fren hidroliği seviyesi ve kaçakları kontrol et', 'Mafsal ve poryaları lifte alıp incelet'],
      de: ['Bei verändertem Bremsweg nicht fahren', 'Reifen, Räder und sichtbare Bremsteile prüfen', 'ABS-Modul bei Warnleuchte auslesen', 'Bremsflüssigkeit und Lecks prüfen', 'Gelenke und Radlager auf der Bühne prüfen'],
      es: ['No conducir si cambió la distancia de frenado', 'Revisar neumáticos, ruedas y frenos visibles', 'Escanear ABS si hay testigo', 'Revisar líquido y fugas de freno', 'Elevar el coche para revisar juntas y rodamientos'],
      fr: ['Ne pas rouler si la distance de freinage change', 'Contrôler pneus, roues et freins visibles', 'Lire ABS si voyant allumé', 'Contrôler liquide et fuites de frein', 'Lever le véhicule pour rotules et roulements'],
    },
  },
  electrical: {
    explanation: {
      en: 'Electrical symptoms usually come from battery voltage, charging, grounds, fuses, modules, wiring, or a weak actuator.',
      tr: 'Elektrik belirtileri genelde akü voltajı, şarj sistemi, şase bağlantısı, sigorta, modül, kablo veya zayıf aktüatörden kaynaklanır.',
      de: 'Elektrische Symptome kommen meist von Batterie, Ladung, Masse, Sicherung, Modul, Kabel oder schwachem Aktuator.',
      es: 'Los síntomas eléctricos suelen venir de batería, carga, masa, fusibles, módulos, cableado o actuadores débiles.',
      fr: 'Les symptômes électriques viennent souvent de batterie, charge, masse, fusibles, modules, faisceau ou actionneur faible.',
    },
    causes: {
      en: ['Weak battery or alternator', 'Bad ground or corroded terminal', 'Blown fuse or relay issue', 'Water ingress into connector or module', 'Failing switch, motor, or actuator'],
      tr: ['Zayıf akü veya alternatör', 'Kötü şase veya oksitli kutup başı', 'Atmış sigorta veya röle sorunu', 'Soket veya modüle su girmesi', 'Arızalı düğme, motor veya aktüatör'],
      de: ['Schwache Batterie oder Lichtmaschine', 'Schlechte Masse oder korrodierte Klemme', 'Defekte Sicherung oder Relais', 'Wassereintritt in Stecker oder Modul', 'Defekter Schalter, Motor oder Aktuator'],
      es: ['Batería o alternador débil', 'Mala masa o borne corroído', 'Fusible o relé defectuoso', 'Agua en conector o módulo', 'Interruptor, motor o actuador fallando'],
      fr: ['Batterie ou alternateur faible', 'Mauvaise masse ou cosse oxydée', 'Fusible ou relais défectueux', 'Eau dans connecteur ou module', 'Interrupteur, moteur ou actionneur faible'],
    },
    checks: {
      en: ['Measure battery voltage before and during cranking', 'Check charging voltage at idle', 'Inspect main grounds and terminals', 'Check fuses with a tester, not only visually', 'Scan body and gateway modules when needed'],
      tr: ['Marş öncesi ve marş sırasında akü voltajını ölç', 'Rölantide şarj voltajını kontrol et', 'Ana şase bağlantıları ve kutup başlarını incele', 'Sigortaları sadece gözle değil test cihazıyla kontrol et', 'Gerektiğinde gövde ve gateway modüllerini okut'],
      de: ['Batteriespannung vor und während Start messen', 'Ladespannung im Leerlauf prüfen', 'Massepunkte und Klemmen prüfen', 'Sicherungen mit Tester prüfen', 'Bei Bedarf Karosserie- und Gatewaymodule auslesen'],
      es: ['Medir voltaje antes y durante arranque', 'Revisar voltaje de carga al ralentí', 'Inspeccionar masas y bornes', 'Probar fusibles con tester', 'Escanear módulos de carrocería y gateway si hace falta'],
      fr: ['Mesurer tension avant et pendant démarrage', 'Contrôler tension de charge au ralenti', 'Inspecter masses et cosses', 'Tester fusibles avec testeur', 'Lire modules carrosserie et gateway si besoin'],
    },
  },
};

type RawIntent = [
  string,
  keyof typeof categoryCopy,
  Severity,
  CostLevel,
  string,
  string,
  string,
  string,
  string,
  string[],
];

const rawIntents: RawIntent[] = [
  ['loss_of_power', 'engine_performance', 'moderate', 'medium', 'Car losing power', 'Araba gaz yemiyor', 'Auto hat keine Leistung', 'El coche no acelera', 'La voiture manque de puissance', ['P0299', 'P0101', 'P0171', 'P0420']],
  ['engine_shaking', 'engine_performance', 'moderate', 'medium', 'Engine shaking', 'Motor titriyor', 'Motor ruckelt', 'El motor vibra', 'Le moteur tremble', ['P0300', 'P0301', 'P0302']],
  ['misfire_jerking', 'engine_performance', 'moderate', 'medium', 'Car jerks while driving', 'Araba tekliyor', 'Auto ruckelt beim Fahren', 'El coche da tirones', 'La voiture donne des à-coups', ['P0300', 'P0303', 'P0351']],
  ['rough_idle', 'engine_performance', 'moderate', 'low', 'Rough idle', 'Rölanti dalgalanıyor', 'Unruhiger Leerlauf', 'Ralentí inestable', 'Ralenti instable', ['P0507', 'P0171', 'P0300']],
  ['hard_start', 'engine_performance', 'moderate', 'medium', 'Car hard to start', 'Araba geç çalışıyor', 'Auto springt schwer an', 'El coche tarda en arrancar', 'La voiture démarre difficilement', ['P0335', 'P0340', 'P0171']],
  ['no_start', 'engine_performance', 'high', 'medium', 'Car will not start', 'Araba çalışmıyor', 'Auto startet nicht', 'El coche no arranca', 'La voiture ne démarre pas', ['P0335', 'P0562', 'P0230']],
  ['stalling', 'engine_performance', 'high', 'medium', 'Engine stalls', 'Motor stop ediyor', 'Motor geht aus', 'El motor se apaga', 'Le moteur cale', ['P0335', 'P0102', 'P0171']],
  ['poor_fuel_economy', 'engine_performance', 'low', 'medium', 'Car uses too much fuel', 'Araba çok yakıyor', 'Auto verbraucht zu viel', 'El coche consume mucho', 'La voiture consomme trop', ['P0172', 'P0133', 'P0420']],
  ['hesitation_acceleration', 'engine_performance', 'moderate', 'medium', 'Hesitation on acceleration', 'Gaza basınca boğuluyor', 'Ruckeln beim Beschleunigen', 'Falla al acelerar', 'Trou à l’accélération', ['P0101', 'P0171', 'P0300']],
  ['limp_mode', 'engine_performance', 'high', 'medium', 'Car in limp mode', 'Araç korumaya aldı', 'Notlauf aktiv', 'Modo emergencia', 'Mode dégradé', ['P0299', 'P0700', 'P2101']],
  ['turbo_lag', 'engine_performance', 'moderate', 'medium', 'Turbo lag or no boost', 'Turbo geç doluyor', 'Turbo baut spät Druck auf', 'Turbo tarda en cargar', 'Turbo tarde à charger', ['P0299', 'P0234', 'P0235']],
  ['engine_knock', 'engine_performance', 'high', 'high', 'Engine knocking', 'Motordan vuruntu geliyor', 'Motor klopft', 'Golpeteo de motor', 'Cliquetis moteur', ['P0325', 'P0300']],
  ['engine_noise', 'engine_performance', 'moderate', 'medium', 'Noise from engine', 'Motordan ses geliyor', 'Geräusch vom Motor', 'Ruido del motor', 'Bruit moteur', ['P0011', 'P0016', 'P0300']],
  ['overheating', 'smoke_smell', 'critical', 'high', 'Car overheating', 'Araba hararet yaptı', 'Auto überhitzt', 'El coche se calienta', 'La voiture surchauffe', ['P0117', 'P0128', 'P0217']],
  ['engine_surging', 'engine_performance', 'moderate', 'medium', 'Engine revs go up and down', 'Devir kendi kendine yükselip düşüyor', 'Drehzahl schwankt', 'Las revoluciones suben y bajan', 'Le régime monte et descend', ['P0507', 'P0101', 'P0171']],
  ['check_engine_on', 'warning_light', 'moderate', 'unknown', 'Check engine light on', 'Motor arıza lambası yandı', 'Motorkontrollleuchte leuchtet', 'Luz check engine encendida', 'Voyant moteur allumé', ['P0420', 'P0171', 'P0300']],
  ['check_engine_flashing', 'warning_light', 'critical', 'high', 'Check engine light flashing', 'Motor arıza lambası yanıp sönüyor', 'Motorkontrollleuchte blinkt', 'Check engine parpadea', 'Voyant moteur clignote', ['P0300', 'P0301', 'P0302']],
  ['oil_pressure_light', 'warning_light', 'critical', 'high', 'Oil pressure light on', 'Yağ lambası yanıyor', 'Öldruckleuchte an', 'Luz de presión de aceite', 'Voyant pression huile', ['P0520', 'P0521']],
  ['battery_light', 'electrical', 'high', 'medium', 'Battery light on', 'Akü lambası yanıyor', 'Batterieleuchte an', 'Luz de batería encendida', 'Voyant batterie allumé', ['P0562', 'P0620']],
  ['abs_light', 'chassis_brake', 'moderate', 'medium', 'ABS light on', 'ABS ışığı yandı', 'ABS-Leuchte an', 'Luz ABS encendida', 'Voyant ABS allumé', ['C0035', 'C0040']],
  ['brake_warning', 'chassis_brake', 'critical', 'medium', 'Brake warning light', 'Fren uyarı lambası yanıyor', 'Bremswarnleuchte', 'Luz de freno encendida', 'Voyant frein allumé', ['C0040', 'C0110']],
  ['airbag_light', 'warning_light', 'high', 'medium', 'Airbag light on', 'Airbag lambası yanıyor', 'Airbag-Leuchte an', 'Luz airbag encendida', 'Voyant airbag allumé', ['B0012', 'B0020']],
  ['tpms_light', 'warning_light', 'low', 'low', 'Tire pressure light on', 'Lastik basınç lambası yanıyor', 'Reifendruckleuchte an', 'Luz presión neumáticos', 'Voyant pression pneus', ['C0750', 'C0755']],
  ['coolant_warning', 'smoke_smell', 'high', 'medium', 'Coolant warning light', 'Soğutma suyu uyarısı', 'Kühlmittelwarnung', 'Aviso de refrigerante', 'Alerte liquide refroidissement', ['P0117', 'P0128']],
  ['dpf_warning', 'engine_performance', 'moderate', 'medium', 'DPF warning light', 'DPF lambası yanıyor', 'DPF-Warnleuchte', 'Luz DPF encendida', 'Voyant FAP allumé', ['P2002', 'P2458']],
  ['glow_plug_light', 'engine_performance', 'moderate', 'medium', 'Glow plug light flashing', 'Kızdırma lambası yanıp sönüyor', 'Glühwendel blinkt', 'Luz calentadores parpadea', 'Voyant préchauffage clignote', ['P0380', 'P0670']],
  ['white_smoke', 'smoke_smell', 'high', 'high', 'White smoke from exhaust', 'Egzozdan beyaz duman geliyor', 'Weißer Rauch aus Auspuff', 'Humo blanco del escape', 'Fumée blanche échappement', ['P0300', 'P0117']],
  ['black_smoke', 'smoke_smell', 'moderate', 'medium', 'Black smoke from exhaust', 'Egzozdan siyah duman geliyor', 'Schwarzer Rauch aus Auspuff', 'Humo negro del escape', 'Fumée noire échappement', ['P0172', 'P0101']],
  ['blue_smoke', 'smoke_smell', 'high', 'high', 'Blue smoke from exhaust', 'Egzozdan mavi duman geliyor', 'Blauer Rauch aus Auspuff', 'Humo azul del escape', 'Fumée bleue échappement', ['P0420', 'P0300']],
  ['fuel_smell', 'smoke_smell', 'critical', 'high', 'Fuel smell in car', 'Arabada benzin kokusu var', 'Benzingeruch im Auto', 'Olor a gasolina', 'Odeur d’essence', ['P0442', 'P0455']],
  ['oil_smell', 'smoke_smell', 'high', 'medium', 'Burning oil smell', 'Yanık yağ kokusu geliyor', 'Verbrannter Ölgeruch', 'Olor a aceite quemado', 'Odeur d’huile brûlée', ['P0520', 'P0300']],
  ['exhaust_smell', 'smoke_smell', 'high', 'medium', 'Exhaust smell in cabin', 'İçeri egzoz kokusu geliyor', 'Abgasgeruch im Innenraum', 'Olor a escape en cabina', 'Odeur échappement habitacle', ['P0420', 'P0430']],
  ['coolant_smell', 'smoke_smell', 'high', 'medium', 'Sweet coolant smell', 'Tatlı antifriz kokusu geliyor', 'Süßer Kühlmittelgeruch', 'Olor dulce a refrigerante', 'Odeur sucrée de liquide', ['P0117', 'P0128']],
  ['transmission_slipping', 'transmission', 'high', 'high', 'Transmission slipping', 'Şanzıman kaçırıyor', 'Getriebe rutscht', 'La transmisión patina', 'Boîte de vitesses patine', ['P0700', 'P0730']],
  ['hard_shift', 'transmission', 'moderate', 'medium', 'Hard gear shifts', 'Vites sert geçiyor', 'Harte Schaltvorgänge', 'Cambios bruscos', 'Passages de vitesses durs', ['P0700', 'P0750']],
  ['no_shift', 'transmission', 'high', 'high', 'Gear will not engage', 'Vites geçmiyor', 'Gang geht nicht rein', 'No entra la marcha', 'La vitesse ne passe pas', ['P0700', 'P0755']],
  ['delayed_engagement', 'transmission', 'moderate', 'medium', 'Delay when selecting drive', 'Vitese alınca geç kavrıyor', 'Verzögerung beim Einlegen', 'Retardo al poner D', 'Retard au passage en D', ['P0700', 'P0730']],
  ['clutch_slipping', 'transmission', 'moderate', 'medium', 'Clutch slipping', 'Debriyaj kaçırıyor', 'Kupplung rutscht', 'Embrague patina', 'Embrayage patine', ['P0805', 'P0900']],
  ['transmission_noise', 'transmission', 'moderate', 'medium', 'Noise from gearbox', 'Şanzımandan ses geliyor', 'Geräusch vom Getriebe', 'Ruido de caja de cambios', 'Bruit de boîte de vitesses', ['P0700']],
  ['brake_noise', 'chassis_brake', 'moderate', 'medium', 'Brake noise', 'Frenden ses geliyor', 'Bremsgeräusch', 'Ruido de frenos', 'Bruit de frein', ['C0040']],
  ['steering_vibration', 'chassis_brake', 'moderate', 'medium', 'Steering wheel vibration', 'Direksiyon titriyor', 'Lenkrad vibriert', 'Volante vibra', 'Volant vibre', ['C0035']],
  ['pulling_side', 'chassis_brake', 'moderate', 'medium', 'Car pulls to one side', 'Araba sağa sola çekiyor', 'Auto zieht zur Seite', 'El coche se va a un lado', 'La voiture tire d’un côté', ['C0040']],
  ['suspension_noise', 'chassis_brake', 'moderate', 'medium', 'Suspension knocking noise', 'Ön takımdan ses geliyor', 'Klopfen am Fahrwerk', 'Ruido en suspensión', 'Bruit de suspension', ['C0035']],
  ['wheel_noise', 'chassis_brake', 'moderate', 'medium', 'Wheel bearing noise', 'Tekerden uğultu geliyor', 'Radlagergeräusch', 'Ruido de rodamiento', 'Bruit de roulement', ['C0035']],
  ['soft_brake_pedal', 'chassis_brake', 'critical', 'medium', 'Brake pedal soft', 'Fren pedalı yumuşak', 'Bremspedal weich', 'Pedal de freno blando', 'Pédale de frein molle', ['C0110']],
  ['no_crank', 'electrical', 'high', 'medium', 'Car does not crank', 'Marş basmıyor', 'Anlasser dreht nicht', 'No gira el motor de arranque', 'Le démarreur ne tourne pas', ['P0562', 'P0615']],
  ['battery_drain', 'electrical', 'moderate', 'medium', 'Battery drains overnight', 'Akü bitiyor', 'Batterie entlädt sich', 'La batería se descarga', 'La batterie se vide', ['P0562']],
  ['alternator_fault', 'electrical', 'high', 'medium', 'Alternator not charging', 'Alternatör şarj etmiyor', 'Lichtmaschine lädt nicht', 'Alternador no carga', 'Alternateur ne charge pas', ['P0620', 'P0562']],
  ['fan_running', 'electrical', 'moderate', 'medium', 'Cooling fan keeps running', 'Fan sürekli çalışıyor', 'Lüfter läuft ständig', 'Ventilador no se apaga', 'Ventilateur tourne toujours', ['P0480', 'P0117']],
  ['ac_not_cold', 'electrical', 'low', 'medium', 'AC not cold', 'Klima soğutmuyor', 'Klimaanlage kühlt nicht', 'Aire acondicionado no enfría', 'Climatisation ne refroidit pas', ['B10AE']],
  ['window_not_working', 'electrical', 'low', 'low', 'Power window not working', 'Cam otomatiği çalışmıyor', 'Fensterheber geht nicht', 'Elevalunas no funciona', 'Lève-vitre ne fonctionne pas', ['B1020']],
  ['central_lock_fault', 'electrical', 'low', 'low', 'Central locking not working', 'Merkezi kilit çalışmıyor', 'Zentralverriegelung geht nicht', 'Cierre centralizado falla', 'Verrouillage centralisé en panne', ['B1000']],
  ['dashboard_flicker', 'electrical', 'moderate', 'medium', 'Dashboard lights flicker', 'Gösterge ışıkları titriyor', 'Armaturen flackern', 'Luces del tablero parpadean', 'Tableau de bord clignote', ['P0562']],
  ['diesel_no_power', 'engine_performance', 'moderate', 'medium', 'Diesel car has no power', 'Dizel araç çekmiyor', 'Diesel hat keine Leistung', 'Diésel sin fuerza', 'Diesel sans puissance', ['P0299', 'P2002']],
  ['dpf_clogged', 'engine_performance', 'moderate', 'medium', 'DPF clogged symptoms', 'DPF tıkalı belirtileri', 'DPF verstopft Symptome', 'Síntomas DPF obstruido', 'Symptômes FAP bouché', ['P2002', 'P2458']],
  ['egr_fault', 'engine_performance', 'moderate', 'medium', 'EGR valve problem', 'EGR arızası', 'AGR Ventil Problem', 'Problema válvula EGR', 'Problème vanne EGR', ['P0401', 'P0402']],
  ['adblue_warning', 'warning_light', 'moderate', 'medium', 'AdBlue warning', 'AdBlue uyarısı', 'AdBlue Warnung', 'Aviso AdBlue', 'Alerte AdBlue', ['P20EE', 'P204F']],
  ['turbo_whistle', 'engine_performance', 'moderate', 'medium', 'Turbo whistle noise', 'Turbodan ıslık sesi geliyor', 'Turbo pfeift', 'Silbido de turbo', 'Sifflement turbo', ['P0299', 'P0234']],
  ['lpg_problem', 'engine_performance', 'moderate', 'medium', 'LPG car misfires', 'LPG’de araba tekliyor', 'Autogas Auto ruckelt', 'Coche GLP da tirones', 'Voiture GPL donne des à-coups', ['P0300', 'P0171']],
  ['hybrid_warning', 'warning_light', 'high', 'high', 'Hybrid system warning', 'Hibrit sistem uyarısı', 'Hybrid System Warnung', 'Aviso sistema híbrido', 'Alerte système hybride', ['P0A80', 'P3000']],
  ['ev_not_charging', 'electrical', 'high', 'medium', 'Electric car not charging', 'Elektrikli araç şarj olmuyor', 'E-Auto lädt nicht', 'Coche eléctrico no carga', 'Voiture électrique ne charge pas', ['P0D26']],
  ['ev_range_drop', 'electrical', 'moderate', 'medium', 'Electric car range dropped', 'Elektrikli araç menzili düştü', 'E-Auto Reichweite gesunken', 'Bajó la autonomía eléctrica', 'Autonomie électrique en baisse', ['P0A80']],
  ['regen_brake_issue', 'chassis_brake', 'moderate', 'medium', 'Regenerative braking problem', 'Rejeneratif fren sorunu', 'Rekuperation Problem', 'Freno regenerativo falla', 'Freinage régénératif problème', ['P0A92']],
  ['coolant_leak', 'smoke_smell', 'high', 'medium', 'Coolant leak', 'Su eksiltiyor', 'Kühlmittelverlust', 'Pierde refrigerante', 'Perte de liquide refroidissement', ['P0117', 'P0128']],
  ['oil_leak', 'smoke_smell', 'moderate', 'medium', 'Oil leak', 'Yağ kaçırıyor', 'Ölleck', 'Fuga de aceite', 'Fuite d’huile', ['P0520']],
  ['fuel_leak', 'smoke_smell', 'critical', 'high', 'Fuel leak', 'Yakıt kaçağı var', 'Kraftstoffleck', 'Fuga de combustible', 'Fuite de carburant', ['P0442', 'P0455']],
  ['low_coolant', 'smoke_smell', 'high', 'medium', 'Coolant level low', 'Soğutma suyu azalıyor', 'Kühlmittelstand niedrig', 'Nivel refrigerante bajo', 'Niveau liquide bas', ['P0117']],
  ['low_oil_level', 'warning_light', 'high', 'medium', 'Oil level low', 'Yağ seviyesi düşük', 'Ölstand niedrig', 'Nivel de aceite bajo', 'Niveau huile bas', ['P0520']],
  ['engine_running_hot', 'smoke_smell', 'high', 'medium', 'Engine running hot', 'Motor çok ısınıyor', 'Motor wird heiß', 'Motor se calienta mucho', 'Moteur chauffe trop', ['P0217', 'P0117']],
  ['vibration_idle_only', 'engine_performance', 'moderate', 'medium', 'Vibration only at idle', 'Sadece rölantide titriyor', 'Vibration nur im Leerlauf', 'Vibra solo al ralentí', 'Vibration seulement au ralenti', ['P0300', 'P0507']],
  ['vibration_speed', 'chassis_brake', 'moderate', 'medium', 'Vibration at speed', 'Hızlanınca titriyor', 'Vibration bei Geschwindigkeit', 'Vibra a velocidad', 'Vibration à vitesse', ['C0035']],
  ['noise_cold_start', 'engine_performance', 'moderate', 'medium', 'Noise on cold start', 'Soğukta ilk çalışmada ses', 'Geräusch beim Kaltstart', 'Ruido al arrancar en frío', 'Bruit au démarrage à froid', ['P0011', 'P0016']],
  ['smell_after_refuel', 'smoke_smell', 'high', 'medium', 'Fuel smell after refueling', 'Depo doldurunca benzin kokusu', 'Benzingeruch nach Tanken', 'Olor tras repostar', 'Odeur après plein', ['P0442', 'P0455']],
  ['engine_cutting_out', 'engine_performance', 'high', 'medium', 'Engine cuts out while driving', 'Giderken motor kesiyor', 'Motor setzt während Fahrt aus', 'Motor se corta andando', 'Moteur coupe en roulant', ['P0335', 'P0101']],
  ['not_revving', 'engine_performance', 'moderate', 'medium', 'Engine will not rev', 'Motor devir almıyor', 'Motor dreht nicht hoch', 'Motor no sube de vueltas', 'Moteur ne prend pas les tours', ['P0120', 'P2101']],
  ['idle_too_high', 'engine_performance', 'moderate', 'low', 'Idle too high', 'Rölanti yüksek', 'Leerlauf zu hoch', 'Ralentí alto', 'Ralenti trop haut', ['P0507']],
  ['idle_too_low', 'engine_performance', 'moderate', 'low', 'Idle too low', 'Rölanti düşük', 'Leerlauf zu niedrig', 'Ralentí bajo', 'Ralenti trop bas', ['P0506']],
  ['engine_backfire', 'engine_performance', 'high', 'medium', 'Engine backfires', 'Egzoz patlatıyor', 'Fehlzündung im Auspuff', 'Explosiones en escape', 'Retour de flamme', ['P0300', 'P0171']],
  ['fuel_gauge_wrong', 'electrical', 'low', 'medium', 'Fuel gauge wrong', 'Yakıt göstergesi yanlış', 'Tankanzeige falsch', 'Medidor combustible falla', 'Jauge carburant fausse', ['P0460', 'P0463']],
  ['speedometer_not_working', 'electrical', 'moderate', 'medium', 'Speedometer not working', 'Hız göstergesi çalışmıyor', 'Tacho funktioniert nicht', 'Velocímetro no funciona', 'Compteur vitesse ne marche pas', ['P0500']],
];

const slugOverrides: Partial<Record<string, Partial<LocalizedString>>> = {
  loss_of_power: { tr: 'gaz-yemiyor', en: 'loss-of-power', de: 'keine-leistung', es: 'no-acelera', fr: 'manque-de-puissance' },
  engine_shaking: { tr: 'araba-titriyor', en: 'car-shaking', de: 'auto-ruckelt', es: 'coche-vibra', fr: 'voiture-tremble' },
  poor_fuel_economy: { tr: 'cok-yakiyor', en: 'poor-fuel-economy', de: 'hoher-verbrauch', es: 'consume-mucho', fr: 'consomme-trop' },
  white_smoke: { tr: 'beyaz-duman', en: 'white-smoke', de: 'weisser-rauch', es: 'humo-blanco', fr: 'fumee-blanche' },
  no_shift: { tr: 'vites-gecmiyor', en: 'gear-will-not-engage', de: 'gang-geht-nicht-rein', es: 'no-entra-marcha', fr: 'vitesse-ne-passe-pas' },
};

const vehicleTerms = [
  'acura', 'audi', 'bmw', 'chevrolet', 'citroen', 'clio', 'corolla', 'fiat', 'focus', 'ford', 'honda', 'hyundai',
  'kia', 'mazda', 'mercedes', 'nissan', 'opel', 'peugeot', 'renault', 'seat', 'skoda', 'suzuki', 'toyota', 'volkswagen',
  'vw', 'volvo', 'megane', 'civic', 'golf', 'passat', 'camry', 'fiesta', 'astra', 'e34', '520i',
];

const trCharMap: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  Ç: 'c',
  Ğ: 'g',
  İ: 'i',
  Ö: 'o',
  Ş: 's',
  Ü: 'u',
};

function slugify(value: string) {
  return value
    .split('')
    .map((char) => trCharMap[char] ?? char)
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeProblemQuery(value: string) {
  return value
    .split('')
    .map((char) => trCharMap[char] ?? char)
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createPhrases(labels: LocalizedString, intentKey: string): Record<ProblemFinderLocale, string[]> {
  const extra = (generatedSynonyms as Record<string, Partial<Record<ProblemFinderLocale, string[]>>>)[intentKey] ?? {};
  return Object.fromEntries(PROBLEM_FINDER_LOCALES.map((locale) => {
    const label = labels[locale];
    const normalized = slugify(label).replace(/-/g, ' ');
    const common = [
      label,
      normalized,
      `my car ${labels.en}`,
      `car ${labels.en}`,
      `aracim ${labels.tr}`,
      `arabam ${labels.tr}`,
      `${labels.tr} neden olur`,
      `${labels.en} causes`,
    ];
    return [locale, [...new Set([...common, ...(extra[locale] ?? [])])]];
  })) as Record<ProblemFinderLocale, string[]>;
}

function createLinks(intentKey: string, labels: LocalizedString, codes: string[]) {
  return Object.fromEntries(PROBLEM_FINDER_LOCALES.map((locale) => {
    const base = getProblemFinderBasePath(locale);
    const slug = slugify(labels[locale]);
    return [locale, [
      { label: hubLabels[locale], href: `/${locale}/${base}` },
      { label: locale === 'tr' ? 'Belirti rehberleri' : 'Symptom guides', href: `/${locale}/symptoms` },
      { label: codes[0] ? `${codes[0]} OBD2` : 'OBD2 codes', href: `/${locale}/codes` },
      { label: labels[locale], href: `/${locale}/${base}/${slug}` },
    ]];
  })) as ProblemFinderIntent['internalLinks'];
}

function makeIntent(raw: RawIntent): ProblemFinderIntent {
  const [intentKey, category, severity, costLevel, en, tr, de, es, fr, relatedCodes] = raw;
  const labels = { en, tr, de, es, fr };
  const copy = categoryCopy[category];
  const slugs = Object.fromEntries(PROBLEM_FINDER_LOCALES.map((locale) => [locale, slugify(labels[locale])])) as LocalizedString;
  Object.assign(slugs, slugOverrides[intentKey]);
  const titles = Object.fromEntries(PROBLEM_FINDER_LOCALES.map((locale) => {
    const suffix: LocalizedString = {
      en: 'Causes, First Checks and OBD2 Codes',
      tr: 'Nedenleri, İlk Kontroller ve OBD2 Kodları',
      de: 'Ursachen, erste Prüfungen und OBD2-Codes',
      es: 'Causas, primeras revisiones y códigos OBD2',
      fr: 'Causes, premiers contrôles et codes OBD2',
    };
    return [locale, `${labels[locale]}: ${suffix[locale]}`];
  })) as LocalizedString;
  return {
    intentKey,
    category,
    severity,
    costLevel,
    slugs,
    titles,
    searchPhrases: createPhrases(labels, intentKey),
    plainExplanation: copy.explanation,
    likelyCauses: copy.causes,
    firstChecks: copy.checks,
    doNotReplaceYet: doNotReplaceLabels,
    safeToDrive: driveAdvice[severity],
    relatedCodes,
    relatedSymptoms: rawIntents
      .filter((other) => other[0] !== intentKey && other[1] === category)
      .slice(0, 4)
      .map((other) => other[0]),
    internalLinks: createLinks(intentKey, labels, relatedCodes),
  };
}

export const publishedProblemFinderIntents = rawIntents.map(makeIntent);

export function isProblemFinderLocale(locale: string): locale is ProblemFinderLocale {
  return (PROBLEM_FINDER_LOCALES as readonly string[]).includes(locale);
}

export function getProblemFinderBasePath(locale: string) {
  return isProblemFinderLocale(locale) ? problemFinderBasePaths[locale] : problemFinderBasePaths.en;
}

export function getProblemFinderHubPath(locale: string) {
  const normalizedLocale = isProblemFinderLocale(locale) ? locale : 'en';
  return `/${normalizedLocale}/${problemFinderBasePaths[normalizedLocale]}`;
}

export function getProblemFinderDetailPath(locale: string, intent: ProblemFinderIntent) {
  const normalizedLocale = isProblemFinderLocale(locale) ? locale : 'en';
  return `/${normalizedLocale}/${problemFinderBasePaths[normalizedLocale]}/${intent.slugs[normalizedLocale]}`;
}

export function getProblemFinderIntentBySlug(locale: string, slug: string) {
  const normalizedLocale = isProblemFinderLocale(locale) ? locale : 'en';
  return publishedProblemFinderIntents.find((intent) => intent.slugs[normalizedLocale] === slug);
}

export function getProblemFinderAlternates(intent?: ProblemFinderIntent) {
  return {
    languages: {
      ...Object.fromEntries(PROBLEM_FINDER_LOCALES.map((locale) => [
        locale,
        intent ? getProblemFinderDetailPath(locale, intent) : getProblemFinderHubPath(locale),
      ])),
      'x-default': intent ? getProblemFinderDetailPath('en', intent) : getProblemFinderHubPath('en'),
    },
  };
}

export function resolveLocalizedProblemFinderPath(pathname: string, targetLocale: string) {
  if (!isProblemFinderLocale(targetLocale)) return null;
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const [, base, slug] = parts;
  const sourceLocale = PROBLEM_FINDER_LOCALES.find((locale) => problemFinderBasePaths[locale] === base);
  if (!sourceLocale) return null;
  if (!slug) return getProblemFinderHubPath(targetLocale);
  const intent = getProblemFinderIntentBySlug(sourceLocale, slug);
  return intent ? getProblemFinderDetailPath(targetLocale, intent) : getProblemFinderHubPath(targetLocale);
}

export function detectProblemVehicle(query: string) {
  const normalized = normalizeProblemQuery(query);
  return vehicleTerms.filter((term) => normalized.includes(term)).slice(0, 3);
}

function phraseScore(query: string, phrase: string) {
  const normalizedPhrase = normalizeProblemQuery(phrase);
  if (!normalizedPhrase) return 0;
  if (query === normalizedPhrase) return 100;
  if (query.includes(normalizedPhrase) || normalizedPhrase.includes(query)) return 82;
  const queryTokens = new Set(query.split(' ').filter((token) => token.length > 2));
  const phraseTokens = normalizedPhrase.split(' ').filter((token) => token.length > 2);
  if (!phraseTokens.length) return 0;
  const matched = phraseTokens.filter((token) => queryTokens.has(token)).length;
  return Math.round((matched / phraseTokens.length) * 70);
}

export function matchProblemQuery(query: string, locale: string) {
  const normalizedLocale = isProblemFinderLocale(locale) ? locale : 'en';
  const normalized = normalizeProblemQuery(query);
  const vehicleTermsFound = detectProblemVehicle(query);
  const scored = publishedProblemFinderIntents
    .map((intent) => {
      const phrases = [
        ...intent.searchPhrases[normalizedLocale],
        ...intent.searchPhrases.tr,
        ...intent.searchPhrases.en,
      ];
      const score = Math.max(...phrases.map((phrase) => phraseScore(normalized, phrase)), 0);
      return { intent, score: Math.min(100, score + (vehicleTermsFound.length ? 4 : 0)) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    query,
    normalizedQuery: normalized,
    locale: normalizedLocale,
    vehicleTerms: vehicleTermsFound,
    found: (scored[0]?.score ?? 0) >= 45,
    best: scored[0] ?? null,
    matches: scored,
  };
}

export function getProblemFinderLocaleName(locale: ProblemFinderLocale) {
  return localeNames[locale];
}

export function getProblemFinderHubLabel(locale: string) {
  const normalizedLocale = isProblemFinderLocale(locale) ? locale : 'en';
  return hubLabels[normalizedLocale];
}
