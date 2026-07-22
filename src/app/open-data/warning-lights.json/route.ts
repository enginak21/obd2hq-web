import { NextResponse } from 'next/server';
import { getLocalizedWarningLight, warningLights } from '@/data/lights';
import { SEO_LAST_REVIEWED } from '@/data/seo';

const BASE_URL = 'https://obd2hq.com';
const LOCALES = ['en', 'tr', 'de', 'es', 'fr'] as const;

export async function GET() {
  const lights = Object.values(warningLights).map(light => ({
    id: light.id,
    color: light.color,
    urgency: light.urgency,
    image: `${BASE_URL}${light.imageSrc}`,
    locales: Object.fromEntries(
      LOCALES.map(locale => {
        const localized = getLocalizedWarningLight(light, locale);
        return [locale, {
          name: localized.name,
          description: localized.description,
          commonCauses: localized.commonCauses,
          whatToDo: localized.whatToDo,
          url: `${BASE_URL}/${locale}/symptoms`,
        }];
      })
    ),
  }));

  return NextResponse.json({
    name: 'OBD2HQ Open Dashboard Warning Light Dataset',
    license: 'Free to reference with attribution to OBD2HQ',
    sourceUrl: `${BASE_URL}/en/resources`,
    lastReviewed: SEO_LAST_REVIEWED,
    count: lights.length,
    lights,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
