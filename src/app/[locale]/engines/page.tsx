import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { engineProfiles } from '@/data/engine-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.enginesMetaTitle,
    description: copy.enginesMetaDescription,
    alternates: getAlternates('engines', locale),
  };
}

export default async function EnginesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.enginesEyebrow} title={copy.enginesTitle} description={copy.enginesDescription} />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {engineProfiles.map(engine => (
          <KnowledgeCard key={engine.slug} href={`/${locale}/engines/${engine.slug}`} title={`${engine.manufacturer} ${engine.family}`} description={`${engine.configuration}, ${engine.displacement}, ${engine.induction}. ${copy.reliabilityLabel}: ${engine.reliabilityScore}`} tags={[engine.production, engine.oilType, ...engine.relatedCodes]} />
        ))}
      </section>
    </main>
  );
}
