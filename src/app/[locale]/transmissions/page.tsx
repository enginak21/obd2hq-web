import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { transmissionProfiles } from '@/data/transmission-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.transmissionsMetaTitle,
    description: copy.transmissionsMetaDescription,
    alternates: getAlternates('transmissions', locale),
  };
}

export default async function TransmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.transmissionsEyebrow} title={copy.transmissionsTitle} description={copy.transmissionsDescription} />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {transmissionProfiles.map(transmission => (
          <KnowledgeCard key={transmission.slug} href={`/${locale}/transmissions/${transmission.slug}`} title={`${transmission.maker} ${transmission.family}`} description={`${transmission.type}, ${transmission.gears}. ${copy.applicationsLabel}: ${transmission.applications.slice(0, 3).join(', ')}.`} tags={[transmission.type, transmission.gears, ...transmission.relatedCodes]} />
        ))}
      </section>
    </main>
  );
}
