import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { transmissionProfiles } from '@/data/transmission-database';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Transmission Database - OBD2HQ',
    description: 'Transmission database covering ZF, DSG, CVT, PowerShift and Aisin families with fluids, service notes, common failures and OBD codes.',
    alternates: getAlternates('transmissions', locale),
  };
}

export default async function TransmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow="Transmission database" title="Transmission families, fluids and failure patterns" description="A structured reference for automatic, DSG, CVT and dual-clutch transmissions with service notes and related fault codes." />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {transmissionProfiles.map(transmission => (
          <KnowledgeCard key={transmission.slug} href={`/${locale}/transmissions/${transmission.slug}`} title={`${transmission.maker} ${transmission.family}`} description={`${transmission.type}, ${transmission.gears}. Applications: ${transmission.applications.slice(0, 3).join(', ')}.`} tags={[transmission.type, transmission.gears, ...transmission.relatedCodes]} />
        ))}
      </section>
    </main>
  );
}
