import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import validRoutes from './data/valid_routes.json';
import newsRedirects from './data/news_redirects.json';

const locales = ['en', 'de', 'es', 'tr', 'fr'];
const symptomContentBasePaths: Record<string, string> = {
  en: 'car-symptoms',
  tr: 'ariza-belirtileri',
  de: 'auto-symptome',
  es: 'sintomas-coche',
  fr: 'symptomes-voiture',
};
const symptomContentBaseSet = new Set(Object.values(symptomContentBasePaths));
const problemFinderBasePaths: Record<string, string> = {
  en: 'car-problem-finder',
  tr: 'ariza-bulucu',
  de: 'auto-problemfinder',
  es: 'buscador-fallas',
  fr: 'trouver-panne',
};
const problemFinderBaseSet = new Set(Object.values(problemFinderBasePaths));
const codeHubBasePaths: Record<string, string> = {
  en: 'codes',
  tr: 'kodlar',
  de: 'codes',
  es: 'codigos',
  fr: 'codes',
};
const codeHubBaseSet = new Set(Object.values(codeHubBasePaths));
const brandWarningBasePaths: Record<string, string> = {
  en: 'warning-lights',
  tr: 'uyari-isiklari',
  de: 'warnleuchten',
  es: 'luces-tablero',
  fr: 'voyants-tableau-bord',
};
const brandWarningBaseSet = new Set(Object.values(brandWarningBasePaths));

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  alternateLinks: false
});

function notFoundResponse() {
  return new NextResponse('<!doctype html><html><head><meta name="robots" content="noindex" /></head><body><h1>404 Not Found</h1></body></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host');
  if (host === 'www.obd2hq.com') {
    const url = request.nextUrl.clone();
    url.host = 'obd2hq.com';
    return NextResponse.redirect(url, 308);
  }

  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/sitemaps/')
  ) {
    return;
  }


  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    const locale = segments[0];
    const make = segments[1];
    if (locales.includes(locale) && make === 'news' && segments.length === 3) {
      const redirectSlug = (newsRedirects as Record<string, string>)[segments[2]];
      if (redirectSlug) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/news/${redirectSlug}`;
        return NextResponse.redirect(url, 308);
      }
    }
    if (locales.includes(locale) && symptomContentBaseSet.has(make) && symptomContentBasePaths[locale] !== make) {
      return notFoundResponse();
    }
    if (locales.includes(locale) && problemFinderBaseSet.has(make) && problemFinderBasePaths[locale] !== make) {
      return notFoundResponse();
    }
    if (locales.includes(locale) && codeHubBaseSet.has(make)) {
      if (codeHubBasePaths[locale] !== make || segments.length !== 3 || !validRoutes.validCodes.includes(segments[2].toUpperCase())) {
        return notFoundResponse();
      }
      return intlMiddleware(request);
    }


    const isStaticPage = ['about', 'contact', 'blog', 'news', 'privacy', 'terms', 'search', 'editorial-policy', 'reviewers', 'disclaimer', 'symptoms', 'car-symptoms', 'ariza-belirtileri', 'auto-symptome', 'sintomas-coche', 'symptomes-voiture', 'car-problem-finder', 'ariza-bulucu', 'auto-problemfinder', 'buscador-fallas', 'trouver-panne', 'tools', 'vehicles', 'engine-codes', 'oil-capacity', 'common-problems', 'engines', 'transmissions', 'maintenance', 'recalls', 'calculators', 'resources'].includes(make);

    if (locales.includes(locale) && !isStaticPage) {
      const isWarningLightDetail = segments.length === 5 && segments[3] === 'lights';
      if (segments.length > 4 && !isWarningLightDetail) {
        return notFoundResponse();
      }


      if (!validRoutes.validMakes.includes(make)) {
        return notFoundResponse();
      }

      if (segments.length === 3 && brandWarningBaseSet.has(segments[2])) {
        if (brandWarningBasePaths[locale] !== segments[2]) {
          return notFoundResponse();
        }
        return intlMiddleware(request);
      }

      if (segments.length >= 3) {
        const model = segments[2];
        const validModelsForMake = validRoutes.validModels[make as keyof typeof validRoutes.validModels] || [];
        if (!validModelsForMake.includes(model)) {
          return notFoundResponse();
        }

        if (segments.length >= 4) {
          const code = segments[3];
          if (code !== 'lights') {
            if (!validRoutes.validCodes.includes(code.toUpperCase())) {
              return notFoundResponse();
            }
          }
        }
      }
    }
  }

  return intlMiddleware(request);
}
