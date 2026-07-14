export type SeoKeywordTrackerEntry = {
  query: string;
  locale: 'en' | 'tr' | 'de' | 'es' | 'fr';
  market: 'us' | 'tr' | 'de' | 'es' | 'fr';
  targetUrl: string;
  liveRank: number | null;
  gscClicks: number | null;
  gscImpressions: number | null;
  gscPosition: number | null;
  priority: 'critical' | 'high' | 'medium';
  lastChecked: string;
  note: string;
};

export const SEO_KEYWORD_TRACKER: SeoKeywordTrackerEntry[] = [
  {
    query: 'ford focus p0213',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/ford/focus/p0213',
    liveRank: 8,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'critical',
    lastChecked: '2026-07-14',
    note: 'Live page-one opportunity. Strengthen title, model-specific diagnosis, and internal links.',
  },
  {
    query: 'p0235 suzuki',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/suzuki/jimny/p0235',
    liveRank: 15,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'critical',
    lastChecked: '2026-07-14',
    note: 'Close to page one. Needs Suzuki/Jimny boost sensor context and troubleshooting depth.',
  },
  {
    query: 'dtc p0102 acura',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/acura/tlx/p0102',
    liveRank: 18,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'high',
    lastChecked: '2026-07-14',
    note: 'MAF low input intent. Needs Acura-specific MAF/intake live-data checks.',
  },
  {
    query: 'ford focus warning lights',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/ford/focus/lights',
    liveRank: 19,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'high',
    lastChecked: '2026-07-14',
    note: 'Warning-light hub has live visibility. Add diagnostic paths to OBD2 codes.',
  },
  {
    query: 'p0203 suzuki',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/suzuki/jimny/p0203',
    liveRank: 20,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'high',
    lastChecked: '2026-07-14',
    note: 'Injector circuit opportunity. Search Console position must not be treated as live rank.',
  },
  {
    query: 'how to fix p0420',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/blog/how-to-fix-p0420',
    liveRank: 22,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'critical',
    lastChecked: '2026-07-14',
    note: 'Money page. Expand into a true pillar and link to model-specific P0420 guides.',
  },
  {
    query: 'p0300 symptoms',
    locale: 'en',
    market: 'us',
    targetUrl: '/en/blog/p0300-symptoms-random-misfire',
    liveRank: null,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'critical',
    lastChecked: '2026-07-14',
    note: 'No top-95 live visibility. Requires new pillar content.',
  },
  {
    query: 'p0420 arıza kodu',
    locale: 'tr',
    market: 'tr',
    targetUrl: '/tr/blog/p0420-ariza-kodu-nasil-cozulur',
    liveRank: null,
    gscClicks: null,
    gscImpressions: null,
    gscPosition: null,
    priority: 'high',
    lastChecked: '2026-07-14',
    note: 'No top-95 live visibility. Turkish content must be natural, complete, and internally linked.',
  },
];
