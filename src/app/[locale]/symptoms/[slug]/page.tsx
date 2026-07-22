import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Activity, AlertTriangle, ArrowRight, Gauge, ShieldAlert, Wrench } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { getSymptomBySlug, localizeSymptom, symptomGuides } from '@/data/symptoms';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';
import { getCodeHubPath } from '@/data/gsc-seo';

export function generateStaticParams() {
  return symptomGuides.flatMap(symptom => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: symptom.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const symptom = getSymptomBySlug(slug);
  if (!symptom) return {};
  const localized = localizeSymptom(symptom, locale);
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: `${localized.title} - ${copy.mostLikelyCauses}, ${copy.relatedObdCodes}`,
    description: localized.description,
    alternates: getAlternates(`symptoms/${slug}`, locale),
  };
}

export default async function SymptomPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const symptom = getSymptomBySlug(slug);
  if (!symptom) notFound();
  const localized = localizeSymptom(symptom, locale);
  const copy = getKnowledgeUiCopy(locale);

  const faq = [
    {
      q: copy.safeToDriveQuestion(localized.title),
      a: localized.driveAdvice,
    },
    {
      q: copy.relatedCodesQuestion(localized.title),
      a: symptom.relatedCodes.join(', '),
    },
  ];

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: localized.title,
      description: localized.description,
      dateModified: '2026-07-14',
      about: symptom.relatedSystems,
      mainEntityOfPage: `https://obd2hq.com/${locale}/symptoms/${slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="hero-visual hero-visual-symptom border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">OBD2HQ</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/symptoms`} className="hover:text-white">{copy.symptoms}</Link>
          </nav>
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200 mb-5">
                <ShieldAlert className="w-4 h-4" />
                {copy.severity}: {symptom.severity}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">{localized.title}</h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-3xl">{localized.description}</p>
            </div>
            <aside className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
              <h2 className="text-lg font-black text-red-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {copy.driveAdvice}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-red-100/80">{localized.driveAdvice}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <InfoBlock icon={<Activity className="w-5 h-5" />} title={copy.mostLikelyCauses} items={localized.likelyCauses} />
          <InfoBlock icon={<Wrench className="w-5 h-5" />} title={copy.firstChecks} items={localized.firstChecks} />
          <InfoBlock icon={<Gauge className="w-5 h-5" />} title={copy.relatedSystems} items={localized.relatedSystems} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.relatedObdCodes}</h2>
            <div className="grid grid-cols-2 gap-3">
              {symptom.relatedCodes.map(code => (
                <Link key={code} href={getCodeHubPath(locale, code)} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200 hover:bg-blue-500/20">
                  {code}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.searchIntentsCovered}</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {localized.searchIntents.map(intent => <li key={intent}>- {intent}</li>)}
            </ul>
          </div>

          <Link href={`/${locale}/tools/diagnostic-assistant`} className="flex items-center justify-between rounded-3xl border border-green-400/20 bg-green-500/10 p-6 text-green-100 hover:bg-green-500/15">
            <span className="font-black">{copy.openDiagnosticAssistant}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </aside>
      </section>
    </main>
  );
}

function InfoBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-2xl font-black text-white flex items-center gap-3">
        <span className="text-blue-400">{icon}</span>
        {title}
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map(item => (
          <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>
        ))}
      </ul>
    </section>
  );
}
