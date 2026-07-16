import Link from 'next/link';
import { AlertTriangle, ArrowRight, Gauge, Search, ShieldAlert, Wrench } from 'lucide-react';
import {
  getSymptomContentDetailPath,
  getSymptomContentHubPath,
  publishedSymptomContentGroups,
  type LocalizedSymptomContent,
  type SymptomContentGroup,
  type SymptomContentLocale,
} from '@/data/symptom-content';

const hubCopy = {
  en: {
    eyebrow: 'Symptom-first repair guides',
    title: 'Find the fault before you know the code.',
    description: 'Search-friendly guides for drivers who type real problems into Google: loss of power, shaking, fuel smell, hard start, smoke, noises and warning lights.',
    search: 'Popular symptom searches',
    open: 'Open guide',
  },
  tr: {
    eyebrow: 'Belirti odaklı arıza rehberleri',
    title: 'Kodu bilmeden arızanın yönünü bulun.',
    description: 'Google’a gerçek kullanıcı diliyle yazılan aramalar için rehberler: gaz yemiyor, titriyor, geç çalışıyor, duman atıyor, motordan ses geliyor ve uyarı lambaları.',
    search: 'Popüler belirti aramaları',
    open: 'Rehberi aç',
  },
  de: {
    eyebrow: 'Symptomorientierte Reparaturführer',
    title: 'Fehler finden, bevor der Code bekannt ist.',
    description: 'Ratgeber für echte Suchanfragen: keine Leistung, Ruckeln, Kraftstoffgeruch, Startprobleme, Rauch, Geräusche und Warnleuchten.',
    search: 'Beliebte Symptom-Suchen',
    open: 'Ratgeber öffnen',
  },
  es: {
    eyebrow: 'Guías por síntoma',
    title: 'Encuentra la falla antes de conocer el código.',
    description: 'Guías para búsquedas reales: no acelera, vibra, olor a gasolina, arranque difícil, humo, ruidos y luces de advertencia.',
    search: 'Búsquedas populares',
    open: 'Abrir guía',
  },
  fr: {
    eyebrow: 'Guides par symptôme',
    title: 'Trouvez la panne avant de connaître le code.',
    description: 'Guides pour recherches réelles : manque de puissance, vibrations, odeur carburant, démarrage difficile, fumée, bruits et voyants.',
    search: 'Recherches populaires',
    open: 'Ouvrir le guide',
  },
};

const detailCopy = {
  en: { drive: 'Drive advice', causes: 'Most likely causes', checks: 'First checks', steps: 'Diagnostic flow', mistakes: 'Common mistakes', codes: 'Related OBD2 codes', links: 'Related guides', faq: 'FAQ' },
  tr: { drive: 'Sürüş önerisi', causes: 'En olası nedenler', checks: 'İlk kontroller', steps: 'Teşhis akışı', mistakes: 'Sık yapılan hatalar', codes: 'İlgili OBD2 kodları', links: 'İlgili rehberler', faq: 'Sık sorulan sorular' },
  de: { drive: 'Fahrempfehlung', causes: 'Wahrscheinliche Ursachen', checks: 'Erste Prüfungen', steps: 'Diagnoseablauf', mistakes: 'Häufige Fehler', codes: 'Verwandte OBD2-Codes', links: 'Verwandte Ratgeber', faq: 'FAQ' },
  es: { drive: 'Consejo de manejo', causes: 'Causas probables', checks: 'Primeras revisiones', steps: 'Flujo de diagnóstico', mistakes: 'Errores comunes', codes: 'Códigos OBD2 relacionados', links: 'Guías relacionadas', faq: 'Preguntas frecuentes' },
  fr: { drive: 'Conseil de conduite', causes: 'Causes probables', checks: 'Premiers contrôles', steps: 'Parcours diagnostic', mistakes: 'Erreurs fréquentes', codes: 'Codes OBD2 liés', links: 'Guides liés', faq: 'FAQ' },
};

export function SymptomContentHub({ locale }: { locale: SymptomContentLocale }) {
  const copy = hubCopy[locale];

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    description: copy.description,
    url: `https://www.obd2hq.com${getSymptomContentHubPath(locale)}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: publishedSymptomContentGroups.map((group, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: group.locales[locale].title,
        url: `https://www.obd2hq.com${getSymptomContentDetailPath(group, locale)}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200 mb-6">
            <Search className="w-4 h-4" />
            {copy.eyebrow}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">{copy.title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">{copy.description}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-white mb-5">{copy.search}</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {publishedSymptomContentGroups.map(group => {
            const item = group.locales[locale];
            return (
              <Link key={group.contentGroupId} href={getSymptomContentDetailPath(group, locale)} className="group rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-amber-400/40 hover:bg-[#17213a] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                      {item.severity}
                    </div>
                    <h2 className="text-2xl font-black text-white group-hover:text-amber-100">{item.title}</h2>
                    <p className="mt-3 text-slate-400 leading-relaxed">{item.metaDescription}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-300 shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.relatedCodes.slice(0, 5).map(code => <span key={code} className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-200">{code}</span>)}
                </div>
                <span className="mt-5 inline-flex text-sm font-bold text-amber-200">{copy.open}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export function SymptomContentDetail({ locale, group }: { locale: SymptomContentLocale; group: SymptomContentGroup }) {
  const item = group.locales[locale];
  const copy = detailCopy[locale];
  const schema = buildSchema(locale, group, item);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">OBD2HQ</Link>
            <span className="mx-2">/</span>
            <Link href={getSymptomContentHubPath(locale)} className="hover:text-white">{hubCopy[locale].eyebrow}</Link>
          </nav>
          <div className="grid lg:grid-cols-[1fr_330px] gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200 mb-5">
                <ShieldAlert className="w-4 h-4" />
                {item.severity}
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">{item.title}</h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-3xl">{item.intro}</p>
            </div>
            <aside className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
              <h2 className="text-lg font-black text-red-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {copy.drive}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-red-100/80">{item.driveAdvice}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <InfoBlock icon={<Gauge className="w-5 h-5" />} title={copy.causes} items={item.likelyCauses} />
          <InfoBlock icon={<Wrench className="w-5 h-5" />} title={copy.checks} items={item.firstChecks} />
          <NumberedBlock title={copy.steps} items={item.diagnosticSteps} />
          <InfoBlock icon={<AlertTriangle className="w-5 h-5" />} title={copy.mistakes} items={item.commonMistakes} />
        </div>
        <aside className="space-y-6">
          <CodeLinks title={copy.codes} locale={locale} codes={item.relatedCodes} />
          <GuideLinks title={copy.links} links={item.internalLinks} />
          <FaqBlock title={copy.faq} faq={item.faq} />
        </aside>
      </section>
    </main>
  );
}

function InfoBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-2xl font-black text-white flex items-center gap-3"><span className="text-blue-400">{icon}</span>{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>)}
      </ul>
    </section>
  );
}

function NumberedBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <ol className="mt-5 space-y-3">
        {items.map((item, index) => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300"><span className="mr-3 font-black text-blue-300">{index + 1}</span>{item}</li>)}
      </ol>
    </section>
  );
}

function CodeLinks({ title, locale, codes }: { title: string; locale: string; codes: string[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {codes.map(code => <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200 hover:bg-blue-500/20">{code}</Link>)}
      </div>
    </section>
  );
}

function GuideLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{title}</h2>
      <div className="space-y-3">
        {links.map(link => <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-200 hover:bg-white/[0.06]"><span className="font-bold">{link.label}</span><ArrowRight className="w-4 h-4 text-blue-300" /></Link>)}
      </div>
    </section>
  );
}

function FaqBlock({ title, faq }: { title: string; faq: { q: string; a: string }[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{title}</h2>
      <div className="space-y-3">
        {faq.map(item => (
          <article key={item.q} className="rounded-2xl bg-white/[0.03] px-4 py-3">
            <h3 className="font-black text-white">{item.q}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function buildSchema(locale: SymptomContentLocale, group: SymptomContentGroup, item: LocalizedSymptomContent) {
  const path = getSymptomContentDetailPath(group, locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: item.schemaTitle,
        description: item.schemaDescription,
        dateModified: '2026-07-17',
        inLanguage: locale,
        about: [group.make, group.symptomKey, ...item.relatedCodes],
        mainEntityOfPage: `https://www.obd2hq.com${path}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: hubCopy[locale].eyebrow, item: `https://www.obd2hq.com${getSymptomContentHubPath(locale)}` },
          { '@type': 'ListItem', position: 3, name: item.title, item: `https://www.obd2hq.com${path}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: item.faq.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
      {
        '@type': 'HowTo',
        name: item.title,
        description: item.metaDescription,
        step: item.diagnosticSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text: step,
        })),
      },
    ],
  };
}
