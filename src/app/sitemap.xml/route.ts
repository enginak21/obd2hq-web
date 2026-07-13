import { NextResponse } from 'next/server';
import { cars } from '@/data/db';

const BASE_URL = 'https://www.obd2hq.com';
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];

export async function GET() {
  const sitemapIdentifiers: string[] = ['base'];
  LOCALES.forEach((locale) => {
    cars.forEach((car) => {
      car.models.forEach((model) => {
        sitemapIdentifiers.push(`${locale}-${car.make}-${model}`);
      });
    });
  });

  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapIdentifiers.map((_, index) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/${index}.xml</loc>
  </sitemap>
  `).join('')}
</sitemapindex>`;

  return new NextResponse(sitemapIndexXML, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
