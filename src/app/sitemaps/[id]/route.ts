import { NextResponse } from 'next/server';
import { cars } from '@/data/db';
import { getBlogPosts } from '@/data/blog';
import { getAllNews } from '@/data/news';
import { PRIORITY_CODES } from '@/data/seo';
import { symptomGuides } from '@/data/symptoms';
import { automotiveTools } from '@/data/automotive-tools';
import { vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';
import { indexedVehicleSpecRecords } from '@/data/vehicle-spec-records';
import { engineProfiles } from '@/data/engine-database';
import { transmissionProfiles } from '@/data/transmission-database';
import { getProblemFinderDetailPath, getProblemFinderHubPath, isProblemFinderLocale, publishedProblemFinderIntents } from '@/data/problem-finder';
import { getSymptomContentDetailPath, getSymptomContentHubPath, isSymptomContentLocale, publishedSymptomContentGroups } from '@/data/symptom-content';

const BASE_URL = 'https://www.obd2hq.com';
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];
const LASTMOD = '2026-07-14';

const OPPORTUNITY_CODES = ['P0203', 'P0235', 'P0204', 'P0213', 'P0102'] as const;

const PRIORITY_CODE_URLS = [
  { make: 'ford', model: 'focus', code: 'P0213' },
  { make: 'suzuki', model: 'jimny', code: 'P0235' },
  { make: 'suzuki', model: 'jimny', code: 'P0203' },
  { make: 'suzuki', model: 'jimny', code: 'P0204' },
  { make: 'acura', model: 'tlx', code: 'P0102' },
  { make: 'toyota', model: 'camry', code: 'P0420' },
  { make: 'toyota', model: 'camry', code: 'P0300' },
  { make: 'nissan', model: 'altima', code: 'P0420' },
  { make: 'nissan', model: 'altima', code: 'P0300' },
  { make: 'ford', model: 'f-150', code: 'P0420' },
  { make: 'ford', model: 'f-150', code: 'P0300' },
  { make: 'honda', model: 'civic', code: 'P0420' },
  { make: 'honda', model: 'civic', code: 'P0300' },
] as const;

function getSitemapIdentifiers(): string[] {
  return ['base', 'high-intent-codes', 'opportunity-codes'];
}

function urlEntry(loc: string, changefreq: string, priority: string, lastmod = LASTMOD) {
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
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
      urls += urlEntry(`${BASE_URL}/${locale}`, 'daily', '1.0');
      urls += urlEntry(`${BASE_URL}/${locale}/about`, 'monthly', '0.5');
      urls += urlEntry(`${BASE_URL}/${locale}/contact`, 'monthly', '0.5');
      urls += urlEntry(`${BASE_URL}/${locale}/blog`, 'weekly', '0.8');
      urls += urlEntry(`${BASE_URL}/${locale}/news`, 'daily', '0.9');
      urls += urlEntry(`${BASE_URL}/${locale}/symptoms`, 'weekly', '0.9');
      if (isSymptomContentLocale(locale)) {
        urls += urlEntry(`${BASE_URL}${getSymptomContentHubPath(locale)}`, 'daily', '0.95');
        publishedSymptomContentGroups.forEach((group) => {
          urls += urlEntry(`${BASE_URL}${getSymptomContentDetailPath(group, locale)}`, 'daily', '0.9');
        });
      }
      if (isProblemFinderLocale(locale)) {
        urls += urlEntry(`${BASE_URL}${getProblemFinderHubPath(locale)}`, 'daily', '0.96');
        publishedProblemFinderIntents.forEach((intent) => {
          urls += urlEntry(`${BASE_URL}${getProblemFinderDetailPath(locale, intent)}`, 'weekly', '0.88');
        });
      }
      urls += urlEntry(`${BASE_URL}/${locale}/tools`, 'weekly', '0.9');
      urls += urlEntry(`${BASE_URL}/${locale}/vehicles`, 'weekly', '0.9');
      urls += urlEntry(`${BASE_URL}/${locale}/engine-codes`, 'weekly', '0.9');
      urls += urlEntry(`${BASE_URL}/${locale}/oil-capacity`, 'weekly', '0.9');
      urls += urlEntry(`${BASE_URL}/${locale}/common-problems`, 'weekly', '0.9');
      urls += urlEntry(`${BASE_URL}/${locale}/engines`, 'weekly', '0.85');
      urls += urlEntry(`${BASE_URL}/${locale}/transmissions`, 'weekly', '0.85');
      urls += urlEntry(`${BASE_URL}/${locale}/maintenance`, 'weekly', '0.8');
      urls += urlEntry(`${BASE_URL}/${locale}/recalls`, 'weekly', '0.8');
      urls += urlEntry(`${BASE_URL}/${locale}/calculators`, 'weekly', '0.8');
      urls += urlEntry(`${BASE_URL}/${locale}/editorial-policy`, 'yearly', '0.4');
      urls += urlEntry(`${BASE_URL}/${locale}/reviewers`, 'yearly', '0.4');
      urls += urlEntry(`${BASE_URL}/${locale}/privacy`, 'yearly', '0.3');
      urls += urlEntry(`${BASE_URL}/${locale}/terms`, 'yearly', '0.3');
      urls += urlEntry(`${BASE_URL}/${locale}/disclaimer`, 'yearly', '0.3');
      getBlogPosts(locale).forEach((post) => {
        urls += urlEntry(`${BASE_URL}/${locale}/blog/${post.slug}`, 'monthly', '0.8', post.date);
      });
      getAllNews().forEach((article) => {
        urls += urlEntry(`${BASE_URL}/${locale}/news/${article.slug}`, 'weekly', '0.6', article.date);
      });
      symptomGuides.forEach((symptom) => {
        urls += urlEntry(`${BASE_URL}/${locale}/symptoms/${symptom.slug}`, 'weekly', '0.85');
      });
      automotiveTools.forEach((tool) => {
        urls += urlEntry(`${BASE_URL}/${locale}/tools/${tool.slug}`, 'weekly', '0.85');
      });
      vehicleKnowledgeProfiles.forEach((vehicle) => {
        urls += urlEntry(`${BASE_URL}/${locale}/vehicles/${vehicle.make}/${vehicle.model}`, 'weekly', '0.85');
      });
      indexedVehicleSpecRecords.forEach((variant) => {
        urls += urlEntry(`${BASE_URL}/${locale}/vehicles/${variant.make}/${variant.model}/${variant.year}/${variant.slug}`, 'monthly', '0.8');
      });
      engineProfiles.forEach((engine) => {
        urls += urlEntry(`${BASE_URL}/${locale}/engines/${engine.slug}`, 'weekly', '0.8');
      });
      transmissionProfiles.forEach((transmission) => {
        urls += urlEntry(`${BASE_URL}/${locale}/transmissions/${transmission.slug}`, 'weekly', '0.8');
      });
      cars.forEach((car) => {
        urls += urlEntry(`${BASE_URL}/${locale}/${car.make}`, 'weekly', '0.9');
        car.models.forEach((model) => {
          urls += urlEntry(`${BASE_URL}/${locale}/${car.make}/${model}`, 'weekly', '0.8');
          urls += urlEntry(`${BASE_URL}/${locale}/${car.make}/${model}/lights`, 'monthly', '0.7');
        });
      });
    });
  } else if (idStr === 'high-intent-codes') {
    LOCALES.forEach((locale) => {
      cars.forEach((car) => {
        car.models.forEach((model) => {
          PRIORITY_CODES.forEach((code) => {
            urls += urlEntry(`${BASE_URL}/${locale}/${car.make}/${model}/${code.toLowerCase()}`, 'monthly', '0.8');
          });
        });
      });
    });
  } else if (idStr === 'opportunity-codes') {
    const emitted = new Set<string>();
    LOCALES.forEach((locale) => {
      cars.forEach((car) => {
        car.models.forEach((model) => {
          OPPORTUNITY_CODES.forEach((code) => {
            const loc = `${BASE_URL}/${locale}/${car.make}/${model}/${code.toLowerCase()}`;
            if (!emitted.has(loc)) {
              emitted.add(loc);
              urls += urlEntry(loc, 'monthly', '0.75');
            }
          });
        });
      });
      PRIORITY_CODE_URLS.forEach(({ make, model, code }) => {
        const loc = `${BASE_URL}/${locale}/${make}/${model}/${code.toLowerCase()}`;
        if (!emitted.has(loc)) {
          emitted.add(loc);
          urls += urlEntry(loc, 'weekly', '0.9');
        }
      });
    });
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
