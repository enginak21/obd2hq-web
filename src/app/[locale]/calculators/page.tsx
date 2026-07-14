import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.calculatorsMetaTitle,
    description: copy.calculatorsMetaDescription,
    alternates: getAlternates('calculators', locale),
  };
}

export default async function CalculatorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.calculatorsEyebrow} title={copy.calculatorsTitle} description={copy.calculatorsDescription} />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {copy.calculators.map(([slug, title, description]) => (
          <Link key={slug} href={`/${locale}/tools/diagnostic-assistant`} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-blue-400/40 transition-all">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
