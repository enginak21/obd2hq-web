import generatedRoutes from './generated/symptom-content/routes.json';

const locales = ['en', 'tr', 'de', 'es', 'fr'] as const;
type Locale = typeof locales[number];

export const symptomContentBasePaths: Record<Locale, string> = {
  en: 'car-symptoms',
  tr: 'ariza-belirtileri',
  de: 'auto-symptome',
  es: 'sintomas-coche',
  fr: 'symptomes-voiture',
};

type RouteGroup = {
  contentGroupId: string;
  slugs: Record<Locale, string>;
};

const routeGroups = generatedRoutes as RouteGroup[];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function resolveLocalizedSymptomPath(pathname: string, targetLocale: string) {
  if (!isLocale(targetLocale)) return null;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  const currentLocale = segments[0];
  if (!isLocale(currentLocale)) return null;
  const currentBase = segments[1];
  const currentSlug = segments[2];

  if (currentBase !== symptomContentBasePaths[currentLocale]) return null;
  if (!currentSlug) return `/${targetLocale}/${symptomContentBasePaths[targetLocale]}`;

  const group = routeGroups.find(item => item.slugs[currentLocale] === currentSlug);
  if (!group) return `/${targetLocale}/${symptomContentBasePaths[targetLocale]}`;
  return `/${targetLocale}/${symptomContentBasePaths[targetLocale]}/${group.slugs[targetLocale]}`;
}

export function getSymptomContentHubPath(locale: string) {
  const safeLocale = isLocale(locale) ? locale : 'en';
  return `/${safeLocale}/${symptomContentBasePaths[safeLocale]}`;
}
