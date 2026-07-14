import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';

const calculators = [
  ['psi-to-bar', 'PSI to BAR converter', 'Convert tire pressure, boost pressure and fuel pressure between PSI and BAR.'],
  ['hp-to-kw', 'HP to kW converter', 'Convert horsepower to kilowatts for engine output comparisons.'],
  ['nm-to-lb-ft', 'Nm to lb-ft converter', 'Convert torque values for wheel torque, engine torque and fastener specs.'],
  ['fuel-cost', 'Fuel cost calculator', 'Estimate trip cost from distance, fuel economy and fuel price.'],
  ['engine-displacement', 'Engine displacement calculator', 'Calculate displacement from bore, stroke and cylinder count.'],
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Automotive Calculators - OBD2HQ',
    description: 'Automotive calculators for PSI to BAR, HP to kW, Nm to lb-ft, fuel cost and engine displacement.',
    alternates: getAlternates('calculators', locale),
  };
}

export default async function CalculatorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow="Automotive calculators" title="Fast calculators for repair and vehicle data" description="Useful conversion and estimating tools that support diagnostics, maintenance, tire pressure, torque specs and fuel planning." />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {calculators.map(([slug, title, description]) => (
          <Link key={slug} href={`/${locale}/tools/diagnostic-assistant`} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-blue-400/40 transition-all">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
