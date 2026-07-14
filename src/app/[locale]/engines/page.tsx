import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { engineProfiles } from '@/data/engine-database';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Engine Database - OBD2HQ',
    description: 'Automotive engine database with specifications, oil type, oil capacity, common failures, maintenance and related OBD2 fault codes.',
    alternates: getAlternates('engines', locale),
  };
}

export default async function EnginesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow="Engine database" title="Engine families, specs and diagnostic patterns" description="A growing structured database for engine specifications, oil data, common failures, maintenance focus and related OBD2 codes." />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {engineProfiles.map(engine => (
          <KnowledgeCard key={engine.slug} href={`/${locale}/engines/${engine.slug}`} title={`${engine.manufacturer} ${engine.family}`} description={`${engine.configuration}, ${engine.displacement}, ${engine.induction}. Reliability: ${engine.reliabilityScore}`} tags={[engine.production, engine.oilType, ...engine.relatedCodes]} />
        ))}
      </section>
    </main>
  );
}
