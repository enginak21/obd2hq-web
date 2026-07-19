import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ProblemFinderIntent,
  ProblemFinderLocale,
  getProblemFinderAlternates,
  getProblemFinderDetailPath,
  getProblemFinderHubLabel,
  getProblemFinderHubPath,
  getProblemFinderIntentBySlug,
  isProblemFinderLocale,
  publishedProblemFinderIntents,
} from '@/data/problem-finder';
import { fitSeoDescription, fitSeoTitle } from '@/utils/seo';

const sectionLabels: Record<ProblemFinderLocale, {
  causes: string;
  checks: string;
  replace: string;
  drive: string;
  codes: string;
  related: string;
  faq: string;
  home: string;
}> = {
  en: { causes: 'Most likely causes', checks: 'First checks', replace: 'Do not replace yet', drive: 'Can I drive?', codes: 'Related OBD2 codes', related: 'Related problem paths', faq: 'FAQ', home: 'Home' },
  tr: { causes: 'En olası nedenler', checks: 'İlk kontroller', replace: 'Hemen değiştirme', drive: 'Bu halde sürülür mü?', codes: 'İlgili OBD2 kodları', related: 'İlgili arıza yolları', faq: 'Sık sorulan sorular', home: 'Anasayfa' },
  de: { causes: 'Wahrscheinliche Ursachen', checks: 'Erste Prüfungen', replace: 'Noch nicht ersetzen', drive: 'Kann ich fahren?', codes: 'Verwandte OBD2-Codes', related: 'Ähnliche Fehlerpfade', faq: 'FAQ', home: 'Startseite' },
  es: { causes: 'Causas probables', checks: 'Primeras revisiones', replace: 'No cambies todavía', drive: '¿Se puede conducir?', codes: 'Códigos OBD2 relacionados', related: 'Rutas relacionadas', faq: 'FAQ', home: 'Inicio' },
  fr: { causes: 'Causes probables', checks: 'Premiers contrôles', replace: 'Ne remplacez pas encore', drive: 'Puis-je rouler ?', codes: 'Codes OBD2 liés', related: 'Pistes liées', faq: 'FAQ', home: 'Accueil' },
};

function getDescription(intent: ProblemFinderIntent, locale: ProblemFinderLocale) {
  return `${intent.titles[locale]}: ${intent.plainExplanation[locale]} ${intent.firstChecks[locale][0]}`;
}

export function generateProblemFinderDetailStaticParams(locale: ProblemFinderLocale) {
  return publishedProblemFinderIntents.map((intent) => ({ slug: intent.slugs[locale] }));
}

export async function generateProblemFinderDetailMetadata(locale: string, slug: string): Promise<Metadata> {
  if (!isProblemFinderLocale(locale)) return {};
  const intent = getProblemFinderIntentBySlug(locale, slug);
  if (!intent) return {};
  return {
    title: fitSeoTitle(intent.titles[locale]),
    description: fitSeoDescription(getDescription(intent, locale)),
    alternates: {
      canonical: getProblemFinderDetailPath(locale, intent),
      ...getProblemFinderAlternates(intent),
    },
  };
}

export default function ProblemFinderDetailPage({ locale, slug }: { locale: string; slug: string }) {
  if (!isProblemFinderLocale(locale)) notFound();
  const intent = getProblemFinderIntentBySlug(locale, slug);
  if (!intent) notFound();
  setRequestLocale(locale);
  const labels = sectionLabels[locale];
  const related = intent.relatedSymptoms
    .map((intentKey) => publishedProblemFinderIntents.find((item) => item.intentKey === intentKey))
    .filter((item): item is ProblemFinderIntent => Boolean(item))
    .slice(0, 4);

  const faqs = [
    {
      question: intent.titles[locale],
      answer: intent.plainExplanation[locale],
    },
    {
      question: labels.drive,
      answer: intent.safeToDrive[locale],
    },
    {
      question: labels.replace,
      answer: intent.doNotReplaceYet[locale],
    },
  ];

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: labels.home, item: `https://www.obd2hq.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: getProblemFinderHubLabel(locale), item: `https://www.obd2hq.com${getProblemFinderHubPath(locale)}` },
        { '@type': 'ListItem', position: 3, name: intent.titles[locale], item: `https://www.obd2hq.com${getProblemFinderDetailPath(locale, intent)}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: intent.titles[locale],
      description: fitSeoDescription(getDescription(intent, locale)),
      about: intent.titles[locale],
      author: { '@type': 'Organization', name: 'OBD2HQ Editorial Team' },
      publisher: { '@type': 'Organization', name: 'OBD2HQ' },
      mainEntityOfPage: `https://www.obd2hq.com${getProblemFinderDetailPath(locale, intent)}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: intent.titles[locale],
      step: intent.firstChecks[locale].map((check, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: check,
        text: check,
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <article className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
        <nav className="mb-8 flex flex-wrap gap-2 text-sm font-bold text-slate-400">
          <Link href={`/${locale}`} className="hover:text-white">{labels.home}</Link>
          <span>/</span>
          <Link href={getProblemFinderHubPath(locale)} className="hover:text-white">{getProblemFinderHubLabel(locale)}</Link>
        </nav>

        <header className="hero-visual hero-visual-symptom rounded-[28px] border border-white/10 bg-[#101827] p-6 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-300">{getProblemFinderHubLabel(locale)}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl">{intent.titles[locale]}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{intent.plainExplanation[locale]}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {intent.relatedCodes.map((code) => (
              <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-full bg-blue-500/15 px-3 py-1 text-sm font-black text-blue-200">{code}</Link>
            ))}
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-white/10 bg-[#111a2b] p-6">
              <h2 className="text-2xl font-black text-white">{labels.causes}</h2>
              <ul className="mt-4 grid gap-3">
                {intent.likelyCauses[locale].map((cause) => (
                  <li key={cause} className="rounded-xl bg-[#070c16] px-4 py-3 text-sm font-semibold text-slate-300">{cause}</li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#111a2b] p-6">
              <h2 className="text-2xl font-black text-white">{labels.checks}</h2>
              <ol className="mt-4 grid gap-3">
                {intent.firstChecks[locale].map((check, index) => (
                  <li key={check} className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300">
                    <span className="mr-2 text-blue-300">{index + 1}.</span>{check}
                  </li>
                ))}
              </ol>
            </section>
            <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
              <h2 className="text-2xl font-black text-white">{labels.drive}</h2>
              <p className="mt-3 leading-7 text-slate-300">{intent.safeToDrive[locale]}</p>
              <h2 className="mt-6 text-2xl font-black text-white">{labels.replace}</h2>
              <p className="mt-3 leading-7 text-slate-300">{intent.doNotReplaceYet[locale]}</p>
            </section>
          </div>
          <aside className="space-y-4">
            <section className="rounded-2xl border border-white/10 bg-[#111a2b] p-5">
              <h2 className="text-lg font-black text-white">{labels.codes}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {intent.relatedCodes.map((code) => (
                  <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-full bg-white/10 px-3 py-1 text-sm font-black text-slate-200">{code}</Link>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#111a2b] p-5">
              <h2 className="text-lg font-black text-white">{labels.related}</h2>
              <div className="mt-3 grid gap-2">
                {related.map((item) => (
                  <Link key={item.intentKey} href={getProblemFinderDetailPath(locale, item)} className="rounded-xl bg-white/5 p-3 text-sm font-bold text-slate-300 hover:text-white">
                    {item.titles[locale]}
                  </Link>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-white/10 bg-[#111a2b] p-5">
              <h2 className="text-lg font-black text-white">{labels.faq}</h2>
              <div className="mt-3 space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="rounded-xl bg-white/5 p-3">
                    <summary className="cursor-pointer text-sm font-black text-white">{faq.question}</summary>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
