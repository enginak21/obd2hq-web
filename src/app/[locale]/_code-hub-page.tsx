import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AlertTriangle, BadgeCheck, Gauge, Link2, SearchCheck } from 'lucide-react';
import { baseCodes, cars, getLocalized, type OBD2Code } from '@/data/db';
import { getLocalizedCodeDescription, getLocalizedCodeTitle } from '@/data/code-localization';
import { applyGoldObdFallback } from '@/data/obd-gold-content';
import { getLocalizedRegistryCopy, getObdGoldRegistryEntry } from '@/data/obd-registry';
import { getRelatedCodes } from '@/data/seo';
import { fitSeoDescription, fitSeoTitle } from '@/utils/seo';
import { getCodeHubAlternates, getCodeHubCopy, getCodeHubPath, isKnownCode } from '@/data/gsc-seo';

type PageProps = {
  params: Promise<{
    locale: string;
    code: string;
  }>;
};

function titleCase(value: string) {
  return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function getVehicleTargets(code: string) {
  const codeSpecific: Record<string, Array<{ make: string; model: string }>> = {
    P0213: [{ make: 'ford', model: 'focus' }, { make: 'ford', model: 'f-150' }],
    P0235: [{ make: 'suzuki', model: 'jimny' }, { make: 'ford', model: 'focus' }],
    P0243: [{ make: 'suzuki', model: 'jimny' }, { make: 'ford', model: 'focus' }],
    P0251: [{ make: 'ford', model: 'focus' }, { make: 'ford', model: 'f-150' }],
    P0122: [{ make: 'toyota', model: 'camry' }, { make: 'lexus', model: 'rx' }],
  };
  const preferred = [
    ...(codeSpecific[code] || []),
    { make: 'ford', model: 'focus' },
    { make: 'suzuki', model: 'jimny' },
    { make: 'toyota', model: 'camry' },
    { make: 'honda', model: 'civic' },
    { make: 'nissan', model: 'altima' },
    { make: 'ford', model: 'f-150' },
  ];
  const uniquePreferred = preferred.filter((target, index, list) => (
    list.findIndex(item => item.make === target.make && item.model === target.model) === index
  ));
  const valid = uniquePreferred.filter(target => cars.some(car => car.make === target.make && car.models.includes(target.model)));
  return valid.slice(0, 5).map(target => ({
    ...target,
    href: `/en/${target.make}/${target.model}/${code.toLowerCase()}`,
    label: `${titleCase(target.make)} ${titleCase(target.model)} ${code}`,
  }));
}

function getCoveredSearches(code: string, locale: string) {
  const searches: Record<string, string[]> = {
    P0213: ['p0213', 'p0213 ford', 'ford focus p0213'],
    P0235: ['p0235 suzuki', 'suzuki jimny p0235', 'turbo boost sensor p0235'],
    P0243: ['p0243 suzuki', 'suzuki jimny p0243', 'wastegate solenoid p0243'],
    P0251: ['p0251 ford', 'ford focus p0251', 'injection pump metering control p0251'],
    P0122: ['toyota/lexus error p0122', 'toyota camry p0122', 'lexus rx p0122'],
  };
  const fallback = [`${code.toLowerCase()} code`, `${code.toLowerCase()} symptoms`, `${code.toLowerCase()} causes`];
  const title = locale === 'tr'
    ? 'Bu sayfanın karşıladığı aramalar'
    : locale === 'de'
      ? 'Abgedeckte Suchanfragen'
      : locale === 'es'
        ? 'Búsquedas cubiertas'
        : locale === 'fr'
          ? 'Recherches couvertes'
          : 'Searches this page covers';
  const note = locale === 'tr'
    ? 'Bu ifadeler ayrı ayrı ince sayfa açmadan aynı rehber içinde doğal şekilde cevaplanır.'
    : locale === 'de'
      ? 'Diese Suchanfragen werden ohne dünne Einzelseiten in diesem Ratgeber beantwortet.'
      : locale === 'es'
        ? 'Estas consultas se responden en esta guía sin crear páginas débiles separadas.'
        : locale === 'fr'
          ? 'Ces requêtes sont traitées dans ce guide sans créer de pages faibles séparées.'
          : 'These queries are answered in this guide without creating thin duplicate pages.';
  return { title, note, items: searches[code] || fallback };
}

function asLocalizedArray(value: unknown, locale: string) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    const record = value as Record<string, string[]>;
    return record[locale] || record.en || [];
  }
  return [];
}

function codeHubLabels(locale: string) {
  if (locale === 'tr') {
    return {
      firstChecks: 'İlk kontroller',
      relatedCodes: 'İlgili kodlar',
      symptoms: 'Yaygın belirtiler:',
      causes: 'Olası nedenler:',
      symptomFallback: 'Motor arıza lambası, sürüşte değişiklik',
      causeFallback: 'Kablo, soket, sensör veya sistem arızası',
      diagnosticPath: 'teşhis sırası',
      verifyRepair: 'Onarımdan önce doğrula',
      opportunityBadge: 'Search Console fırsatı',
      signalsTitle: 'Karşılaştırılacak sinyaller',
      system: 'Sistem:',
    };
  }
  if (locale === 'de') {
    return {
      firstChecks: 'Erste Prüfungen',
      relatedCodes: 'Verwandte Codes',
      symptoms: 'Häufige Symptome:',
      causes: 'Mögliche Ursachen:',
      symptomFallback: 'Motorkontrollleuchte, verändertes Fahrverhalten',
      causeFallback: 'Kabel, Stecker, Sensor oder Systemfehler',
      diagnosticPath: 'Diagnoseablauf',
      verifyRepair: 'Vor der Reparatur prüfen',
      opportunityBadge: 'Search-Console-Chance',
      signalsTitle: 'Signale zum Abgleichen',
      system: 'System:',
    };
  }
  if (locale === 'es') {
    return {
      firstChecks: 'Primeras revisiones',
      relatedCodes: 'Códigos relacionados',
      symptoms: 'Síntomas comunes:',
      causes: 'Causas probables:',
      symptomFallback: 'Luz de motor, cambio en el comportamiento del vehículo',
      causeFallback: 'Cableado, conector, sensor o falla del sistema',
      diagnosticPath: 'ruta de diagnóstico',
      verifyRepair: 'Verificar antes de reparar',
      opportunityBadge: 'Oportunidad en Search Console',
      signalsTitle: 'Señales para comparar',
      system: 'Sistema:',
    };
  }
  if (locale === 'fr') {
    return {
      firstChecks: 'Premiers contrôles',
      relatedCodes: 'Codes associés',
      symptoms: 'Symptômes fréquents :',
      causes: 'Causes probables :',
      symptomFallback: 'Voyant moteur, changement de comportement',
      causeFallback: 'Câblage, connecteur, capteur ou défaut système',
      diagnosticPath: 'parcours de diagnostic',
      verifyRepair: 'Vérifier avant réparation',
      opportunityBadge: 'Opportunité Search Console',
      signalsTitle: 'Signaux à comparer',
      system: 'Système :',
    };
  }
  return {
    firstChecks: 'First checks',
    relatedCodes: 'Related codes',
    symptoms: 'Common symptoms:',
    causes: 'Likely causes:',
    symptomFallback: 'Check engine light, drivability change',
    causeFallback: 'Wiring, connector, sensor or system fault',
    diagnosticPath: 'diagnostic path',
    verifyRepair: 'Verify before repair',
    opportunityBadge: 'Search Console opportunity',
    signalsTitle: 'Signals to compare',
    system: 'System:',
  };
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, code } = await params;
  const upperCode = code.toUpperCase();
  if (!isKnownCode(upperCode)) return { title: 'Code Not Found' };
  const copy = getCodeHubCopy(locale, upperCode);
  return {
    title: fitSeoTitle(copy.title),
    description: fitSeoDescription(copy.meta),
    alternates: getCodeHubAlternates(upperCode, locale),
  };
}

export default async function CodeHubPage({ params }: PageProps) {
  const { locale, code } = await params;
  const upperCode = code.toUpperCase();
  const baseCode = (baseCodes as Record<string, Partial<OBD2Code>>)[upperCode];
  if (!baseCode) notFound();
  const rawCode = applyGoldObdFallback({ ...baseCode, code: upperCode });

  const copy = getCodeHubCopy(locale, upperCode);
  const labels = codeHubLabels(locale);
  const tDb = await getTranslations({ locale, namespace: 'DB' });
  const registryCopy = getLocalizedRegistryCopy(locale, getObdGoldRegistryEntry(upperCode), 'OBD2', upperCode);
  const rawTitle = getLocalized(rawCode.title, locale) || upperCode;
  const rawDescription = getLocalized(rawCode.description, locale) || copy.intro;
  const localizedTitle = getLocalizedCodeTitle(upperCode, locale, String(rawTitle));
  const localizedDescription = getLocalizedCodeDescription(upperCode, locale, String(rawDescription));
  const causes = Array.isArray(rawCode.causes) ? rawCode.causes.slice(0, 6).map(cause => cause.startsWith('cause_') ? tDb(cause) : cause) : [];
  const symptoms = Array.isArray(rawCode.symptoms) ? rawCode.symptoms.slice(0, 6).map(symptom => symptom.startsWith('symp_') ? tDb(symptom) : symptom) : [];
  const diagnosticSteps = asLocalizedArray(rawCode.diagnosticSteps, locale).slice(0, 6);
  const commonFixes = asLocalizedArray(rawCode.commonFixes, locale).slice(0, 4);
  const relatedCodes = getRelatedCodes(upperCode, Object.keys(baseCodes as Record<string, unknown>), 6);
  const vehicleTargets = getVehicleTargets(upperCode);
  const coveredSearches = getCoveredSearches(upperCode, locale);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: copy.h1, item: `https://obd2hq.com${getCodeHubPath(locale, upperCode)}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: copy.faqQ, acceptedAnswer: { '@type': 'Answer', text: copy.faqA } },
      { '@type': 'Question', name: `What is ${upperCode}?`, acceptedAnswer: { '@type': 'Answer', text: localizedDescription } },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: copy.title,
    description: copy.meta,
    author: { '@type': 'Organization', name: 'OBD2HQ Editorial Team' },
    publisher: { '@type': 'Organization', name: 'OBD2HQ' },
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, articleSchema]) }} />
      <header className="hero-visual hero-visual-code relative overflow-hidden border-b border-white/5 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href={`/${locale}`} className="hover:text-blue-300">OBD2HQ</Link>
            <span>/</span>
            <span className="text-white">{upperCode}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-200">
              <SearchCheck size={16} />
              {labels.opportunityBadge}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{copy.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{copy.intro}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 pt-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-1 text-green-300" />
            <div>
              <h2 className="text-2xl font-bold text-white">{localizedTitle}</h2>
              <p className="mt-3 leading-7 text-slate-300">{localizedDescription}</p>
              <div className="mt-5 rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
                <h2 className="text-base font-bold text-blue-100">{registryCopy.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{registryCopy.source}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <span className="rounded-lg bg-black/20 px-3 py-2 text-sm text-slate-300">{registryCopy.family}</span>
                  <span className="rounded-lg bg-black/20 px-3 py-2 text-sm text-slate-300">{registryCopy.standard}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-black/20 p-4">
              <h2 className="text-lg font-bold text-white">{labels.firstChecks}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                {copy.firstChecks.map(item => <li key={item}>- {item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-black/20 p-4">
              <h2 className="text-lg font-bold text-white">{labels.relatedCodes}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedCodes.map(related => (
                  <Link key={related} href={getCodeHubPath(locale, related)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100 hover:bg-blue-500/20">
                    {related}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="text-amber-200" />
              <p className="text-sm leading-6 text-amber-50">{copy.warning}</p>
            </div>
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white"><Gauge size={20} /> {labels.signalsTitle}</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div><span className="font-semibold text-slate-100">{labels.system}</span> {copy.system}</div>
              <div><span className="font-semibold text-slate-100">{labels.symptoms}</span> {symptoms.join(', ') || labels.symptomFallback}</div>
              <div><span className="font-semibold text-slate-100">{labels.causes}</span> {causes.join(', ') || labels.causeFallback}</div>
            </div>
          </section>
        </aside>
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-2xl font-bold text-white">{upperCode} {labels.diagnosticPath}</h2>
            <ol className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              {diagnosticSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-100">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-2xl font-bold text-white">{labels.verifyRepair}</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
              {commonFixes.map((fix) => (
                <li key={fix}>- {fix}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Link2 size={22} /> {copy.relatedTitle}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vehicleTargets.map(target => (
              <Link key={target.href} href={target.href.replace('/en/', `/${locale}/`)} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-slate-100 hover:border-blue-400/40">
                {target.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-2xl font-bold text-white">{coveredSearches.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{coveredSearches.note}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {coveredSearches.items.map(item => (
              <span key={item} className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

