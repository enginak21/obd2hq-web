import { SUPPORTED_LOCALES } from '@/data/seo';

export function getAlternates(pathWithoutLocale: string, currentLocale: string) {
  // Ensure the path starts with a slash if it's not empty
  const cleanPath = pathWithoutLocale ? (pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`) : '';
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [locale, `/${locale}${cleanPath}`])
  );
  
  return {
    canonical: `/${currentLocale}${cleanPath}`,
    languages
  };
}
