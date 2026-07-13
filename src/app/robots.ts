import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://www.obd2hq.com/sitemap.xml',
  }
}
