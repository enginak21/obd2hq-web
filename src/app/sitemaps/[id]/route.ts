import { NextResponse } from 'next/server';
import { cars } from '@/data/db';
import { getBlogPosts } from '@/data/blog';
import { PRIORITY_CODES, SEO_LAST_REVIEWED } from '@/data/seo';
import { symptomGuides } from '@/data/symptoms';
import { automotiveTools } from '@/data/automotive-tools';
import { vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';
import { indexedVehicleSpecRecords } from '@/data/vehicle-spec-records';
import { engineProfiles } from '@/data/engine-database';
import { transmissionProfiles } from '@/data/transmission-database';
import { getProblemFinderDetailPath, getProblemFinderHubPath, isProblemFinderLocale, publishedProblemFinderIntents } from '@/data/problem-finder';
import { getSymptomContentDetailPath, getSymptomContentHubPath, isSymptomContentLocale, publishedSymptomContentGroups } from '@/data/symptom-content';
import { getBrandWarningLightsPath, getCodeHubPath, getOpportunityCodes, type GscOpportunity } from '@/data/gsc-seo';
import { getIndexableVehicleCodeTargets } from '@/data/indexing-policy';
import { isCodeHubSitemapEligible } from '@/data/sitemap-policy';
import gscOpportunities from '@/data/generated/gsc-opportunities.json';
import validRoutes from '@/data/valid_routes.json';

const BASE_URL = 'https://www.obd2hq.com';
const LOCALES = ['en', 'de', 'es', 'tr', 'fr'];
const LASTMOD = SEO_LAST_REVIEWED.slice(0, 10);

const VALID_CODE_SET = new Set((validRoutes.validCodes as string[]).map((code) => code.toUpperCase()));
const SITEMAP_HIGH_INTENT_CODES = PRIORITY_CODES.filter((code) => VALID_CODE_SET.has(code.toUpperCase()));

function getSitemapIdentifiers(): string[] {
  return ['base', 'code-hubs', 'high-intent-codes', 'opportunity-codes', 'gsc-opportunities'];
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
      urls += urlEntry(`${BASE_URL}/${locale}/resources`, 'monthly', '0.86');
      urls += urlEntry(`${BASE_URL}/${locale}/warning-lights`, 'weekly', '0.88');
      getBlogPosts(locale).forEach((post) => {
        urls += urlEntry(`${BASE_URL}/${locale}/blog/${post.slug}`, 'monthly', '0.8', post.date);
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
  } else if (idStr === 'code-hubs') {
    LOCALES.forEach((locale) => {
      Array.from(VALID_CODE_SET).sort().forEach((code) => {
        if (!isCodeHubSitemapEligible(code)) return;
        urls += urlEntry(`${BASE_URL}${getCodeHubPath(locale, code)}`, 'monthly', '0.82');
      });
    });
  } else if (idStr === 'high-intent-codes') {
    const targets = getIndexableVehicleCodeTargets().filter((target) => SITEMAP_HIGH_INTENT_CODES.includes(target.code));
    LOCALES.forEach((locale) => {
      targets.forEach(({ make, model, code }) => {
        urls += urlEntry(`${BASE_URL}/${locale}/${make}/${model}/${code.toLowerCase()}`, 'weekly', '0.9');
      });
    });
  } else if (idStr === 'opportunity-codes') {
    const targets = getIndexableVehicleCodeTargets().filter((target) => !SITEMAP_HIGH_INTENT_CODES.includes(target.code));
    LOCALES.forEach((locale) => {
      targets.forEach(({ make, model, code }) => {
        if (!VALID_CODE_SET.has(code)) return;
        urls += urlEntry(`${BASE_URL}/${locale}/${make}/${model}/${code.toLowerCase()}`, 'weekly', '0.9');
      });
    });
  } else if (idStr === 'gsc-opportunities') {
    const typedOpportunities = gscOpportunities as GscOpportunity[];
    const gscCodes = getOpportunityCodes(typedOpportunities);
    const gscMakeWarnings = Array.from(new Set(
      typedOpportunities
        .filter(opportunity => opportunity.intentType === 'warning_light_make')
        .map(opportunity => opportunity.targetUrl.split('/')[2])
        .filter(Boolean)
    ));

    LOCALES.forEach((locale) => {
      gscCodes.forEach((code) => {
        if (!isCodeHubSitemapEligible(code)) return;
        urls += urlEntry(`${BASE_URL}${getCodeHubPath(locale, code)}`, 'weekly', '0.9');
      });
      gscMakeWarnings.forEach((make) => {
        urls += urlEntry(`${BASE_URL}${getBrandWarningLightsPath(locale, make)}`, 'weekly', '0.86');
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
