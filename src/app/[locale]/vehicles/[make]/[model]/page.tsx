import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { getVehicleKnowledge, type VehicleKnowledgeProfile } from '@/data/vehicle-knowledge';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';
import { getVehicleSpecRecordsForModel, type VehicleSpecRecord } from '@/data/vehicle-spec-records';
import { getVehicleSpecQualityLabel } from '@/data/vehicle-quality';
import validRoutes from '@/data/valid_routes.json';

type VehicleVariantRow = NonNullable<VehicleKnowledgeProfile['yearTrimVariants']>[number];
const VALID_CODE_SET = new Set((validRoutes.validCodes as string[]).map((code) => code.toUpperCase()));
type VehicleLabels = {
  metaTitle: (name: string) => string;
  coverage: string;
  generations: string;
  engineVariants: string;
  transmissionVariants: string;
  sparkPlugs: string;
  diagnosticCodes: string;
  commonFailurePatterns: string;
  serviceNote: string;
  affectedYears: string;
  symptoms: string;
  firstChecks: string;
  related: string;
  dataQuality: string;
  yearTrimSelector: string;
  yearTrimSelectorDesc: string;
  verifiedVariants: string;
  openVariant: string;
  engineCodesByYear: string;
  oilCapacityByEngine: string;
  year: string;
  trim: string;
  engineCodes: string;
  displacement: string;
  fuelSystem: string;
  identifyEngineCode: string;
  identifyVin: string;
  identifySticker: string;
  identifyScanTool: string;
  faqTitle: string;
  verifyExactVariant: string;
  engineCodeQuestion: (name: string) => string;
  engineCodeAnswer: (name: string, codes: string) => string;
  oilQuestion: (name: string) => string;
  oilAnswer: (name: string, oils: string) => string;
  problemQuestion: (name: string) => string;
  problemAnswer: (name: string, problems: string) => string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; make: string; model: string }> }) {
  const { locale, make, model } = await params;
  const vehicle = getVehicleKnowledge(make, model) || buildVehicleProfileFromSpecs(make, model);
  if (!vehicle) return {};
  const name = `${vehicle.make} ${vehicle.model}`.replace(/\b\w/g, c => c.toUpperCase());
  const copy = getKnowledgeUiCopy(locale);
  const labels = getVehicleLabels(locale);
  return {
    title: fitSeoTitle(labels.metaTitle(name)),
    description: fitSeoDescription(copy.vehicleMetaDescription(name, vehicle.generation)),
    alternates: getAlternates(`vehicles/${make}/${model}`, locale),
  };
}

export default async function VehicleProfilePage({ params }: { params: Promise<{ locale: string; make: string; model: string }> }) {
  const { locale, make, model } = await params;
  setRequestLocale(locale);
  const vehicle = getVehicleKnowledge(make, model) || buildVehicleProfileFromSpecs(make, model);
  if (!vehicle) notFound();
  const name = vehicle.displayName || `${vehicle.make} ${vehicle.model}`.replace(/\b\w/g, c => c.toUpperCase());
  const copy = getKnowledgeUiCopy(locale);
  const labels = getVehicleLabels(locale);
  const variants = vehicle.yearTrimVariants || [];
  const engineRows = buildEngineRows(variants);
  const oilRows = buildOilRows(variants);
  const problemRows = buildProblemRows(variants);
  const faqItems = [
    {
      question: labels.engineCodeQuestion(name),
      answer: engineRows.length > 0 ? labels.engineCodeAnswer(name, engineRows.slice(0, 4).map(row => row.engineCodes).join(', ')) : labels.verifyExactVariant,
    },
    {
      question: labels.oilQuestion(name),
      answer: oilRows.length > 0 ? labels.oilAnswer(name, oilRows.slice(0, 4).map(row => `${row.engineCodes}: ${row.oil}`).join('; ')) : labels.verifyExactVariant,
    },
    {
      question: labels.problemQuestion(name),
      answer: problemRows.length > 0 ? labels.problemAnswer(name, problemRows.slice(0, 5).map(row => row.problem).join(', ')) : labels.verifyExactVariant,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: copy.vehicleDatabaseShort, item: `https://www.obd2hq.com/${locale}/vehicles` },
          { '@type': 'ListItem', position: 3, name, item: `https://www.obd2hq.com/${locale}/vehicles/${make}/${model}` },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${name} ${labels.yearTrimSelector}`,
        itemListElement: variants.slice(0, 50).map((variant, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: formatVariantName(variant, name),
          url: `https://www.obd2hq.com/${locale}/vehicles/${make}/${model}/${variant.year}/${variant.slug}`,
        })),
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
        headline: `${name} engine codes, oil capacity and common problems`,
        description: copy.vehicleMetaDescription(name, vehicle.generation),
        about: {
          '@type': 'Thing',
          name,
          description: `${name} vehicle technical guide`,
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
          <Link href={`/${locale}/vehicles`} className="text-sm text-slate-500 hover:text-white">{copy.vehicleDatabaseShort}</Link>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white">{name}</h1>
          <p className="mt-5 text-lg text-slate-400">{vehicle.generation} / {vehicle.years} / {vehicle.bodyStyle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(vehicle.markets || []).map(market => <span key={market} className="rounded-lg bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">{market}</span>)}
            <span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs font-bold text-green-200">{labels.coverage}: {vehicle.coverageLevel || 'seed'}</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          {vehicle.yearRanges && <Timeline title={labels.generations} rows={vehicle.yearRanges.map(row => ({
            title: `${row.years} - ${row.generation}`,
            body: row.facelift ? `${row.facelift}. ${row.notes}` : row.notes,
          }))} />}

          {vehicle.yearTrimVariants && (
            <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">{labels.yearTrimSelector}</h2>
                  <p className="mt-2 text-sm text-slate-400">{labels.yearTrimSelectorDesc}</p>
                </div>
                <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">{vehicle.yearTrimVariants.length} {labels.verifiedVariants}</span>
              </div>
              <div className="mt-5 space-y-3">
                {vehicle.yearTrimVariants.map(variant => (
                  <Link
                    key={`${variant.year}-${variant.slug}`}
                    href={`/${locale}/vehicles/${vehicle.make}/${vehicle.model}/${variant.year}/${variant.slug}`}
                    className="block rounded-2xl bg-white/[0.03] p-4 hover:bg-white/[0.06]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-black text-white">{formatVariantName(variant, name)}</h3>
                        <p className="mt-1 text-sm text-slate-400">{variant.chassisCode} / {variant.engineCodes.join(', ')} / {variant.engineSummary}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200">{getVariantQualityLabel(variant)}</span>
                        <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">{labels.openVariant}</span>
                      </div>
                    </div>
                    <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs font-bold text-slate-300">
                      <span>{copy.oilTypeLabel}: {variant.recommendedOil}</span>
                      <span>{copy.oilCapacityLabel}: {variant.oilCapacity}</span>
                      <span>{labels.related}: {variant.relatedCodes.slice(0, 4).join(', ')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {engineRows.length > 0 && (
            <DataTable
              title={labels.engineCodesByYear}
              columns={[labels.year, labels.trim, labels.engineCodes, labels.displacement, labels.fuelSystem]}
              rows={engineRows.slice(0, 80).map(row => [row.year, row.trim, row.engineCodes, row.displacement, row.fuelSystem])}
            />
          )}

          {oilRows.length > 0 && (
            <DataTable
              title={labels.oilCapacityByEngine}
              columns={[labels.year, labels.engineCodes, copy.oilTypeLabel, copy.oilCapacityLabel, copy.fluidLabel]}
              rows={oilRows.slice(0, 80).map(row => [row.year, row.engineCodes, row.oil, row.capacity, row.transmission])}
            />
          )}

          {vehicle.engineVariants && (
            <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
              <h2 className="text-2xl font-black text-white">{labels.engineVariants}</h2>
              <div className="mt-5 space-y-4">
                {vehicle.engineVariants.map(engine => (
                  <article key={engine.code} className="rounded-2xl bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white">{engine.code} - {engine.name}</h3>
                        <p className="mt-1 text-sm text-slate-400">{engine.years} / {engine.displacement} / {engine.fuel} / {engine.induction}</p>
                      </div>
                      <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">{engine.timingDrive}</span>
                    </div>
                    <dl className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <Spec label={copy.oilTypeLabel} value={engine.oilViscosity} />
                      <Spec label={copy.oilCapacityLabel} value={engine.oilCapacity} />
                      {engine.sparkPlugInterval && <Spec label={labels.sparkPlugs} value={engine.sparkPlugInterval} />}
                      <Spec label={labels.diagnosticCodes} value={engine.relatedCodes.join(', ')} />
                    </dl>
                    <p className="mt-4 text-slate-300 leading-relaxed">{engine.notes}</p>
                    <ChipList title={labels.commonFailurePatterns} items={engine.commonIssues} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {vehicle.transmissionVariants && (
            <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
              <h2 className="text-2xl font-black text-white">{labels.transmissionVariants}</h2>
              <div className="mt-5 space-y-4">
                {vehicle.transmissionVariants.map(transmission => (
                  <article key={transmission.code} className="rounded-2xl bg-white/[0.03] p-5">
                    <h3 className="text-xl font-black text-white">{transmission.code} - {transmission.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{transmission.years} / {transmission.type}</p>
                    <dl className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                      <Spec label={copy.fluidLabel} value={transmission.fluid} />
                      <Spec label={labels.serviceNote} value={transmission.serviceNote} />
                      <Spec label={labels.diagnosticCodes} value={transmission.relatedCodes.join(', ')} />
                    </dl>
                    <ChipList title={labels.commonFailurePatterns} items={transmission.commonIssues} />
                  </article>
                ))}
              </div>
            </section>
          )}

          <Panel title={copy.technicalSpecifications} items={[
            `${copy.enginesLabel}: ${vehicle.engines.join(', ')}`,
            `${copy.transmissionsLabel}: ${vehicle.transmissions.join(', ')}`,
            `${copy.tireSizesLabel}: ${vehicle.tireSizes.join(', ')}`,
            `${copy.boltPatternLabel}: ${vehicle.boltPattern}`,
            `${copy.wheelTorqueLabel}: ${vehicle.wheelTorque}`,
            `${copy.batteryLabel}: ${vehicle.battery}`,
          ]} />
          <Panel title={copy.fluidsServiceData} items={[
            `${copy.engineOilLabel}: ${vehicle.engineOil}`,
            `${copy.transmissionFluidLabel}: ${vehicle.transmissionFluid}`,
            `${copy.coolantLabel}: ${vehicle.coolant}`,
            `${copy.brakeFluidLabel}: ${vehicle.brakeFluid}`,
          ]} />

          {vehicle.serviceIntervals && (
            <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
              <h2 className="text-2xl font-black text-white">{copy.maintenanceScheduleFocus}</h2>
              <div className="mt-5 space-y-3">
                {vehicle.serviceIntervals.map(item => (
                  <article key={item.item} className="rounded-2xl bg-white/[0.03] px-4 py-3">
                    <h3 className="font-black text-white">{item.item}</h3>
                    <p className="mt-1 text-sm font-bold text-blue-200">{item.interval}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.notes}</p>
                    {item.relatedCodes.length > 0 && <p className="mt-2 text-xs font-bold text-slate-500">{labels.related}: {item.relatedCodes.join(', ')}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {vehicle.chronicProblems ? (
            <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
              <h2 className="text-2xl font-black text-white">{copy.knownProblems}</h2>
              <div className="mt-5 space-y-4">
                {vehicle.chronicProblems.map(problem => (
                  <article key={problem.title} className="rounded-2xl bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-xl font-black text-white">{problem.title}</h3>
                      <span className="rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200">{problem.severity}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{labels.affectedYears}: {problem.affectedYears}</p>
                    <ChipList title={labels.symptoms} items={problem.symptoms} />
                    <ChipList title={labels.firstChecks} items={problem.firstChecks} />
                    <p className="mt-3 text-xs font-bold text-blue-200">{labels.related}: {problem.relatedCodes.join(', ')}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <Panel title={copy.knownProblems} items={vehicle.knownProblems} />
          )}
        </div>
        <aside className="space-y-6">
          <Panel title={copy.obdAccess} items={[`${copy.obdPortLabel}: ${vehicle.obdPortLocation}`, `${copy.fuseBoxLabel}: ${vehicle.fuseBox}`]} />
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.commonCodes}</h2>
            <div className="grid grid-cols-2 gap-3">
              {vehicle.commonCodes.map(code => (
                <Link key={code} href={`/${locale}/${vehicle.make}/${vehicle.model}/${code.toLowerCase()}`} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200 hover:bg-blue-500/20">
                  {code}
                </Link>
              ))}
            </div>
          </div>
          <Panel title={copy.compatibleTools} items={vehicle.compatibleTools} />
          {vehicle.diagnosticNotes && vehicle.diagnosticNotes.map(note => (
            <section key={note.system} className="rounded-3xl border border-blue-400/10 bg-blue-500/5 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-blue-200">{note.system}</p>
              <h2 className="mt-2 text-lg font-black text-white">{note.priority}</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {note.notes.map(item => <li key={item}>- {item}</li>)}
              </ul>
              <p className="mt-4 text-xs font-bold text-blue-200">{labels.related}: {note.relatedCodes.join(', ')}</p>
            </section>
          ))}
          {vehicle.sourceNotes && <Panel title={labels.dataQuality} items={vehicle.sourceNotes} />}
          <Panel title={labels.identifyEngineCode} items={[
            labels.identifyVin,
            labels.identifySticker,
            labels.identifyScanTool,
          ]} />
          <Panel title={labels.faqTitle} items={faqItems.map(item => `${item.question} ${item.answer}`)} />
        </aside>
      </section>
    </main>
  );
}

function formatVariantName(variant: VehicleVariantRow, vehicleName: string) {
  const engineCodes = variant.engineCodes.slice(0, 2).join('/');
  const chassis = variant.chassisCode;
  const trimLabel = variant.trim && variant.trim !== 'technical-profile' ? ` ${variant.trim}` : '';
  const engineLabel = engineCodes ? ` ${engineCodes}` : '';
  const chassisLabel = chassis ? ` (${chassis})` : '';
  return `${variant.year} ${vehicleName}${trimLabel}${engineLabel}${chassisLabel}`;
}

function getVehicleLabels(locale: string): VehicleLabels {
  if (locale === 'tr') {
    return {
      metaTitle: (name: string) => `${name} motor kodları, yağ kapasitesi ve kronik sorunlar`,
      coverage: 'Kapsam',
      generations: 'Yıl ve jenerasyon haritası',
      engineVariants: 'Motor kodları ve varyantlar',
      transmissionVariants: 'Şanzıman varyantları',
      sparkPlugs: 'Buji aralığı',
      diagnosticCodes: 'İlgili arıza kodları',
      commonFailurePatterns: 'Yaygın arıza desenleri',
      serviceNote: 'Servis notu',
      affectedYears: 'Etkilenen yıllar',
      symptoms: 'Belirtiler',
      firstChecks: 'İlk kontroller',
      related: 'İlgili',
      dataQuality: 'Veri kalitesi ve doğrulama notu',
      yearTrimSelector: 'Yıl ve kasa seçimi',
      yearTrimSelectorDesc: 'Net motor, yağ ve servis bilgisi için yılı ve kasayı seçin.',
      verifiedVariants: 'doğrulanmış varyant',
      openVariant: 'Detayı aç',
      engineCodesByYear: 'Yıla göre motor kodları',
      oilCapacityByEngine: 'Motora göre yağ kapasitesi',
      year: 'Yıl',
      trim: 'Kasa/versiyon',
      engineCodes: 'Motor kodları',
      displacement: 'Motor hacmi',
      fuelSystem: 'Yakıt sistemi',
      identifyEngineCode: 'Motor kodunu nasıl doğrularsınız?',
      identifyVin: 'Ruhsat, VIN etiketi veya üretici servis kaydı motor seçeneğini doğrulamak için en güvenli başlangıçtır.',
      identifySticker: 'Motor bölmesindeki etiketler, emisyon etiketi ve servis geçmişi motor ailesini doğrulamaya yardımcı olur.',
      identifyScanTool: 'Canlı veri okuyabilen bir OBD2 cihazı motor kontrol ünitesi ve ilgili kodları kontrol etmek için kullanılabilir.',
      faqTitle: 'Sık sorulan sorular',
      verifyExactVariant: 'Kesin bilgi için yıl, motor, pazar ve kasa seçeneği birlikte doğrulanmalıdır.',
      engineCodeQuestion: (name: string) => `${name} motor kodları nelerdir?`,
      engineCodeAnswer: (name: string, codes: string) => `${name} için rehberde görünen başlıca motor kodları: ${codes}. Kesin motor kodunu yıl ve kasa seçimiyle doğrulayın.`,
      oilQuestion: (name: string) => `${name} hangi motor yağını kullanır?`,
      oilAnswer: (name: string, oils: string) => `${name} yağ bilgisi motor seçeneğine göre değişir. Rehberdeki özet: ${oils}.`,
      problemQuestion: (name: string) => `${name} için sık görülen sorunlar nelerdir?`,
      problemAnswer: (name: string, problems: string) => `${name} sayfasında öne çıkan kontroller: ${problems}. Arıza kodu varsa ilgili OBD2 rehberine geçin.`,
    };
  }
  if (locale === 'de') {
    return {
      ...getVehicleLabels('en'),
      metaTitle: (name: string) => `${name} Motorcodes, Ölmenge und häufige Probleme`,
      coverage: 'Abdeckung',
      engineCodesByYear: 'Motorcodes nach Jahr',
      oilCapacityByEngine: 'Ölmenge nach Motor',
      year: 'Jahr',
      trim: 'Variante',
      engineCodes: 'Motorcodes',
      displacement: 'Hubraum',
      fuelSystem: 'Kraftstoffsystem',
      identifyEngineCode: 'Wie Sie den Motorcode prüfen',
      faqTitle: 'Häufige Fragen',
    };
  }
  if (locale === 'es') {
    return {
      ...getVehicleLabels('en'),
      metaTitle: (name: string) => `${name} códigos de motor, aceite y problemas comunes`,
      coverage: 'Cobertura',
      engineCodesByYear: 'Códigos de motor por año',
      oilCapacityByEngine: 'Capacidad de aceite por motor',
      year: 'Año',
      trim: 'Versión',
      engineCodes: 'Códigos de motor',
      displacement: 'Cilindrada',
      fuelSystem: 'Sistema de combustible',
      identifyEngineCode: 'Cómo confirmar el código de motor',
      faqTitle: 'Preguntas frecuentes',
    };
  }
  if (locale === 'fr') {
    return {
      ...getVehicleLabels('en'),
      metaTitle: (name: string) => `${name} codes moteur, huile et problèmes fréquents`,
      coverage: 'Couverture',
      engineCodesByYear: 'Codes moteur par année',
      oilCapacityByEngine: 'Capacité d’huile par moteur',
      year: 'Année',
      trim: 'Version',
      engineCodes: 'Codes moteur',
      displacement: 'Cylindrée',
      fuelSystem: 'Système carburant',
      identifyEngineCode: 'Comment confirmer le code moteur',
      faqTitle: 'Questions fréquentes',
    };
  }
  return {
    metaTitle: (name: string) => `${name} Engine Codes, Oil Capacity and Common Problems`,
    coverage: 'Coverage',
    generations: 'Year and generation map',
    engineVariants: 'Engine codes and variants',
    transmissionVariants: 'Transmission variants',
    sparkPlugs: 'Spark plug interval',
    diagnosticCodes: 'Related diagnostic codes',
    commonFailurePatterns: 'Common failure patterns',
    serviceNote: 'Service note',
    affectedYears: 'Affected years',
    symptoms: 'Symptoms',
    firstChecks: 'First checks',
    related: 'Related',
    dataQuality: 'Data quality and verification note',
    yearTrimSelector: 'Year and trim selector',
    yearTrimSelectorDesc: 'Choose the exact year and trim to see engine, oil and service details.',
    verifiedVariants: 'verified variants',
    openVariant: 'Open details',
    engineCodesByYear: 'Engine codes by year',
    oilCapacityByEngine: 'Oil capacity by engine',
    year: 'Year',
    trim: 'Trim',
    engineCodes: 'Engine codes',
    displacement: 'Displacement',
    fuelSystem: 'Fuel system',
    identifyEngineCode: 'How to identify your engine code',
    identifyVin: 'Start with the VIN, registration data or manufacturer service information when exact engine identity matters.',
    identifySticker: 'Under-hood labels, emissions labels and service history can confirm the engine family and market equipment.',
    identifyScanTool: 'A scanner with live data can confirm ECU information and connect the vehicle profile to related OBD2 codes.',
    faqTitle: 'FAQ',
    verifyExactVariant: 'Exact data should be verified by year, market, engine and trim.',
    engineCodeQuestion: (name: string) => `What engine codes does the ${name} use?`,
    engineCodeAnswer: (name: string, codes: string) => `The ${name} profiles currently show these main engine codes: ${codes}. Choose the exact year and trim to confirm the engine.`,
    oilQuestion: (name: string) => `What oil does the ${name} use?`,
    oilAnswer: (name: string, oils: string) => `${name} oil specification varies by engine and market. This guide lists: ${oils}.`,
    problemQuestion: (name: string) => `What are common ${name} problems?`,
    problemAnswer: (name: string, problems: string) => `Common checks highlighted for ${name}: ${problems}. If an OBD2 code is present, open the related code guide.`,
  };
}

function getVariantQualityLabel(variant: VehicleVariantRow) {
  return 'make' in variant && 'model' in variant && 'displayName' in variant && 'generation' in variant
    ? getVehicleSpecQualityLabel(variant as VehicleSpecRecord)
    : 'Verified';
}

function buildEngineRows(variants: VehicleVariantRow[]) {
  return variants.map(variant => ({
    year: String(variant.year),
    trim: variant.trim,
    engineCodes: variant.engineCodes.join(', '),
    displacement: variant.displacement,
    fuelSystem: variant.fuelSystem,
  }));
}

function buildOilRows(variants: VehicleVariantRow[]) {
  return variants.map(variant => ({
    year: String(variant.year),
    engineCodes: variant.engineCodes.join(', '),
    oil: variant.recommendedOil,
    capacity: variant.oilCapacity,
    transmission: variant.transmissionFluid,
  }));
}

function buildProblemRows(variants: VehicleVariantRow[]) {
  const seen = new Set<string>();
  return variants.flatMap(variant => variant.commonProblems.map(problem => ({
    year: String(variant.year),
    problem,
  }))).filter(row => {
    const key = `${row.year}-${row.problem}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function buildVehicleProfileFromSpecs(make: string, model: string): VehicleKnowledgeProfile | null {
  const variants = getVehicleSpecRecordsForModel(make, model);
  if (variants.length === 0) return null;

  const first = variants[0];
  const years = variants.map(variant => variant.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const uniqueStrings = (values: string[]) => Array.from(new Set(values.filter(Boolean)));
  const uniqueArrayItems = (records: VehicleSpecRecord[], key: keyof VehicleSpecRecord) => (
    uniqueStrings(records.flatMap(record => {
      const value = record[key];
      return Array.isArray(value) ? value.map(String) : [String(value || '')];
    }))
  );

  return {
    make,
    model,
    displayName: first.displayName,
    generation: uniqueStrings(variants.map(variant => variant.generation || variant.chassisCode)).slice(0, 4).join(' / ') || first.generation,
    years: minYear === maxYear ? String(minYear) : `${minYear}-${maxYear}`,
    bodyStyle: uniqueStrings(variants.map(variant => variant.bodyStyle)).slice(0, 4).join(' / ') || first.bodyStyle,
    markets: uniqueStrings(variants.map(variant => variant.market)).slice(0, 6),
    coverageLevel: 'expanded',
    yearTrimVariants: variants,
    engines: uniqueArrayItems(variants, 'engineCodes').slice(0, 12),
    transmissions: uniqueStrings(variants.flatMap(variant => [variant.manualTransmission || '', variant.automaticTransmission || '', variant.transmissionFluid || ''])).slice(0, 8),
    tireSizes: uniqueArrayItems(variants, 'tireSizes').slice(0, 10),
    boltPattern: 'Verify by exact trim and wheel package',
    wheelTorque: 'Verify by VIN and wheel package',
    battery: 'Verify by engine, market and equipment package',
    engineOil: uniqueStrings(variants.map(variant => variant.recommendedOil)).slice(0, 4).join(' / ') || first.recommendedOil,
    transmissionFluid: uniqueStrings(variants.map(variant => variant.transmissionFluid)).slice(0, 4).join(' / ') || first.transmissionFluid,
    coolant: uniqueStrings(variants.map(variant => variant.coolantCapacity)).slice(0, 4).join(' / ') || first.coolantCapacity,
    brakeFluid: uniqueStrings(variants.map(variant => variant.brakeFluid)).slice(0, 4).join(' / ') || first.brakeFluid,
    maintenance: uniqueStrings(variants.map(variant => variant.serviceInterval)).slice(0, 10),
    knownProblems: uniqueArrayItems(variants, 'commonProblems').slice(0, 12),
    commonCodes: uniqueArrayItems(variants, 'relatedCodes').filter((code) => VALID_CODE_SET.has(code.toUpperCase())).slice(0, 10),
    compatibleTools: ['OBD2 scanner with live data', 'VIN-based service information', 'Digital multimeter', 'Basic inspection tools'],
    obdPortLocation: 'Driver side lower dashboard area on most OBD-II vehicles; verify by market and generation.',
    fuseBox: 'Verify by VIN, market and production date.',
    sourceNotes: uniqueArrayItems(variants, 'sourceNotes').slice(0, 8),
  };
}

function Timeline({ title, rows }: { title: string; rows: { title: string; body: string }[] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {rows.map(row => (
          <article key={row.title} className="rounded-2xl bg-white/[0.03] px-4 py-3">
            <h3 className="font-black text-white">{row.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{row.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DataTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs font-black uppercase tracking-widest text-slate-500">
            <tr>
              {columns.map(column => <th key={column} className="border-b border-white/10 px-3 py-3">{column}</th>)}
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {rows.map((row, index) => (
              <tr key={`${row.join('-')}-${index}`} className="border-b border-white/5 last:border-0">
                {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-3 py-3 font-medium">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0a0f1c] px-3 py-2">
      <dt className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-200">{value}</dd>
    </div>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map(item => <span key={item} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">{item}</span>)}
      </div>
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
