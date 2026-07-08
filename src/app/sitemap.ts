import { MetadataRoute } from 'next';
import { cars } from '@/data/db';

const BASE_URL = 'https://obd2hq.com';
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  LOCALES.forEach((locale) => {
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
    routes.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
    routes.push({
      url: `${BASE_URL}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
    routes.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    cars.forEach((car) => {
      routes.push({
        url: `${BASE_URL}/${locale}/${car.make}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });

      car.models.forEach((model) => {
        routes.push({
          url: `${BASE_URL}/${locale}/${car.make}/${model}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    });
  });

  return routes;
}
