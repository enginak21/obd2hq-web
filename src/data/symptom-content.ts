import generatedSymptomContent from './generated/symptom-content/content.json';

export const SYMPTOM_CONTENT_LOCALES = ['en', 'tr', 'de', 'es', 'fr'] as const;
export type SymptomContentLocale = typeof SYMPTOM_CONTENT_LOCALES[number];
export type SymptomContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'rejected';

export type SymptomInternalLink = {
  label: string;
  href: string;
};

export type SymptomFaq = {
  q: string;
  a: string;
};

export type LocalizedSymptomContent = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  severity: string;
  driveAdvice: string;
  likelyCauses: string[];
  diagnosticSteps: string[];
  firstChecks: string[];
  commonMistakes: string[];
  relatedCodes: string[];
  internalLinks: SymptomInternalLink[];
  faq: SymptomFaq[];
  schemaTitle: string;
  schemaDescription: string;
};

export type SymptomContentGroup = {
  contentGroupId: string;
  intentKey: string;
  make: string;
  model: string | null;
  symptomKey: string;
  qualityScore: number;
  status: SymptomContentStatus;
  locales: Record<SymptomContentLocale, LocalizedSymptomContent>;
};

export const symptomContentBasePaths: Record<SymptomContentLocale, string> = {
  en: 'car-symptoms',
  tr: 'ariza-belirtileri',
  de: 'auto-symptome',
  es: 'sintomas-coche',
  fr: 'symptomes-voiture',
};

export const symptomContentGroups = generatedSymptomContent as SymptomContentGroup[];

export const publishedSymptomContentGroups = symptomContentGroups.filter(group => group.status === 'published' && hasAllLocales(group));

export function isSymptomContentLocale(locale: string): locale is SymptomContentLocale {
  return (SYMPTOM_CONTENT_LOCALES as readonly string[]).includes(locale);
}

export function getSymptomContentBasePath(locale: string) {
  return symptomContentBasePaths[isSymptomContentLocale(locale) ? locale : 'en'];
}

export function getSymptomContentHubPath(locale: string) {
  return `/${locale}/${getSymptomContentBasePath(locale)}`;
}

export function getSymptomContentDetailPath(group: SymptomContentGroup, locale: SymptomContentLocale) {
  return `/${locale}/${symptomContentBasePaths[locale]}/${group.locales[locale].slug}`;
}

export function getSymptomContentBySlug(locale: string, basePath: string, slug: string) {
  if (!isSymptomContentLocale(locale)) return null;
  if (basePath !== symptomContentBasePaths[locale]) return null;
  return publishedSymptomContentGroups.find(group => group.locales[locale].slug === slug) || null;
}

export function getSymptomContentAlternates(group: SymptomContentGroup, currentLocale: SymptomContentLocale) {
  const languages = Object.fromEntries(
    SYMPTOM_CONTENT_LOCALES.map(locale => [locale, getSymptomContentDetailPath(group, locale)])
  );
  languages['x-default'] = getSymptomContentDetailPath(group, 'en');

  return {
    canonical: getSymptomContentDetailPath(group, currentLocale),
    languages,
  };
}

export function getSymptomHubAlternates(currentLocale: SymptomContentLocale) {
  const languages = Object.fromEntries(
    SYMPTOM_CONTENT_LOCALES.map(locale => [locale, getSymptomContentHubPath(locale)])
  );
  languages['x-default'] = getSymptomContentHubPath('en');

  return {
    canonical: getSymptomContentHubPath(currentLocale),
    languages,
  };
}

export function resolveLocalizedSymptomPath(pathname: string, targetLocale: string) {
  if (!isSymptomContentLocale(targetLocale)) return null;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  const currentLocale = segments[0];
  if (!isSymptomContentLocale(currentLocale)) return null;
  const currentBase = segments[1];
  const currentSlug = segments[2];

  if (currentBase !== symptomContentBasePaths[currentLocale]) return null;
  if (!currentSlug) return getSymptomContentHubPath(targetLocale);

  const group = publishedSymptomContentGroups.find(item => item.locales[currentLocale].slug === currentSlug);
  if (!group) return getSymptomContentHubPath(targetLocale);
  return getSymptomContentDetailPath(group, targetLocale);
}

function hasAllLocales(group: SymptomContentGroup) {
  return SYMPTOM_CONTENT_LOCALES.every(locale => {
    const item = group.locales?.[locale];
    return item?.slug && item?.title && item?.metaDescription && item?.faq?.length >= 3;
  });
}
