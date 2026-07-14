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
  };
}
