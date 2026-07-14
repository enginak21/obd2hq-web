import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Recall and TSB Research Center - OBD2HQ',
    description: 'Learn how to research recalls, service campaigns and technical service bulletins safely using official manufacturer and government sources.',
    alternates: getAlternates('recalls', locale),
  };
}

export default async function RecallsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow="Recall research" title="Recall and service bulletin research center" description="A trust-first hub for finding official recall information, understanding safety campaigns and connecting known issues to diagnostic symptoms." />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-5">
        {[
          ['Check official recall sources', 'Use manufacturer owner portals or national safety databases. OBD2HQ does not fabricate VIN recall results.'],
          ['Match symptoms to campaigns', 'A recall may explain warning lights, electrical faults, fuel smell, brake warnings or camera/ADAS problems.'],
          ['Document before repair', 'Save codes, photos, dates and dealer communication before clearing faults or replacing parts.'],
        ].map(([title, text]) => (
          <section key={title} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{text}</p>
          </section>
        ))}
      </section>
    </main>
  );
}
