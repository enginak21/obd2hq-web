import { NextResponse } from 'next/server';
import { SEO_LAST_REVIEWED } from '@/data/seo';

const BASE_URL = 'https://obd2hq.com';

export async function GET() {
  return NextResponse.json({
    name: 'OBD2HQ Linkable Automotive Diagnostic Assets',
    purpose: 'Editorial resources that forums, blogs, tool pages, schools and repair communities can cite without paid link placement.',
    sourceUrl: `${BASE_URL}/en/resources`,
    lastReviewed: SEO_LAST_REVIEWED,
    attribution: {
      preferredText: 'Source: OBD2HQ diagnostic resources',
      preferredUrl: `${BASE_URL}/en/resources`,
      guidance: 'Use branded or descriptive anchors. Avoid exact-match spam anchors and paid dofollow link schemes.',
    },
    assets: [
      {
        id: 'open-obd2-code-dataset',
        title: 'Open OBD2 code dataset',
        url: `${BASE_URL}/open-data/obd2-codes.json`,
        bestFor: ['developer tools', 'forum reference posts', 'OBD2 glossary pages', 'diagnostic apps'],
      },
      {
        id: 'warning-light-dataset',
        title: 'Dashboard warning light dataset',
        url: `${BASE_URL}/open-data/warning-lights.json`,
        bestFor: ['dashboard symbol guides', 'driver education pages', 'repair shop resources'],
      },
      {
        id: 'diagnostic-checklist',
        title: 'OBD2 first-check diagnostic checklist',
        url: `${BASE_URL}/open-data/diagnostic-checklist.json`,
        bestFor: ['DIY repair guides', 'mechanic intake forms', 'community troubleshooting posts'],
      },
      {
        id: 'lookup-widget',
        title: 'Embeddable OBD2 lookup widget',
        url: `${BASE_URL}/widget/obd2hq-lookup.js`,
        embedCode: '<div data-obd2hq-widget data-locale="en"></div><script src="https://obd2hq.com/widget/obd2hq-lookup.js" async></script>',
        bestFor: ['blogs', 'repair shop sites', 'car community portals'],
      },
    ],
  }, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
