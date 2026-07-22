import { NextResponse } from 'next/server';
import { baseCodes, getLocalized } from '@/data/db';
import { SEO_LAST_REVIEWED, getCodeCategoryLabel, getCodeSystem, getRelatedCodes } from '@/data/seo';

const BASE_URL = 'https://obd2hq.com';

export async function GET() {
  const codes = Object.entries(baseCodes).map(([code, data]) => {
    const record = data as { severity?: string };
    return ({
    code,
    title: getLocalized(data.title, 'en') || code,
    description: getLocalized(data.description, 'en') || '',
    system: getCodeSystem(code),
    category: getCodeCategoryLabel(code),
    severity: record.severity || 'moderate',
    relatedCodes: getRelatedCodes(code, Object.keys(baseCodes), 6),
    url: `${BASE_URL}/en/codes/${code.toLowerCase()}`,
  });
  });

  return NextResponse.json({
    name: 'OBD2HQ Open OBD2 Code Dataset',
    license: 'Free to reference with attribution to OBD2HQ',
    sourceUrl: `${BASE_URL}/en/resources`,
    lastReviewed: SEO_LAST_REVIEWED,
    count: codes.length,
    codes,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
