import { MetadataRoute } from 'next';
import { cars, baseCodes } from '@/data/db';

const BASE_URL = 'https://obd2hq.com';
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];

const sitemapIdentifiers: string[] = ['base'];
LOCALES.forEach((locale) => {
  cars.forEach((car) => {
    sitemapIdentifiers.push(`${locale}-${car.make}`);
  });
});

export async function generateSitemaps() {
  return sitemapIdentifiers.map((_, index) => ({ id: index }));
}

export default async function sitemap(props: any): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];
  
  // Await props.id for Next.js 15+ compatibility
  const resolvedIdRaw = await props.id;
  const numericId = parseInt(resolvedIdRaw, 10);
  
  if (isNaN(numericId) || numericId < 0 || numericId >= sitemapIdentifiers.length) {
    return routes;
  }

  const idStr = sitemapIdentifiers[numericId];

  if (idStr === 'base') {
    LOCALES.forEach((locale) => {
      routes.push({ url: `${BASE_URL}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 });
      routes.push({ url: `${BASE_URL}/${locale}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 });
      routes.push({ url: `${BASE_URL}/${locale}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 });
      routes.push({ url: `${BASE_URL}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
      routes.push({ url: `${BASE_URL}/${locale}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 });
      routes.push({ url: `${BASE_URL}/${locale}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 });
      routes.push({ url: `${BASE_URL}/${locale}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 });
      
      cars.forEach((car) => {
        routes.push({ url: `${BASE_URL}/${locale}/${car.make}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 });
        car.models.forEach((model) => {
          routes.push({ url: `${BASE_URL}/${locale}/${car.make}/${model}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
        });
      });
    });
    return routes;
  }

  // Handle dynamic make-locale sitemaps
  // idStr format: locale-make (e.g., tr-audi)
  const parts = idStr.split('-');
  if (parts.length >= 2) {
    const locale = parts[0];
    const make = parts.slice(1).join('-');
    
    const car = cars.find(c => c.make === make);
    if (car && LOCALES.includes(locale)) {
      const codeKeys = Object.keys(baseCodes);
      car.models.forEach(model => {
        codeKeys.forEach(code => {
          routes.push({
            url: `${BASE_URL}/${locale}/${make}/${model}/${code}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        });
      });
    }
  }

  return routes;
}
