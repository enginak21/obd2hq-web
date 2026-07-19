import Link from 'next/link';
import { indexedVehicleSpecRecords } from '@/data/vehicle-spec-records';

type VehicleSeoHubProps = {
  locale: string;
  eyebrow: string;
  title: string;
  description: string;
  metricLabel: string;
  mode: 'engine' | 'oil' | 'problems';
};

export default function VehicleSeoHub({ locale, eyebrow, title, description, metricLabel, mode }: VehicleSeoHubProps) {
  const cards = getHubCards(mode).slice(0, 48);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <section className="hero-visual hero-visual-vehicle border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <p className="text-xs font-black uppercase tracking-widest text-blue-300">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-black tracking-tight text-white">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-400">{description}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map(card => (
          <Link key={card.href} href={`/${locale}${card.href}`} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-blue-400/40 transition-all">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">{card.years}</p>
            <h2 className="mt-3 text-2xl font-black text-white">{card.name}</h2>
            <p className="mt-3 text-sm text-slate-300">{metricLabel}: {card.metric}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {card.tags.slice(0, 5).map(tag => <span key={tag} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">{tag}</span>)}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

function getHubCards(mode: VehicleSeoHubProps['mode']) {
  const grouped = new Map<string, typeof indexedVehicleSpecRecords>();
  for (const record of indexedVehicleSpecRecords) {
    const key = `${record.make}/${record.model}`;
    grouped.set(key, [...(grouped.get(key) || []), record]);
  }

  return Array.from(grouped.entries()).map(([key, records]) => {
    const [make, model] = key.split('/');
    const years = records.map(record => record.year);
    const displayName = records[0].displayName;
    const href = `/vehicles/${make}/${model}`;
    const engineCodes = unique(records.flatMap(record => record.engineCodes));
    const oils = unique(records.map(record => record.recommendedOil));
    const problems = unique(records.flatMap(record => record.commonProblems));

    return {
      href,
      name: displayName,
      years: `${Math.min(...years)}-${Math.max(...years)}`,
      metric: mode === 'engine' ? engineCodes.slice(0, 4).join(', ') : mode === 'oil' ? oils.slice(0, 3).join(' / ') : problems.slice(0, 3).join(', '),
      tags: mode === 'engine' ? [...engineCodes, ...oils] : mode === 'oil' ? [...oils, ...engineCodes] : [...problems, ...engineCodes],
      score: records.length + engineCodes.length + problems.length,
    };
  }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
