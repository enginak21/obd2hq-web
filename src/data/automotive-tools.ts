import { LocalizedText } from './symptoms';

export interface AutomotiveTool {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  category: 'diagnosis' | 'calculator' | 'maintenance' | 'buyer';
  primaryUse: string;
  relatedQueries: string[];
}

export const automotiveTools: AutomotiveTool[] = [
  {
    slug: 'diagnostic-assistant',
    title: {
      en: 'AI-Style Diagnostic Assistant',
      tr: 'Akıllı Arıza Teşhis Asistanı',
      de: 'Intelligenter Diagnose-Assistent',
      es: 'Asistente inteligente de diagnóstico',
      fr: 'Assistant intelligent de diagnostic',
    },
    description: {
      en: 'Combine vehicle, symptoms, fault codes and risk signals into a practical inspection order before replacing parts.',
      tr: 'Araç, belirti, arıza kodu ve risk sinyallerini birleştirerek parça değiştirmeden önce pratik kontrol sırası oluşturur.',
      de: 'Kombiniert Fahrzeug, Symptome, Fehlercodes und Risiken zu einer sinnvollen Prüfreihenfolge.',
      es: 'Combina vehículo, síntomas, códigos y riesgos para crear un orden de inspección práctico.',
      fr: 'Combine véhicule, symptômes, codes et risques pour proposer un ordre de contrôle pratique.',
    },
    category: 'diagnosis',
    primaryUse: 'Find the most likely system and safest next checks.',
    relatedQueries: ['car diagnostic assistant', 'check engine diagnosis', 'obd2 diagnostic tool'],
  },
  {
    slug: 'repair-cost-calculator',
    title: {
      en: 'Repair Cost Calculator',
      tr: 'Onarım Maliyeti Hesaplayıcı',
      de: 'Reparaturkosten-Rechner',
      es: 'Calculadora de costo de reparación',
      fr: 'Calculateur de coût de réparation',
    },
    description: {
      en: 'Estimate cheap, typical and expensive repair paths for common OBD2 faults with parts and labor context.',
      tr: 'Yaygın OBD2 arızaları için ucuz, tipik ve pahalı onarım yollarını parça ve işçilik bağlamıyla tahmin eder.',
      de: 'Schätzt günstige, typische und teure Reparaturpfade für OBD2-Fehler.',
      es: 'Estima rutas de reparación barata, típica y cara para fallas OBD2.',
      fr: 'Estime les réparations économiques, typiques et coûteuses pour les défauts OBD2.',
    },
    category: 'calculator',
    primaryUse: 'Understand cost risk before authorizing a repair.',
    relatedQueries: ['p0420 repair cost', 'check engine repair cost', 'obd2 repair estimate'],
  },
  {
    slug: 'fuel-trim-analyzer',
    title: {
      en: 'Fuel Trim Analyzer',
      tr: 'Yakıt Trim Analiz Aracı',
      de: 'Fuel-Trim-Analyse',
      es: 'Analizador de fuel trim',
      fr: 'Analyseur de correction carburant',
    },
    description: {
      en: 'Interpret STFT and LTFT patterns to separate vacuum leaks, MAF issues, fuel pressure problems and rich conditions.',
      tr: 'STFT ve LTFT düzenini yorumlayarak vakum kaçağı, MAF, yakıt basıncı ve zengin karışımı ayırır.',
      de: 'Deutet STFT/LTFT-Muster für Luftleck, MAF, Kraftstoffdruck und fettes Gemisch.',
      es: 'Interpreta STFT/LTFT para separar fuga de vacío, MAF, presión de combustible y mezcla rica.',
      fr: 'Interprète STFT/LTFT pour distinguer fuite d’air, MAF, pression carburant et mélange riche.',
    },
    category: 'diagnosis',
    primaryUse: 'Turn live data into a likely test direction.',
    relatedQueries: ['fuel trim analyzer', 'STFT LTFT meaning', 'positive fuel trim causes'],
  },
  {
    slug: 'freeze-frame-interpreter',
    title: {
      en: 'Freeze Frame Interpreter',
      tr: 'Freeze Frame Yorumlayıcı',
      de: 'Freeze-Frame-Auswertung',
      es: 'Intérprete de freeze frame',
      fr: 'Interpréteur freeze frame',
    },
    description: {
      en: 'Use RPM, load, coolant temperature and speed to understand when a fault happened and which test should come first.',
      tr: 'RPM, yük, su sıcaklığı ve hızı kullanarak arızanın hangi koşulda oluştuğunu ve ilk testi belirler.',
      de: 'Nutzt Drehzahl, Last, Temperatur und Geschwindigkeit, um den Fehlerkontext zu verstehen.',
      es: 'Usa RPM, carga, temperatura y velocidad para entender cuándo ocurrió la falla.',
      fr: 'Utilise régime, charge, température et vitesse pour comprendre le contexte du défaut.',
    },
    category: 'diagnosis',
    primaryUse: 'Avoid guessing by reading the conditions behind the code.',
    relatedQueries: ['freeze frame data meaning', 'how to read freeze frame', 'obd2 freeze frame'],
  },
  {
    slug: 'scanner-finder',
    title: {
      en: 'OBD2 Scanner Finder',
      tr: 'OBD2 Cihaz Seçici',
      de: 'OBD2-Scanner-Finder',
      es: 'Buscador de escáner OBD2',
      fr: 'Sélecteur de scanner OBD2',
    },
    description: {
      en: 'Choose the right scanner class for engine codes, ABS/SRS, live data, DIY repairs or workshop diagnostics.',
      tr: 'Motor kodu, ABS/SRS, canlı veri, DIY onarım veya servis teşhisi için doğru cihaz sınıfını seçtirir.',
      de: 'Findet die passende Scanner-Klasse für Motorcodes, ABS/SRS, Live-Daten oder Werkstattdiagnose.',
      es: 'Elige el tipo correcto de escáner para motor, ABS/SRS, datos en vivo o taller.',
      fr: 'Choisit la bonne catégorie de scanner pour moteur, ABS/SRS, données live ou atelier.',
    },
    category: 'buyer',
    primaryUse: 'Match tool capability to the job before buying.',
    relatedQueries: ['best obd2 scanner', 'bluetooth obd2 scanner', 'scanner for abs srs'],
  },
];

export function getToolBySlug(slug: string) {
  return automotiveTools.find(tool => tool.slug === slug) || null;
}

export function localizeTool(tool: AutomotiveTool, locale: string) {
  const key = (['en', 'tr', 'de', 'es', 'fr'].includes(locale) ? locale : 'en') as keyof LocalizedText;
  return {
    title: tool.title[key],
    description: tool.description[key],
    primaryUse: translateToolItem(tool.primaryUse, key),
    relatedQueries: tool.relatedQueries.map(item => translateToolItem(item, key)),
  };
}

const toolItemTranslations: Record<string, Partial<LocalizedText>> = {
  'Find the most likely system and safest next checks.': {
    tr: 'En olası sistemi ve en güvenli sonraki kontrolleri bulun.',
    de: 'Finden Sie das wahrscheinlichste System und die sichersten nächsten Prüfungen.',
    es: 'Encuentra el sistema más probable y las revisiones más seguras.',
    fr: 'Trouvez le système le plus probable et les prochaines vérifications sûres.',
  },
  'Understand cost risk before authorizing a repair.': {
    tr: 'Onarıma onay vermeden önce maliyet riskini anlayın.',
    de: 'Verstehen Sie das Kostenrisiko vor der Reparaturfreigabe.',
    es: 'Entiende el riesgo de costo antes de autorizar una reparación.',
    fr: 'Comprenez le risque de coût avant d’autoriser une réparation.',
  },
  'Turn live data into a likely test direction.': {
    tr: 'Canlı veriyi olası test yönüne çevirin.',
    de: 'Live-Daten in eine wahrscheinliche Prüfrichtung übersetzen.',
    es: 'Convierte datos en vivo en una dirección de prueba probable.',
    fr: 'Transformez les données en direct en direction de test probable.',
  },
  'Avoid guessing by reading the conditions behind the code.': {
    tr: 'Kodun oluştuğu koşulları okuyarak tahminle ilerlemeyin.',
    de: 'Vermeiden Sie Raten, indem Sie die Bedingungen hinter dem Code lesen.',
    es: 'Evita adivinar leyendo las condiciones detrás del código.',
    fr: 'Évitez de deviner en lisant les conditions du code.',
  },
  'Match tool capability to the job before buying.': {
    tr: 'Satın almadan önce cihaz kabiliyetini işe göre eşleştirin.',
    de: 'Passen Sie die Gerätefähigkeit vor dem Kauf an die Aufgabe an.',
    es: 'Relaciona la capacidad del equipo con el trabajo antes de comprar.',
    fr: 'Adaptez les capacités de l’outil au travail avant l’achat.',
  },
  'car diagnostic assistant': { tr: 'araç teşhis asistanı', de: 'fahrzeug diagnoseassistent', es: 'asistente de diagnóstico del auto', fr: 'assistant diagnostic auto' },
  'check engine diagnosis': { tr: 'motor arıza lambası teşhisi', de: 'motorkontrollleuchte diagnose', es: 'diagnóstico check engine', fr: 'diagnostic voyant moteur' },
  'obd2 diagnostic tool': { tr: 'obd2 teşhis aracı', de: 'obd2 diagnosewerkzeug', es: 'herramienta de diagnóstico obd2', fr: 'outil diagnostic obd2' },
  'p0420 repair cost': { tr: 'p0420 onarım maliyeti', de: 'p0420 reparaturkosten', es: 'costo reparación p0420', fr: 'coût réparation p0420' },
  'check engine repair cost': { tr: 'motor arıza lambası onarım maliyeti', de: 'motorkontrollleuchte reparaturkosten', es: 'costo reparación check engine', fr: 'coût réparation voyant moteur' },
  'obd2 repair estimate': { tr: 'obd2 onarım tahmini', de: 'obd2 reparaturschätzung', es: 'estimación reparación obd2', fr: 'estimation réparation obd2' },
  'fuel trim analyzer': { tr: 'yakıt trim analiz aracı', de: 'fuel-trim-analyse', es: 'analizador fuel trim', fr: 'analyseur fuel trim' },
  'STFT LTFT meaning': { tr: 'STFT LTFT anlamı', de: 'STFT LTFT bedeutung', es: 'significado STFT LTFT', fr: 'signification STFT LTFT' },
  'positive fuel trim causes': { tr: 'pozitif yakıt trim nedenleri', de: 'positive fuel trim ursachen', es: 'causas fuel trim positivo', fr: 'causes fuel trim positif' },
  'freeze frame data meaning': { tr: 'freeze frame verisi anlamı', de: 'freeze-frame daten bedeutung', es: 'significado datos freeze frame', fr: 'signification données freeze frame' },
  'how to read freeze frame': { tr: 'freeze frame nasıl okunur', de: 'freeze-frame lesen', es: 'cómo leer freeze frame', fr: 'comment lire freeze frame' },
  'obd2 freeze frame': { tr: 'obd2 freeze frame', de: 'obd2 freeze-frame', es: 'obd2 freeze frame', fr: 'obd2 freeze frame' },
  'best obd2 scanner': { tr: 'en iyi obd2 cihazı', de: 'bester obd2 scanner', es: 'mejor escáner obd2', fr: 'meilleur scanner obd2' },
  'bluetooth obd2 scanner': { tr: 'bluetooth obd2 cihazı', de: 'bluetooth obd2 scanner', es: 'escáner obd2 bluetooth', fr: 'scanner obd2 bluetooth' },
  'scanner for abs srs': { tr: 'abs srs için arıza tespit cihazı', de: 'scanner für abs srs', es: 'escáner para abs srs', fr: 'scanner pour abs srs' },
};

function translateToolItem(item: string, locale: keyof LocalizedText) {
  return toolItemTranslations[item]?.[locale] || item;
}
