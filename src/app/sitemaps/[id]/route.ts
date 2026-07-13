import { NextResponse } from 'next/server';
import { cars, baseCodes } from '@/data/db';

const BASE_URL = 'https://www.obd2hq.com';
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];

function getSitemapIdentifiers(): string[] {
  const identifiers: string[] = ['base'];
  LOCALES.forEach((locale) => {
    cars.forEach((car) => {
      car.models.forEach((model) => {
        identifiers.push(`${locale}-${car.make}-${model}`);
      });
    });
  });
  return identifiers;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const resolvedParams = await context.params;
  const numericId = parseInt(resolvedParams.id, 10);
  const identifiers = getSitemapIdentifiers();
  
  if (isNaN(numericId) || numericId < 0 || numericId >= identifiers.length) {
    return new NextResponse('Not found', { status: 404 });
  }

  const idStr = identifiers[numericId];
  let urls = '';

  if (idStr === 'base') {
    LOCALES.forEach((locale) => {
      urls += `
        <url><loc>${BASE_URL}/${locale}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
        <url><loc>${BASE_URL}/${locale}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
        <url><loc>${BASE_URL}/${locale}/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
        <url><loc>${BASE_URL}/${locale}/news</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
        <url><loc>${BASE_URL}/${locale}/editorial-policy</loc><changefreq>yearly</changefreq><priority>0.4</priority></url>
        <url><loc>${BASE_URL}/${locale}/reviewers</loc><changefreq>yearly</changefreq><priority>0.4</priority></url>
      `;
      cars.forEach((car) => {
        urls += `<url><loc>${BASE_URL}/${locale}/${car.make}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`;
        car.models.forEach((model) => {
          urls += `<url><loc>${BASE_URL}/${locale}/${car.make}/${model}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        });
      });
    });
  } else {
    // format: locale-make-model
    const parts = idStr.split('-');
    if (parts.length >= 3) {
      const locale = parts[0];
      const make = parts[1];
      const model = parts.slice(2).join('-');
      
      const car = cars.find(c => c.make === make);
      if (car && LOCALES.includes(locale) && car.models.includes(model)) {
        Object.keys(baseCodes).forEach(code => {
          urls += `<url><loc>${BASE_URL}/${locale}/${make}/${model}/${code}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
        });
      }
    }
  }

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(sitemapXML.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
