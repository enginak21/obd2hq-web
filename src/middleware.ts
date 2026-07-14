import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import validRoutes from './data/valid_routes.json';

const locales = ['en', 'de', 'es', 'tr', 'fr'];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en'
});

function notFoundResponse() {
  return new NextResponse('<!doctype html><html><head><meta name="robots" content="noindex" /></head><body><h1>404 Not Found</h1></body></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host');

  if (host === 'obd2hq.com') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.obd2hq.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }
  
  // Static resources bypass
  if (
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') || 
    pathname.includes('.') || 
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/sitemaps/')
  ) {
    return;
  }

  // Force 404 on invalid data
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 2) {
    const locale = segments[0];
    const make = segments[1];
    
    // Ignore static UI pages
    const isStaticPage = ['about', 'contact', 'blog', 'news', 'privacy', 'terms', 'search', 'editorial-policy', 'reviewers', 'disclaimer'].includes(make);
    
    if (locales.includes(locale) && !isStaticPage) {
      const isWarningLightDetail = segments.length === 5 && segments[3] === 'lights';
      if (segments.length > 4 && !isWarningLightDetail) {
        return notFoundResponse();
      }

      // It's a car data route
      if (!validRoutes.validMakes.includes(make)) {
        return notFoundResponse();
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
