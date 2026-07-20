import { NextResponse } from 'next/server';
import { SEO_LAST_REVIEWED } from '@/data/seo';

const BASE_URL = 'https://www.obd2hq.com';
const SITEMAPS = ['base', 'high-intent-codes', 'opportunity-codes', 'gsc-opportunities'];
const LASTMOD = SEO_LAST_REVIEWED.slice(0, 10);

export async function GET() {
  const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${SITEMAPS.map((_, index) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/${index}.xml</loc>
    <lastmod>${LASTMOD}</lastmod>
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
