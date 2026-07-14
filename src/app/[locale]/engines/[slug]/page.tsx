import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { engineProfiles, getEngineProfile } from '@/data/engine-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export function generateStaticParams() {
  return engineProfiles.flatMap(engine => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: engine.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const engine = getEngineProfile(slug);
  if (!engine) return {};
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: `${engine.manufacturer} ${engine.family} ${copy.engineTitleSuffix}`,
    description: copy.engineMetaDescription(engine.family),
    alternates: getAlternates(`engines/${slug}`, locale),
  };
}

export default async function EnginePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const engine = getEngineProfile(slug);
  if (!engine) notFound();
  const copy = getKnowledgeUiCopy(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <Link href={`/${locale}/engines`} className="text-sm text-slate-500 hover:text-white">{copy.engineDatabaseShort}</Link>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white">{engine.manufacturer} {engine.family}</h1>
          <p className="mt-5 text-lg text-slate-400">{engine.configuration} / {engine.displacement} / {engine.production}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <Panel title={copy.specifications} items={[`${copy.inductionLabel}: ${engine.induction}`, `${copy.timingDriveLabel}: ${engine.timingDrive}`, `${copy.oilTypeLabel}: ${engine.oilType}`, `${copy.oilCapacityLabel}: ${engine.oilCapacity}`]} />
          <Panel title={copy.commonFailures} items={engine.commonFailures} />
          <Panel title={copy.maintenanceFocus} items={engine.maintenance} />
        </div>
        <aside className="space-y-6">
          <Panel title={copy.reliabilityScore} items={[engine.reliabilityScore]} />
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.relatedCodes}</h2>
            <div className="grid grid-cols-2 gap-3">
              {engine.relatedCodes.map(code => <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200">{code}</Link>)}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6"><h2 className="text-2xl font-black text-white">{title}</h2><ul className="mt-5 space-y-3">{items.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>)}</ul></section>;
}
