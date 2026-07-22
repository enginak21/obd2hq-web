import { baseCodes, cars } from './db';
import gscOpportunities from './generated/gsc-opportunities.json';
import { SEO_LAST_REVIEWED, SUPPORTED_LOCALES, getCodeCategoryLabel, getCodeSystem } from './seo';

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type GscIntentType =
  | 'code_only'
  | 'make_code'
  | 'warning_light_model_year'
  | 'warning_light_make'
  | 'mixed_error'
  | 'unknown';

export type GscOpportunity = {
  query: string;
  targetUrl: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number | null;
  trend: number;
  intentType: GscIntentType;
  recommendedAction: string;
  status: 'tracked' | 'planned' | 'published' | 'needs_review';
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastChecked: string;
};

export const CODE_HUB_BASES: Record<SupportedLocale, string> = {
  en: 'codes',
  tr: 'kodlar',
  de: 'codes',
  es: 'codigos',
  fr: 'codes',
};

export const BRAND_WARNING_LIGHT_BASES: Record<SupportedLocale, string> = {
  en: 'warning-lights',
  tr: 'uyari-isiklari',
  de: 'warnleuchten',
  es: 'luces-tablero',
  fr: 'voyants-tableau-bord',
};

export const GSC_SEED_QUERIES = [
  'p0213',
  'p0292',
  'p0282',
  'p0211',
  'p0283',
  'p0257',
  'p0262',
  'p0188',
  'p0251 ford',
  'p0289',
  'p0276',
  'p0235 suzuki',
  'p0258',
  '2021 f 150 warning lights',
  'p0295',
  'p0184',
  'p0185',
  'cadillac vehicle warning lights',
  'cadillac warning lights',
  'toyota/lexus error p0122',
  'p0180',
  'p0207',
  '2026 f 150 warning lights',
  'p0285',
  'p0242',
  'p0265',
  'p0241',
  'p0215',
  'p0243 suzuki',
  'p0212',
];

export function getCodeHubPath(locale: string, code: string) {
  const safeLocale = isSupportedLocale(locale) ? locale : 'en';
  return `/${safeLocale}/${CODE_HUB_BASES[safeLocale]}/${code.toLowerCase()}`;
}

export function getBrandWarningLightsPath(locale: string, make: string) {
  const safeLocale = isSupportedLocale(locale) ? locale : 'en';
  return `/${safeLocale}/${make}/${BRAND_WARNING_LIGHT_BASES[safeLocale]}`;
}

export function getCodeHubAlternates(code: string, currentLocale: string) {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [locale, getCodeHubPath(locale, code)])
  );
  languages['x-default'] = getCodeHubPath('en', code);
  return {
    canonical: getCodeHubPath(currentLocale, code),
    languages,
  };
}

export function getBrandWarningLightsAlternates(make: string, currentLocale: string) {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [locale, getBrandWarningLightsPath(locale, make)])
  );
  languages['x-default'] = getBrandWarningLightsPath('en', make);
  return {
    canonical: getBrandWarningLightsPath(currentLocale, make),
    languages,
  };
}

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function isKnownCode(code: string) {
  return Boolean((baseCodes as Record<string, unknown>)[code.toUpperCase()]);
}

export function getOpportunityCodes(opportunities: GscOpportunity[]) {
  return Array.from(new Set(
    opportunities
      .flatMap(opportunity => extractCodes(opportunity.query))
      .filter(isKnownCode)
  ));
}

export function extractCodes(value: string) {
  return Array.from(value.toUpperCase().matchAll(/\b[PCBU]\s?([0-9A-F]{4})\b/g))
    .map(match => `${match[0][0]}${match[1]}`.toUpperCase());
}

export function extractMake(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  return cars.find(car => normalized.split(/\s+/).includes(car.make) || normalized.includes(car.make.replace(/-/g, ' ')))?.make || null;
}

export function classifyGscQuery(query: string): GscIntentType {
  const codeCount = extractCodes(query).length;
  const hasMake = Boolean(extractMake(query));
  const warningIntent = /warning\s+lights?|dashboard\s+lights?|dashboard\s+symbols?|dash\s+symbols?|instrument\s+symbols?|uyar[ıi]\s+[ıi]?[şs]ık|voyants?|warnleuchten|luces|simbolos/i.test(query);
  const hasYear = /\b(19|20)\d{2}\b/.test(query);

  if (warningIntent && hasYear) return 'warning_light_model_year';
  if (warningIntent && hasMake) return 'warning_light_make';
  if (codeCount > 0 && hasMake) return 'make_code';
  if (codeCount > 0 && /\/|error|dtc/i.test(query)) return 'mixed_error';
  if (codeCount > 0) return 'code_only';
  return 'unknown';
}

export function mapQueryToTargetUrl(query: string, locale = 'en') {
  const intentType = classifyGscQuery(query);
  const codes = extractCodes(query);
  const make = extractMake(query);

  if (intentType === 'warning_light_make' && make) {
    return getBrandWarningLightsPath(locale, make);
  }

  if (intentType === 'warning_light_model_year' && /f[\s-]?150/i.test(query)) {
    return `/${locale}/ford/f-150/lights`;
  }

  if (intentType === 'make_code' && make && codes[0]) {
    const preferredModels: Record<string, string> = {
      ford: 'focus',
      suzuki: 'jimny',
      toyota: 'camry',
      lexus: 'rx',
    };
    const model = preferredModels[make] || cars.find(car => car.make === make)?.models[0];
    return model ? `/${locale}/${make}/${model}/${codes[0].toLowerCase()}` : getCodeHubPath(locale, codes[0]);
  }

  if (codes[0]) return getCodeHubPath(locale, codes[0]);
  return `/${locale}/search`;
}

export function getRecommendedAction(query: string, intentType = classifyGscQuery(query)) {
  if (intentType === 'code_only') return 'Publish or strengthen generic code hub, then link to high-intent make/model pages.';
  if (intentType === 'make_code') return 'Strengthen make-specific code page with exact query heading, diagnostic depth, and internal links.';
  if (intentType === 'warning_light_model_year') return 'Strengthen model warning-light hub with year-specific copy and links to likely OBD codes.';
  if (intentType === 'warning_light_make') return 'Publish brand warning-light hub and link model warning-light pages into it.';
  if (intentType === 'mixed_error') return 'Create a clean canonical interpretation page or route query to the best code hub.';
  return 'Review query manually before publishing new indexable content.';
}

export function scoreOpportunity(input: { clicks: number; impressions: number; ctr: number; position: number | null; trend: number; intentType: GscIntentType }) {
  let score = input.impressions;
  if (input.clicks === 0 && input.impressions >= 25) score += 80;
  if (input.position !== null && input.position >= 8 && input.position <= 30) score += 60;
  if (input.trend > 0) score += Math.min(50, input.trend);
  if (input.intentType !== 'unknown') score += 25;

  if (score >= 140) return 'critical';
  if (score >= 90) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

const priorityRank: Record<GscOpportunity['priority'], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function normalizeTarget(value: string) {
  return value.replace(/\/$/, '');
}

export function getGscOpportunitiesForTargets(targetUrls: string[], limit = 6) {
  const targets = new Set(targetUrls.map(normalizeTarget));
  return (gscOpportunities as GscOpportunity[])
    .filter(row => targets.has(normalizeTarget(row.targetUrl)))
    .sort((a, b) => (
      priorityRank[a.priority] - priorityRank[b.priority] ||
      b.impressions - a.impressions ||
      (a.position ?? 999) - (b.position ?? 999)
    ))
    .slice(0, limit);
}

export function getGscOpportunityBlockCopy(locale: string) {
  if (locale === 'tr') {
    return {
      badge: 'Canlı Search Console fırsatı',
      title: 'Google’da bu aramalarla görünmeye başladı',
      text: 'Bu sayfa, gerçek Search Console gösterimlerine göre güçlendiriliyor. Amaç aynı niyeti karşılayan sorguları tek kaliteli rehberde toplamak ve ince kopya sayfa üretmemek.',
      impressions: 'gösterim',
      position: 'ortalama sıra',
    };
  }
  if (locale === 'de') {
    return {
      badge: 'Live Search Console Chance',
      title: 'Diese Suchanfragen zeigen bereits Impressionen',
      text: 'Diese Seite wird anhand echter Search-Console-Daten verstaerkt. Aehnliche Suchintentionen werden in einem starken Leitfaden gebuendelt, statt duenne Duplikate zu erzeugen.',
      impressions: 'Impressionen',
      position: 'Ø Position',
    };
  }
  if (locale === 'es') {
    return {
      badge: 'Oportunidad real de Search Console',
      title: 'Estas búsquedas ya generan impresiones',
      text: 'Esta página se refuerza con datos reales de Search Console. Las consultas con la misma intención se responden en una guía sólida, sin crear páginas duplicadas débiles.',
      impressions: 'impresiones',
      position: 'posición media',
    };
  }
  if (locale === 'fr') {
    return {
      badge: 'Opportunité Search Console réelle',
      title: 'Ces recherches génèrent déjà des impressions',
      text: 'Cette page est renforcée avec les données réelles de Search Console. Les requêtes proches sont regroupées dans un guide solide au lieu de créer des pages faibles.',
      impressions: 'impressions',
      position: 'position moyenne',
    };
  }
  return {
    badge: 'Live Search Console opportunity',
    title: 'Searches already showing this page',
    text: 'This page is being strengthened from real Search Console impressions. Similar search intents are answered in one strong guide instead of thin duplicate pages.',
    impressions: 'impressions',
    position: 'avg. position',
  };
}

export function getCodeHubCopy(locale: string, code: string) {
  const upperCode = code.toUpperCase();
  const category = getCodeCategoryLabel(upperCode);
  const system = getCodeSystem(upperCode);
  const copies = {
    en: {
      title: `${upperCode} OBD2 Code: Meaning, Symptoms, Causes and Fixes`,
      meta: `${upperCode} OBD2 code guide with symptoms, likely causes, diagnostic checks, repair cost level and related vehicle-specific pages.`,
      h1: `${upperCode} OBD2 Code Guide`,
      intro: `${upperCode} is a ${category.toLowerCase()} diagnostic trouble code. Use this hub to understand the plain meaning, the first checks to run, and which vehicle-specific guides may be more useful before replacing parts.`,
      firstChecks: ['Read all stored and pending codes before clearing anything.', 'Save freeze-frame data so you know speed, load and temperature when the code set.', 'Inspect wiring, connectors, fuses, hoses and obvious leaks tied to the named system.', 'Compare live data against realistic values before buying sensors or modules.', 'Clear the code only after repair and complete a drive cycle to confirm it does not return.'],
      warning: 'Do not treat the code name as a parts list. The correct repair depends on symptoms, related codes, live data and the exact vehicle.',
      faqQ: `Can I drive with ${upperCode}?`,
      faqA: `It depends on symptoms and severity. If the engine runs poorly, overheats, loses oil pressure, misfires badly or a warning light flashes, stop safely and diagnose before driving further.`,
      relatedTitle: 'Vehicle-specific pages to check next',
      system,
    },
    tr: {
      title: `${upperCode} OBD2 Arıza Kodu: Anlamı, Belirtileri ve Çözümü`,
      meta: `${upperCode} arıza kodu için belirtiler, olası nedenler, ilk kontroller, masraf seviyesi ve araca özel bağlantılar.`,
      h1: `${upperCode} OBD2 Arıza Kodu Rehberi`,
      intro: `${upperCode}, ${category.toLowerCase()} sistemiyle ilişkili bir OBD2 arıza kodudur. Bu sayfa kodun sade anlamını, önce yapılacak kontrolleri ve parça değiştirmeden önce bakılması gereken araca özel rehberleri gösterir.`,
      firstChecks: ['Hiçbir şeyi silmeden önce kayıtlı ve bekleyen tüm kodları okuyun.', 'Kodun hangi hız, yük ve sıcaklıkta oluştuğunu görmek için freeze-frame verisini kaydedin.', 'İlgili sistemde kablo, soket, sigorta, hortum ve kaçak kontrolü yapın.', 'Sensör veya modül almadan önce canlı veriyi gerçekçi değerlerle karşılaştırın.', 'Onarımdan sonra kodu silin ve arıza geri geliyor mu görmek için sürüş döngüsünü tamamlayın.'],
      warning: 'Kod açıklamasını doğrudan parça listesi gibi yorumlamayın. Doğru onarım belirtiye, ilişkili kodlara, canlı veriye ve aracın modeline göre değişir.',
      faqQ: `${upperCode} koduyla araç kullanılır mı?`,
      faqA: 'Belirti ve risk seviyesine bağlıdır. Motor kötü çalışıyorsa, hararet varsa, yağ basıncı düşükse, ciddi tekleme varsa veya uyarı lambası yanıp sönüyorsa güvenli şekilde durup teşhis yapılmalıdır.',
      relatedTitle: 'Sırada bakılacak araca özel sayfalar',
      system,
    },
    de: {
      title: `${upperCode} OBD2-Fehlercode: Bedeutung, Symptome und Reparatur`,
      meta: `${upperCode} OBD2-Fehlercode mit Symptomen, Ursachen, ersten Prüfungen, Kostenhinweisen und fahrzeugspezifischen Links.`,
      h1: `${upperCode} OBD2-Fehlercode-Ratgeber`,
      intro: `${upperCode} ist ein Diagnosecode aus dem Bereich ${category}. Diese Seite erklärt die Bedeutung, sinnvolle erste Prüfungen und passende fahrzeugspezifische Leitfäden.`,
      firstChecks: ['Alle gespeicherten und ausstehenden Codes auslesen.', 'Freeze-Frame-Daten sichern, bevor Fehler gelöscht werden.', 'Kabel, Stecker, Sicherungen, Schläuche und sichtbare Lecks prüfen.', 'Live-Daten mit plausiblen Werten vergleichen.', 'Nach der Reparatur Fahrzyklus abschließen und prüfen, ob der Code zurückkehrt.'],
      warning: 'Der Codename ist keine Teileliste. Die richtige Reparatur hängt von Symptomen, Zusatzcodes, Live-Daten und Fahrzeugmodell ab.',
      faqQ: `Kann man mit ${upperCode} weiterfahren?`,
      faqA: 'Das hängt von Symptomen und Schweregrad ab. Bei schlechtem Motorlauf, Überhitzung, Öldruckwarnung, starkem Fehlzünden oder blinkender Warnleuchte sicher anhalten.',
      relatedTitle: 'Fahrzeugspezifische Seiten',
      system,
    },
    es: {
      title: `${upperCode} código OBD2: significado, síntomas y solución`,
      meta: `Guía del código OBD2 ${upperCode} con síntomas, causas, primeras revisiones, nivel de costo y enlaces por vehículo.`,
      h1: `Guía del código OBD2 ${upperCode}`,
      intro: `${upperCode} es un código de diagnóstico relacionado con ${category}. Esta guía explica el significado, las primeras comprobaciones y las páginas específicas por vehículo.`,
      firstChecks: ['Lee todos los códigos almacenados y pendientes.', 'Guarda los datos freeze-frame antes de borrar fallas.', 'Revisa cableado, conectores, fusibles, mangueras y fugas visibles.', 'Compara datos en vivo con valores realistas.', 'Después de reparar, completa un ciclo de manejo y confirma que el código no vuelve.'],
      warning: 'No uses el nombre del código como lista de piezas. La reparación correcta depende de síntomas, códigos relacionados, datos en vivo y vehículo exacto.',
      faqQ: `¿Puedo conducir con ${upperCode}?`,
      faqA: 'Depende de los síntomas. Si el motor falla, se calienta, pierde presión de aceite, tiene misfire fuerte o la luz parpadea, detente con seguridad.',
      relatedTitle: 'Páginas específicas por vehículo',
      system,
    },
    fr: {
      title: `${upperCode} code OBD2 : signification, symptômes et réparation`,
      meta: `Guide du code OBD2 ${upperCode} avec symptômes, causes possibles, premiers contrôles, niveau de coût et liens par véhicule.`,
      h1: `Guide du code OBD2 ${upperCode}`,
      intro: `${upperCode} est un code de diagnostic lié au système ${category}. Cette page explique le sens du code, les premiers contrôles et les guides par véhicule.`,
      firstChecks: ['Lire tous les codes enregistrés et en attente.', 'Sauvegarder les données freeze-frame avant effacement.', 'Contrôler câblage, connecteurs, fusibles, durites et fuites visibles.', 'Comparer les données en direct avec des valeurs réalistes.', 'Après réparation, effectuer un cycle de conduite et vérifier que le code ne revient pas.'],
      warning: 'Le nom du code n’est pas une liste de pièces. La bonne réparation dépend des symptômes, des codes liés, des données en direct et du véhicule exact.',
      faqQ: `Peut-on conduire avec ${upperCode} ?`,
      faqA: 'Cela dépend des symptômes. Si le moteur fonctionne mal, chauffe, perd la pression d’huile, présente de forts ratés ou si le voyant clignote, arrêtez-vous en sécurité.',
      relatedTitle: 'Pages spécifiques par véhicule',
      system,
    },
  } as const;
  return copies[isSupportedLocale(locale) ? locale : 'en'];
}
export function getBrandWarningCopy(locale: string, make: string) {
  const displayMake = make.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  const copies = {
    en: {
      title: `${displayMake} Warning Lights: Meanings, Causes and First Checks`,
      meta: `${displayMake} dashboard warning lights explained by urgency, common causes, safe driving advice and related OBD2 codes.`,
      h1: `${displayMake} Warning Lights`,
      intro: `${displayMake} warning lights should be read by color, flashing behavior and driving symptoms. Start with the safety risk, then scan for codes before replacing parts.`,
      urgent: ['Red oil, brake or temperature warnings need immediate attention.', 'A flashing check engine light can mean active misfire and catalyst damage risk.', 'Amber warnings usually need diagnosis soon, not blind parts replacement.'],
    },
    tr: {
      title: `${displayMake} Uyarı Işıkları: Anlamları, Nedenleri ve İlk Kontroller`,
      meta: `${displayMake} gösterge uyarı ışıkları: aciliyet, olası nedenler, güvenli sürüş önerisi ve ilgili OBD2 kodları.`,
      h1: `${displayMake} Uyarı Işıkları`,
      intro: `${displayMake} uyarı ışıkları renk, yanıp sönme durumu ve sürüş belirtisine göre değerlendirilmelidir. Önce güvenlik riskini belirleyin, sonra parça değiştirmeden önce arıza kodlarını okuyun.`,
      urgent: ['Kırmızı yağ, fren veya hararet uyarıları hemen kontrol gerektirir.', 'Yanıp sönen motor arıza lambası aktif tekleme ve katalizör riski anlamına gelebilir.', 'Sarı uyarılar genelde kısa sürede teşhis ister; doğrudan parça değiştirmeyin.'],
    },
    de: {
      title: `${displayMake} Warnleuchten: Bedeutung, Ursachen und erste Prüfungen`,
      meta: `${displayMake} Warnleuchten erklärt nach Dringlichkeit, Ursachen, Fahrsicherheit und passenden OBD2-Codes.`,
      h1: `${displayMake} Warnleuchten`,
      intro: `${displayMake} Warnleuchten sollten nach Farbe, Blinkverhalten und Fahrsymptomen bewertet werden. Zuerst das Sicherheitsrisiko prüfen, dann Codes auslesen.`,
      urgent: ['Rote Öl-, Brems- oder Temperaturwarnungen brauchen sofortige Aufmerksamkeit.', 'Eine blinkende Motorkontrollleuchte kann aktive Fehlzündungen bedeuten.', 'Gelbe Warnungen sollten zeitnah diagnostiziert werden.'],
    },
    es: {
      title: `${displayMake} luces del tablero: significado, causas y revisiones`,
      meta: `Luces de advertencia ${displayMake} explicadas por urgencia, causas comunes, seguridad y códigos OBD2 relacionados.`,
      h1: `Luces del tablero ${displayMake}`,
      intro: `Las luces del tablero ${displayMake} deben evaluarse por color, parpadeo y síntomas. Primero revisa la seguridad y luego lee códigos antes de cambiar piezas.`,
      urgent: ['Las luces rojas de aceite, freno o temperatura requieren atención inmediata.', 'Un check engine intermitente puede indicar misfire activo.', 'Las luces amarillas suelen requerir diagnóstico pronto.'],
    },
    fr: {
      title: `${displayMake} voyants tableau de bord : signification et contrôles`,
      meta: `Voyants ${displayMake} expliqués par urgence, causes fréquentes, sécurité et codes OBD2 associés.`,
      h1: `Voyants tableau de bord ${displayMake}`,
      intro: `Les voyants ${displayMake} doivent être lus selon la couleur, le clignotement et les symptômes. Vérifiez d’abord le risque de sécurité, puis lisez les codes.`,
      urgent: ['Les voyants rouges huile, frein ou température demandent une attention immédiate.', 'Un voyant moteur clignotant peut indiquer des ratés actifs.', 'Les voyants jaunes nécessitent généralement un diagnostic rapide.'],
    },
  } as const;
  return copies[isSupportedLocale(locale) ? locale : 'en'];
}
export const GSC_SEO_LAST_REVIEWED = SEO_LAST_REVIEWED;


