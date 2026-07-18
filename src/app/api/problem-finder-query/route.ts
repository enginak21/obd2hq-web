import { NextResponse } from 'next/server';
import { isProblemFinderLocale } from '@/data/problem-finder';
import { isLikelySpam, pushOptionalKvList, sanitizeProblemQuery } from '@/utils/problem-finder-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = sanitizeProblemQuery(body.query);
    if (!query || isLikelySpam(query)) {
      return NextResponse.json({ ok: true, stored: false });
    }

    const locale = isProblemFinderLocale(body.locale) ? body.locale : 'en';
    const payload = {
      query,
      locale,
      matchedIntent: typeof body.matchedIntent === 'string' ? body.matchedIntent.slice(0, 80) : null,
      score: Number.isFinite(Number(body.score)) ? Math.max(0, Math.min(100, Number(body.score))) : 0,
      found: Boolean(body.found),
      date: new Date().toISOString(),
    };

    const result = await pushOptionalKvList('obd2hq:problem-finder:queries', payload);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
