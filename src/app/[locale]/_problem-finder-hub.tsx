import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ProblemFinderClient from '@/components/ProblemFinderClient';
import {
  ProblemFinderLocale,
  getProblemFinderAlternates,
  getProblemFinderDetailPath,
  getProblemFinderHubLabel,
  getProblemFinderHubPath,
  isProblemFinderLocale,
  publishedProblemFinderIntents,
} from '@/data/problem-finder';

const metaCopy: Record<ProblemFinderLocale, { title: string; description: string }> = {
  en: {
    title: 'Car Problem Finder: Diagnose Symptoms Without an OBD Code',
    description: 'Describe what your car is doing and get likely causes, first checks, safety advice and related OBD2 codes.',
  },
  tr: {
    title: 'ArÄ±za Bulucu: OBD Kodu Bilmeden AraÃ§ Sorununu Anla',
    description: 'AracÄ±ndaki sorunu gÃ¼nlÃ¼k dille yaz; olasÄ± nedenleri, ilk kontrolleri, gÃ¼venlik uyarÄ±sÄ±nÄ± ve ilgili OBD2 kodlarÄ±nÄ± gÃ¶r.',
  },
  de: {
    title: 'Auto Problemfinder: Symptome ohne OBD-Code verstehen',
    description: 'Beschreiben Sie das Problem und erhalten Sie Ursachen, erste PrÃ¼fungen, Sicherheitshinweise und passende OBD2-Codes.',
  },
  es: {
    title: 'Buscador de fallas: diagnostica sÃ­ntomas sin cÃ³digo OBD',
    description: 'Describe quÃ© hace tu coche y recibe causas probables, primeras revisiones, seguridad y cÃ³digos OBD2 relacionados.',
  },
  fr: {
    title: 'Trouver une panne: comprendre un symptÃ´me sans code OBD',
    description: 'DÃ©crivez le problÃ¨me et obtenez causes probables, contrÃ´les, sÃ©curitÃ© et codes OBD2 liÃ©s.',
  },
};

export async function generateProblemFinderHubMetadata(locale: string): Promise<Metadata> {
  if (!isProblemFinderLocale(locale)) return {};
  return {
    title: metaCopy[locale].title,
    description: metaCopy[locale].description,
    alternates: {
      canonical: getProblemFinderHubPath(locale),
      ...getProblemFinderAlternates(),
    },
  };
}

export default function ProblemFinderHubPage({ locale }: { locale: string }) {
  if (!isProblemFinderLocale(locale)) notFound();
  setRequestLocale(locale);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: getProblemFinderHubLabel(locale), item: `https://obd2hq.com${getProblemFinderHubPath(locale)}` },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: getProblemFinderHubLabel(locale),
    applicationCategory: 'AutomotiveDiagnosticApplication',
    operatingSystem: 'Web',
    url: `https://obd2hq.com${getProblemFinderHubPath(locale)}`,
    description: metaCopy[locale].description,
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, appSchema]) }} />
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <ProblemFinderClient locale={locale} />

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">{getProblemFinderHubLabel(locale)}</p>
              <h2 className="mt-2 text-3xl font-black text-white">
                {locale === 'tr' ? 'TÃ¼m arÄ±za yollarÄ±' : 'All problem paths'}
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publishedProblemFinderIntents.map((intent) => (
              <Link
                key={intent.intentKey}
                href={getProblemFinderDetailPath(locale, intent)}
                className="rounded-2xl border border-white/10 bg-[#111a2b] p-5 hover:border-blue-400/40"
              >
                <h3 className="text-lg font-black text-white">{intent.titles[locale]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{intent.plainExplanation[locale]}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
