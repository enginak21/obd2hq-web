import Link from 'next/link';
import { AlertTriangle, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { localizeSymptom, symptomGuides } from '@/data/symptoms';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.symptomsMetaTitle,
    description: copy.symptomsMetaDescription,
    alternates: getAlternates('symptoms', locale),
  };
}

export default async function SymptomsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.symptomsMetaTitle.replace(' - OBD2HQ', ''),
    url: `https://www.obd2hq.com/${locale}/symptoms`,
    about: copy.symptomsEyebrow,
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200 mb-6">
            <ShieldCheck className="w-4 h-4" />
            {copy.symptomsEyebrow}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">
            {copy.symptomsTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">
            {copy.symptomsDescription}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-5">
          {symptomGuides.map((symptom) => {
            const localized = localizeSymptom(symptom, locale);
            return (
              <Link
                key={symptom.slug}
                href={`/${locale}/symptoms/${symptom.slug}`}
                className="group rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-blue-500/40 hover:bg-[#17213a] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                      {symptom.severity}
                    </div>
                    <h2 className="text-2xl font-black text-white group-hover:text-blue-100">{localized.title}</h2>
                    <p className="mt-3 text-slate-400 leading-relaxed">{localized.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {symptom.relatedCodes.slice(0, 4).map(code => (
                    <span key={code} className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-200">{code}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-white/5 bg-white/[0.03] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-green-400" />
              {copy.knowCodeAlready}
            </h2>
            <p className="text-slate-400 mt-2">{copy.knowCodeDescription}</p>
          </div>
          <Link href={`/${locale}/search`} className="inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 px-5 py-3 font-bold text-white">
            {copy.openCodeSearch}
          </Link>
        </div>
      </section>
    </main>
  );
}
