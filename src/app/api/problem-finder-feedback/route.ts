import { NextResponse } from 'next/server';
import { isProblemFinderLocale } from '@/data/problem-finder';
import { pushOptionalKvList } from '@/utils/problem-finder-storage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = {
      locale: isProblemFinderLocale(body.locale) ? body.locale : 'en',
      intentKey: typeof body.intentKey === 'string' ? body.intentKey.slice(0, 80) : null,
      helpful: Boolean(body.helpful),
      date: new Date().toISOString(),
    };
    const result = await pushOptionalKvList('obd2hq:problem-finder:feedback', payload);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
