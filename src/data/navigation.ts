import { getBrandWarningLightsPath, getCodeHubPath } from './gsc-seo';
import { getProblemFinderHubPath } from './problem-finder';
import { getSymptomContentHubPath } from './symptom-content-routing';

const locales = ['en', 'tr', 'de', 'es', 'fr'] as const;
type Locale = typeof locales[number];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function safeLocale(locale: string): Locale {
  return isLocale(locale) ? locale : 'en';
}

export function getWarningLightsHubPath(locale: string) {
  return `/${safeLocale(locale)}/warning-lights`;
}

export function getModelLightsPath(locale: string, make: string, model: string) {
  return `/${safeLocale(locale)}/${make}/${model}/lights`;
}

const labels: Record<Locale, {
  diagnose: string;
  vehicleData: string;
  ownership: string;
  popularCodes: string;
  problemFinder: string;
  symptoms: string;
  warningLights: string;
  tools: string;
  vehicles: string;
  oil: string;
  engines: string;
  transmissions: string;
  maintenance: string;
  commonProblems: string;
  resources: string;
  news: string;
  about: string;
  contact: string;
  editorial: string;
  privacy: string;
  terms: string;
  disclaimer: string;
}> = {
  en: {
    diagnose: 'Diagnose',
    vehicleData: 'Vehicle data',
    ownership: 'Site',
    popularCodes: 'Popular OBD2 codes',
    problemFinder: 'Car Problem Finder',
    symptoms: 'Symptoms',
    warningLights: 'Warning Lights',
    tools: 'Advanced Tools',
    vehicles: 'Vehicle Guide',
    oil: 'Oil Capacity',
    engines: 'Engine Codes',
    transmissions: 'Transmission Guide',
    maintenance: 'Maintenance',
    commonProblems: 'Common Problems',
    resources: 'Resources',
    news: 'News',
    about: 'About',
    contact: 'Contact',
    editorial: 'Editorial Policy',
    privacy: 'Privacy',
    terms: 'Terms',
    disclaimer: 'Disclaimer',
  },
  tr: {
    diagnose: 'Teşhis',
    vehicleData: 'Araç bilgileri',
    ownership: 'Site',
    popularCodes: 'Popüler OBD2 kodları',
    problemFinder: 'Arıza Bulucu',
    symptoms: 'Belirtiler',
    warningLights: 'Uyarı Işıkları',
    tools: 'Gelişmiş Araçlar',
    vehicles: 'Araç Rehberi',
    oil: 'Yağ Kapasitesi',
    engines: 'Motor Kodları',
    transmissions: 'Şanzıman Rehberi',
    maintenance: 'Bakım',
    commonProblems: 'Kronik Sorunlar',
    resources: 'Kaynaklar',
    news: 'Haberler',
    about: 'Hakkımızda',
    contact: 'İletişim',
    editorial: 'Yayın Politikası',
    privacy: 'Gizlilik',
    terms: 'Kullanım Şartları',
    disclaimer: 'Sorumluluk Reddi',
  },
  de: {
    diagnose: 'Diagnose',
    vehicleData: 'Fahrzeugdaten',
    ownership: 'Website',
    popularCodes: 'Beliebte OBD2-Codes',
    problemFinder: 'Auto Problemfinder',
    symptoms: 'Auto-Symptome',
    warningLights: 'Warnleuchten',
    tools: 'Diagnose-Tools',
    vehicles: 'Fahrzeugführer',
    oil: 'Ölkapazität',
    engines: 'Motorcodes',
    transmissions: 'Getriebe',
    maintenance: 'Wartung',
    commonProblems: 'Häufige Probleme',
    resources: 'Ressourcen',
    news: 'Nachrichten',
    about: 'Über uns',
    contact: 'Kontakt',
    editorial: 'Redaktionsrichtlinie',
    privacy: 'Datenschutz',
    terms: 'Nutzungsbedingungen',
    disclaimer: 'Haftungsausschluss',
  },
  es: {
    diagnose: 'Diagnóstico',
    vehicleData: 'Datos del vehículo',
    ownership: 'Sitio',
    popularCodes: 'Códigos OBD2 populares',
    problemFinder: 'Buscador de fallas',
    symptoms: 'Síntomas',
    warningLights: 'Luces del tablero',
    tools: 'Herramientas',
    vehicles: 'Guía de vehículos',
    oil: 'Capacidad de aceite',
    engines: 'Códigos de motor',
    transmissions: 'Transmisión',
    maintenance: 'Mantenimiento',
    commonProblems: 'Problemas comunes',
    resources: 'Recursos',
    news: 'Noticias',
    about: 'Acerca de',
    contact: 'Contacto',
    editorial: 'Política editorial',
    privacy: 'Privacidad',
    terms: 'Términos',
    disclaimer: 'Aviso legal',
  },
  fr: {
    diagnose: 'Diagnostic',
    vehicleData: 'Données véhicule',
    ownership: 'Site',
    popularCodes: 'Codes OBD2 populaires',
    problemFinder: 'Trouver une panne',
    symptoms: 'Symptômes',
    warningLights: 'Voyants tableau de bord',
    tools: 'Outils avancés',
    vehicles: 'Guide véhicules',
    oil: 'Capacité huile',
    engines: 'Codes moteur',
    transmissions: 'Transmission',
    maintenance: 'Entretien',
    commonProblems: 'Problèmes fréquents',
    resources: 'Ressources',
    news: 'Actualités',
    about: 'À propos',
    contact: 'Contact',
    editorial: 'Politique éditoriale',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    disclaimer: 'Avertissement',
  },
};

export function getNavigationLabels(locale: string) {
  return labels[safeLocale(locale)];
}

export function getFooterLinkGroups(locale: string) {
  const current = safeLocale(locale);
  const l = labels[current];
  return [
    {
      title: l.diagnose,
      links: [
        { label: l.problemFinder, href: getProblemFinderHubPath(current) },
        { label: l.symptoms, href: getSymptomContentHubPath(current) },
        { label: l.warningLights, href: getWarningLightsHubPath(current) },
        { label: l.tools, href: `/${current}/tools` },
      ],
    },
    {
      title: l.vehicleData,
      links: [
        { label: l.vehicles, href: `/${current}/vehicles` },
        { label: l.oil, href: `/${current}/oil-capacity` },
        { label: l.engines, href: `/${current}/engine-codes` },
        { label: l.transmissions, href: `/${current}/transmissions` },
        { label: l.maintenance, href: `/${current}/maintenance` },
        { label: l.commonProblems, href: `/${current}/common-problems` },
      ],
    },
    {
      title: l.popularCodes,
      links: ['P0420', 'P0300', 'P0171', 'P0455', 'P0213', 'P0235'].map((code) => ({
        label: code,
        href: getCodeHubPath(current, code),
      })),
    },
    {
      title: l.ownership,
      links: [
        { label: l.resources, href: `/${current}/resources` },
        { label: l.news, href: `/${current}/news` },
        { label: l.about, href: `/${current}/about` },
        { label: l.contact, href: `/${current}/contact` },
        { label: l.editorial, href: `/${current}/editorial-policy` },
        { label: l.privacy, href: `/${current}/privacy` },
        { label: l.terms, href: `/${current}/terms` },
        { label: l.disclaimer, href: `/${current}/disclaimer` },
      ],
    },
  ];
}

export function getPopularWarningLightLinks(locale: string) {
  const current = safeLocale(locale);
  return [
    { label: 'Toyota Camry', href: getModelLightsPath(current, 'toyota', 'camry') },
    { label: 'Ford F-150', href: getModelLightsPath(current, 'ford', 'f-150') },
    { label: 'Ford Focus', href: getModelLightsPath(current, 'ford', 'focus') },
    { label: 'Honda Civic', href: getModelLightsPath(current, 'honda', 'civic') },
    { label: 'Cadillac', href: getBrandWarningLightsPath(current, 'cadillac') },
    { label: 'BMW', href: getBrandWarningLightsPath(current, 'bmw') },
  ];
}
