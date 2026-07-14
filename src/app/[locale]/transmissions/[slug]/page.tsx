import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { getTransmissionProfile, transmissionProfiles } from '@/data/transmission-database';

export function generateStaticParams() {
  return transmissionProfiles.flatMap(transmission => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: transmission.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const transmission = getTransmissionProfile(slug);
  if (!transmission) return {};
  return {
    title: `${transmission.maker} ${transmission.family} Transmission Fluid, Problems and Codes`,
    description: `${transmission.family} transmission database: applications, fluid, service notes, common failures and related diagnostic codes.`,
    alternates: getAlternates(`transmissions/${slug}`, locale),
  };
}

export default async function TransmissionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const transmission = getTransmissionProfile(slug);
  if (!transmission) notFound();
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <Link href={`/${locale}/transmissions`} className="text-sm text-slate-500 hover:text-white">Transmission database</Link>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white">{transmission.maker} {transmission.family}</h1>
          <p className="mt-5 text-lg text-slate-400">{transmission.type} • {transmission.gears}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <Panel title="Applications" items={transmission.applications} />
          <Panel title="Fluid and service notes" items={[`Fluid: ${transmission.fluid}`, ...transmission.serviceNotes]} />
          <Panel title="Common failures" items={transmission.commonFailures} />
        </div>
        <aside className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 h-fit">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Related codes</h2>
          <div className="grid grid-cols-2 gap-3">
            {transmission.relatedCodes.map(code => <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200">{code}</Link>)}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6"><h2 className="text-2xl font-black text-white">{title}</h2><ul className="mt-5 space-y-3">{items.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>)}</ul></section>;
}
