import { NextResponse } from 'next/server';
import { SEO_LAST_REVIEWED } from '@/data/seo';

const BASE_URL = 'https://obd2hq.com';

const checklist = [
  {
    id: 'safety-first',
    title: 'Check safety first',
    items: [
      'Stop driving if oil pressure, coolant temperature, brake warning or flashing check engine light is active.',
      'Do not open a hot cooling system.',
      'If braking feels weak or the pedal sinks, tow the vehicle instead of driving.',
    ],
  },
  {
    id: 'scan-and-freeze-frame',
    title: 'Scan codes and save freeze-frame data',
    items: [
      'Read stored, pending and permanent OBD2 codes.',
      'Save freeze-frame speed, load, coolant temperature, fuel trim and RPM before clearing codes.',
      'Record warning lights and symptoms in plain language.',
    ],
  },
  {
    id: 'visual-inspection',
    title: 'Inspect simple causes before replacing parts',
    items: [
      'Check battery voltage, fuses, grounds and obvious connector damage.',
      'Inspect intake hoses, vacuum lines, fluid levels and leaks.',
      'Look for recent repair work near the affected system.',
    ],
  },
  {
    id: 'live-data',
    title: 'Compare live data',
    items: [
      'Compare sensor values against realistic engine conditions.',
      'Use fuel trims, oxygen sensor activity, MAF/MAP values and temperature readings to confirm direction.',
      'Do not replace sensors until wiring, power, ground and signal behavior are checked.',
    ],
  },
  {
    id: 'verify-repair',
    title: 'Verify the repair',
    items: [
      'Clear codes only after a repair or confirmed correction.',
      'Complete the required drive cycle.',
      'Re-scan for pending codes and confirm the symptom did not return.',
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    name: 'OBD2HQ Diagnostic First-Check Checklist',
    license: 'Free to reference with attribution to OBD2HQ',
    sourceUrl: `${BASE_URL}/en/resources`,
    lastReviewed: SEO_LAST_REVIEWED,
    checklist,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
