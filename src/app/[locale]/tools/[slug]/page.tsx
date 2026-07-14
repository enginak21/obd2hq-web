import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BadgeCheck, ListChecks, SearchCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { automotiveTools, getToolBySlug, localizeTool } from '@/data/automotive-tools';
import ToolSimulator from '@/components/ToolSimulator';

export function generateStaticParams() {
  return automotiveTools.flatMap(tool => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const localized = localizeTool(tool, locale);
  return {
    title: `${localized.title} - Free Automotive Tool`,
    description: localized.description,
    alternates: getAlternates(`tools/${slug}`, locale),
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const localized = localizeTool(tool, locale);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: localized.title,
    applicationCategory: 'Automotive diagnostic tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: localized.description,
    url: `https://www.obd2hq.com/${locale}/tools/${slug}`,
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">OBD2HQ</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/tools`} className="hover:text-white">Tools</Link>
          </nav>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">{localized.title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">{localized.description}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <ToolSimulator toolSlug={tool.slug} />

          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <ListChecks className="w-6 h-6 text-blue-400" />
              How to use this tool safely
            </h2>
            <ol className="mt-5 space-y-3 text-slate-300">
              <li className="rounded-2xl bg-white/[0.03] px-4 py-3">Save the original code and freeze-frame data before clearing anything.</li>
              <li className="rounded-2xl bg-white/[0.03] px-4 py-3">Use the result as an inspection order, not as proof that a part is bad.</li>
              <li className="rounded-2xl bg-white/[0.03] px-4 py-3">Confirm power, ground, signal, vacuum, pressure or mechanical condition before replacing expensive parts.</li>
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Best for</h2>
            <p className="text-slate-300 leading-relaxed">{tool.primaryUse}</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Search demand</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {tool.relatedQueries.map(query => <li key={query}>• {query}</li>)}
            </ul>
          </div>
          <Link href={`/${locale}/symptoms`} className="flex items-center justify-between rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 text-blue-100 hover:bg-blue-500/15">
            <span className="font-black flex items-center gap-2">
              <SearchCheck className="w-5 h-5" />
              Diagnose by symptom
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href={`/${locale}/editorial-policy`} className="flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.03] p-6 text-slate-200 hover:bg-white/[0.06]">
            <span className="font-black flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-300" />
              Methodology
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </aside>
      </section>
    </main>
  );
}
