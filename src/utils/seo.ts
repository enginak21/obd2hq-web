import { SUPPORTED_LOCALES } from '@/data/seo';

export function getAlternates(pathWithoutLocale: string, currentLocale: string) {
  // Ensure the path starts with a slash if it's not empty
  const cleanPath = pathWithoutLocale ? (pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`) : '';
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [locale, `/${locale}${cleanPath}`])
  );
  languages['x-default'] = `/en${cleanPath}`;
  
  return {
    canonical: `/${currentLocale}${cleanPath}`,
    languages
  };
}

export function fitSeoTitle(value: string, maxLength = 52) {
  return fitSeoText(value, maxLength);
}

export function fitSeoDescription(value: string, maxLength = 135) {
  return fitSeoText(value, maxLength);
}

function fitSeoText(value: string, maxLength: number) {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const sliced = clean.slice(0, maxLength - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 42 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}
