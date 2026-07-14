import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';
import { KnowledgeHero } from '@/components/KnowledgeGrid';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Maintenance Schedule Generator - OBD2HQ',
    description: 'Maintenance schedule guidance by vehicle, mileage and system: oil, coolant, brake fluid, transmission, plugs, filters and diagnostic prevention.',
    alternates: getAlternates('maintenance', locale),
  };
}

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow="Maintenance platform" title="Maintenance schedules that prevent fault codes" description="A growing maintenance center connecting service items to the OBD2 codes and symptoms they can prevent." />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {vehicleKnowledgeProfiles.map(vehicle => (
          <Link key={`${vehicle.make}-${vehicle.model}`} href={`/${locale}/vehicles/${vehicle.make}/${vehicle.model}`} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-green-400/40 transition-all">
            <h2 className="text-2xl font-black text-white capitalize">{vehicle.make.replace('-', ' ')} {vehicle.model.replace('-', ' ')}</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              {vehicle.maintenance.slice(0, 4).map(item => <li key={item}>• {item}</li>)}
            </ul>
          </Link>
        ))}
      </section>
    </main>
  );
}
