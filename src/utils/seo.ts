export function getAlternates(pathWithoutLocale: string, currentLocale: string) {
  // Ensure the path starts with a slash if it's not empty
  const cleanPath = pathWithoutLocale ? (pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`) : '';
  
  return {
    canonical: `/${currentLocale}${cleanPath}`,
    languages: {
      'en': `/en${cleanPath}`,
      'de': `/de${cleanPath}`,
      'es': `/es${cleanPath}`,
      'tr': `/tr${cleanPath}`,
      'fr': `/fr${cleanPath}`,
    }
  };
}
