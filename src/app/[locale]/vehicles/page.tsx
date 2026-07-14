import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Vehicle Knowledge Database - OBD2HQ',
    description: 'Technical vehicle database with engines, transmissions, fluids, OBD port locations, maintenance schedules, known problems and common OBD2 codes.',
    alternates: getAlternates('vehicles', locale),
  };
}

export default async function VehiclesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero
        eyebrow="Vehicle database"
        title="Vehicle technical knowledge base"
        description="Structured vehicle profiles connecting engines, transmissions, fluids, OBD port locations, known problems, maintenance and diagnostic codes."
      />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {vehicleKnowledgeProfiles.map(vehicle => (
          <KnowledgeCard
            key={`${vehicle.make}-${vehicle.model}`}
            href={`/${locale}/vehicles/${vehicle.make}/${vehicle.model}`}
            title={`${vehicle.make.replace('-', ' ')} ${vehicle.model.replace('-', ' ')}`.replace(/\b\w/g, c => c.toUpperCase())}
            description={`${vehicle.generation} (${vehicle.years}) with ${vehicle.engines.slice(0, 2).join(', ')} and common codes ${vehicle.commonCodes.slice(0, 3).join(', ')}.`}
            tags={[vehicle.generation, vehicle.years, ...vehicle.commonCodes]}
          />
        ))}
      </section>
    </main>
  );
}
