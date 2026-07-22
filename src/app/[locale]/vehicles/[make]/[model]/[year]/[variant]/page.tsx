import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';
import {
  getVehicleKnowledge,
} from '@/data/vehicle-knowledge';
import { getVehicleSpecRecord } from '@/data/vehicle-spec-records';
import { getVehicleSpecQualityLabel } from '@/data/vehicle-quality';
import validRoutes from '@/data/valid_routes.json';

type VariantLabels = {
  metaSuffix: string;
  metaDescription: (name: string, engine: string, oil: string) => string;
  exactVariant: string;
  engineIdentity: string;
  engineCodes: string;
  engineSummary: string;
  displacement: string;
  power: string;
  torque: string;
  fuelSystem: string;
  timingDrive: string;
  fluids: string;
  differentialFluid: string;
  serviceAndParts: string;
  manualTransmission: string;
  automaticTransmission: string;
  sparkPlugs: string;
  serviceInterval: string;
  commonProblems: string;
  firstChecks: string;
  notes: string;
  sourceNotes: string;
  verifyByVin: string;
  repairPrep: string;
  repairPrepScan: string;
  repairPrepFluid: string;
  repairPrepVerify: string;
  faqTitle: string;
  engineQuestion: (name: string) => string;
  engineAnswer: (name: string, engine: string, summary: string) => string;
  oilQuestion: (name: string) => string;
  oilAnswer: (name: string, oil: string, capacity: string) => string;
  problemQuestion: (name: string) => string;
  problemAnswer: (name: string, problems: string) => string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;
const VALID_CODE_SET = new Set((validRoutes.validCodes as string[]).map((code) => code.toUpperCase()));

export async function generateMetadata({ params }: { params: Promise<{ locale: string; make: string; model: string; year: string; variant: string }> }) {
  const { locale, make, model, year, variant } = await params;
  const trim = getVehicleSpecRecord(make, model, year, variant);
  if (!trim) return {};
  const name = formatVariantName(trim);
  const labels = getVariantLabels(locale);

  return {
    title: `${name} ${labels.metaSuffix}`,
    description: labels.metaDescription(name, trim.engineCodes.join(', '), trim.oilCapacity),
    alternates: getAlternates(`vehicles/${make}/${model}/${year}/${variant}`, locale),
  };
}

export default async function VehicleVariantPage({ params }: { params: Promise<{ locale: string; make: string; model: string; year: string; variant: string }> }) {
  const { locale, make, model, year, variant } = await params;
  setRequestLocale(locale);
  const vehicle = getVehicleKnowledge(make, model);
  const trim = getVehicleSpecRecord(make, model, year, variant);
  if (!trim) notFound();

  const copy = getKnowledgeUiCopy(locale);
  const labels = getVariantLabels(locale);
  const vehicleName = trim.displayName;
  const pageName = formatVariantName(trim);
  const qualityLabel = getVehicleSpecQualityLabel(trim);
  const faqItems = [
    {
      question: labels.engineQuestion(pageName),
      answer: labels.engineAnswer(pageName, trim.engineCodes.join(', '), trim.engineSummary),
    },
    {
      question: labels.oilQuestion(pageName),
      answer: labels.oilAnswer(pageName, trim.recommendedOil, trim.oilCapacity),
    },
    {
      question: labels.problemQuestion(pageName),
      answer: labels.problemAnswer(pageName, trim.commonProblems.slice(0, 4).join(', ')),
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: copy.vehicleDatabaseShort, item: `https://obd2hq.com/${locale}/vehicles` },
          { '@type': 'ListItem', position: 3, name: vehicleName, item: `https://obd2hq.com/${locale}/vehicles/${make}/${model}` },
          { '@type': 'ListItem', position: 4, name: pageName, item: `https://obd2hq.com/${locale}/vehicles/${make}/${model}/${year}/${variant}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'TechArticle',
        headline: `${pageName} engine code, oil capacity and service data`,
        description: labels.metaDescription(pageName, trim.engineCodes.join(', '), trim.oilCapacity),
        about: {
          '@type': 'Thing',
          name: pageName,
          description: `${pageName} engine, oil, transmission and service profile`,
        },
        inLanguage: locale,
        dateModified: '2026-07-16',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="hero-visual hero-visual-vehicle border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href={`/${locale}/vehicles`} className="hover:text-white">{copy.vehicleDatabaseShort}</Link>
            <span>/</span>
            <Link href={`/${locale}/vehicles/${make}/${model}`} className="hover:text-white">{vehicleName}</Link>
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white">{pageName}</h1>
          <p className="mt-5 text-lg text-slate-400">{trim.chassisCode} / {trim.bodyStyle} / {trim.market}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {trim.engineCodes.map(code => <span key={code} className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">{code}</span>)}
            <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">{labels.exactVariant}</span>
            <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200">{qualityLabel}</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{labels.engineIdentity}</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              <Spec label={labels.engineCodes} value={trim.engineCodes.join(', ')} />
              <Spec label={labels.engineSummary} value={trim.engineSummary} />
              <Spec label={labels.displacement} value={trim.displacement} />
              <Spec label={labels.power} value={trim.power} />
              <Spec label={labels.torque} value={trim.torque} />
              <Spec label={labels.fuelSystem} value={trim.fuelSystem} />
              <Spec label={labels.timingDrive} value={trim.timingDrive} />
              <Spec label={copy.obdPortLabel} value={vehicle?.obdPortLocation || labels.verifyByVin} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{labels.fluids}</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              <Spec label={copy.oilTypeLabel} value={trim.recommendedOil} />
              <Spec label={copy.oilCapacityLabel} value={trim.oilCapacity} />
              <Spec label={copy.coolantLabel} value={trim.coolantCapacity} />
              <Spec label={copy.fluidLabel} value={trim.transmissionFluid} />
              <Spec label={labels.differentialFluid} value={trim.differentialFluid} />
              <Spec label={copy.brakeFluidLabel} value={trim.brakeFluid} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{labels.serviceAndParts}</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              {trim.manualTransmission && <Spec label={labels.manualTransmission} value={trim.manualTransmission} />}
              {trim.automaticTransmission && <Spec label={labels.automaticTransmission} value={trim.automaticTransmission} />}
              <Spec label={labels.sparkPlugs} value={trim.sparkPlugs} />
              <Spec label={labels.serviceInterval} value={trim.serviceInterval} />
              <Spec label={copy.tireSizesLabel} value={trim.tireSizes.join(', ')} />
              <Spec label={copy.wheelTorqueLabel} value={vehicle?.wheelTorque || labels.verifyByVin} />
            </div>
          </section>

          <Panel title={labels.commonProblems} items={trim.commonProblems} />
          <Panel title={labels.firstChecks} items={trim.firstChecks} />
          <Panel title={labels.repairPrep} items={[
            labels.repairPrepScan,
            labels.repairPrepFluid,
            labels.repairPrepVerify,
          ]} />
          <Panel title={labels.notes} items={trim.notes} />
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.commonCodes}</h2>
            <div className="grid grid-cols-2 gap-3">
              {trim.relatedCodes.filter(code => VALID_CODE_SET.has(code.toUpperCase())).map(code => (
                <Link key={code} href={`/${locale}/${make}/${model}/${code.toLowerCase()}`} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200 hover:bg-blue-500/20">
                  {code}
                </Link>
              ))}
            </div>
          </section>
          <Panel title={labels.sourceNotes} items={trim.sourceNotes} />
          <Panel title={copy.compatibleTools} items={vehicle?.compatibleTools || [labels.verifyByVin]} />
          <Panel title={labels.faqTitle} items={faqItems.map(item => `${item.question} ${item.answer}`)} />
        </aside>
      </section>
    </main>
  );
}

function getVariantLabels(locale: string): VariantLabels {
  if (locale === 'tr') {
    return {
      metaSuffix: 'motor kodu, yaÄŸ kapasitesi ve teknik servis bilgileri',
      metaDescription: (name: string, engine: string, oil: string) => `${name} iÃ§in motor kodu ${engine}, motor yaÄŸÄ± kapasitesi ${oil}, ÅŸanzÄ±man, bakÄ±m ve kronik arÄ±za bilgileri.`,
      exactVariant: 'YÄ±l/kasa Ã¶zel kayÄ±t',
      engineIdentity: 'Motor kimliÄŸi',
      engineCodes: 'Motor kodu',
      engineSummary: 'Motor Ã¶zeti',
      displacement: 'Motor hacmi',
      power: 'GÃ¼Ã§',
      torque: 'Tork',
      fuelSystem: 'YakÄ±t sistemi',
      timingDrive: 'Triger sistemi',
      fluids: 'YaÄŸlar ve sÄ±vÄ±lar',
      differentialFluid: 'Diferansiyel yaÄŸÄ±',
      serviceAndParts: 'Servis ve parÃ§a bilgileri',
      manualTransmission: 'Manuel ÅŸanzÄ±man',
      automaticTransmission: 'Otomatik ÅŸanzÄ±man',
      sparkPlugs: 'Buji bilgisi',
      serviceInterval: 'Servis aralÄ±ÄŸÄ±',
      commonProblems: 'Kronik ve sÄ±k gÃ¶rÃ¼len sorunlar',
      firstChecks: 'Ä°lk kontrol edilmesi gerekenler',
      notes: 'Ã–nemli notlar',
      sourceNotes: 'Kaynak ve doÄŸrulama notlarÄ±',
      verifyByVin: 'VIN ve pazara gÃ¶re doÄŸrulanmalÄ±',
      repairPrep: 'ParÃ§a deÄŸiÅŸtirmeden Ã¶nce',
      repairPrepScan: 'ArÄ±za kodlarÄ±nÄ± ve freeze-frame verisini kaydedin; kodlarÄ± silmeden Ã¶nce mevcut durumu not alÄ±n.',
      repairPrepFluid: 'YaÄŸ, soÄŸutma sÄ±vÄ±sÄ± ve ÅŸanzÄ±man sÄ±vÄ±sÄ± seviyesini doÄŸru sÄ±caklÄ±k/prosedÃ¼rle kontrol edin.',
      repairPrepVerify: 'PahalÄ± parÃ§a deÄŸiÅŸiminden Ã¶nce gÃ¼Ã§, ÅŸase, soket, hortum, kaÃ§ak ve canlÄ± veri kontrollerini doÄŸrulayÄ±n.',
      faqTitle: 'SÄ±k sorulan sorular',
      engineQuestion: (name: string) => `${name} motor kodu nedir?`,
      engineAnswer: (name: string, engine: string, summary: string) => `${name} iÃ§in bu kayÄ±tta gÃ¶rÃ¼nen motor kodu ${engine}; motor Ã¶zeti: ${summary}.`,
      oilQuestion: (name: string) => `${name} motor yaÄŸÄ± ve kapasitesi nedir?`,
      oilAnswer: (name: string, oil: string, capacity: string) => `${name} iÃ§in listelenen motor yaÄŸÄ± ${oil}, kapasite ${capacity}. Pazar ve motor seÃ§eneÄŸini doÄŸrulayÄ±n.`,
      problemQuestion: (name: string) => `${name} iÃ§in sÄ±k sorunlar nelerdir?`,
      problemAnswer: (name: string, problems: string) => `${name} iÃ§in Ã¶ne Ã§Ä±kan kontroller: ${problems}.`,
    };
  }
  if (locale === 'de') {
    return {
      ...getVariantLabels('en'),
      metaSuffix: 'Motorcode, Ã–lmenge und Servicedaten',
      metaDescription: (name: string, engine: string, oil: string) => `${name}: Motorcode ${engine}, Ã–lmenge ${oil}, Getriebe, Wartung und bekannte Probleme.`,
      exactVariant: 'Exakter Jahres-/Varianten-Datensatz',
      repairPrep: 'Vor dem Teiletausch',
      faqTitle: 'HÃ¤ufige Fragen',
    };
  }
  if (locale === 'es') {
    return {
      ...getVariantLabels('en'),
      metaSuffix: 'cÃ³digo de motor, aceite y datos de servicio',
      metaDescription: (name: string, engine: string, oil: string) => `${name}: cÃ³digo de motor ${engine}, capacidad de aceite ${oil}, transmisiÃ³n, mantenimiento y problemas conocidos.`,
      exactVariant: 'Registro exacto de aÃ±o/versiÃ³n',
      repairPrep: 'Antes de cambiar piezas',
      faqTitle: 'Preguntas frecuentes',
    };
  }
  if (locale === 'fr') {
    return {
      ...getVariantLabels('en'),
      metaSuffix: 'code moteur, huile et donnÃ©es de service',
      metaDescription: (name: string, engine: string, oil: string) => `${name}: code moteur ${engine}, capacitÃ© dâ€™huile ${oil}, transmission, entretien et problÃ¨mes connus.`,
      exactVariant: 'Fiche exacte annÃ©e/version',
      repairPrep: 'Avant de remplacer des piÃ¨ces',
      faqTitle: 'Questions frÃ©quentes',
    };
  }

  return {
    metaSuffix: 'engine code, oil capacity and service data',
    metaDescription: (name: string, engine: string, oil: string) => `${name} engine code ${engine}, engine oil capacity ${oil}, transmission, maintenance and known problem data.`,
    exactVariant: 'Exact year/trim record',
    engineIdentity: 'Engine identity',
    engineCodes: 'Engine code',
    engineSummary: 'Engine summary',
    displacement: 'Displacement',
    power: 'Power',
    torque: 'Torque',
    fuelSystem: 'Fuel system',
    timingDrive: 'Timing drive',
    fluids: 'Oils and fluids',
    differentialFluid: 'Differential fluid',
    serviceAndParts: 'Service and parts data',
    manualTransmission: 'Manual transmission',
    automaticTransmission: 'Automatic transmission',
    sparkPlugs: 'Spark plugs',
    serviceInterval: 'Service interval',
    commonProblems: 'Common and chronic problems',
    firstChecks: 'First checks',
    notes: 'Important notes',
    sourceNotes: 'Source and verification notes',
    verifyByVin: 'Verify by VIN and market',
    repairPrep: 'Before replacing parts',
    repairPrepScan: 'Save fault codes and freeze-frame data before clearing anything.',
    repairPrepFluid: 'Check engine oil, coolant and transmission fluid using the correct temperature and service procedure.',
    repairPrepVerify: 'Verify power, ground, connectors, hoses, leaks and live data before replacing expensive parts.',
    faqTitle: 'FAQ',
    engineQuestion: (name: string) => `What engine code does the ${name} use?`,
    engineAnswer: (name: string, engine: string, summary: string) => `${name} is listed here with engine code ${engine}; engine summary: ${summary}.`,
    oilQuestion: (name: string) => `What oil and capacity does the ${name} use?`,
    oilAnswer: (name: string, oil: string, capacity: string) => `${name} is listed with ${oil} and oil capacity ${capacity}. Confirm market and engine option before service.`,
    problemQuestion: (name: string) => `What are common ${name} problems?`,
    problemAnswer: (name: string, problems: string) => `Highlighted checks for ${name}: ${problems}.`,
  };
}

function formatVariantName(trim: NonNullable<ReturnType<typeof getVehicleSpecRecord>>) {
  const engineCodes = trim.engineCodes.slice(0, 2).join('/');
  const chassis = trim.chassisCode || trim.generation;
  const trimLabel = trim.trim && trim.trim !== 'technical-profile' ? ` ${trim.trim}` : '';
  const engineLabel = engineCodes ? ` ${engineCodes}` : '';
  const chassisLabel = chassis ? ` (${chassis})` : '';
  return `${trim.year} ${trim.displayName}${trimLabel}${engineLabel}${chassisLabel}`;
}
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0a0f1c] px-3 py-2">
      <dt className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-200">{value}</dd>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>)}
      </ul>
    </section>
  );
}
