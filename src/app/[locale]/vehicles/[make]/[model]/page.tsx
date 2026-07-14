import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { getVehicleKnowledge, vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export function generateStaticParams() {
  return vehicleKnowledgeProfiles.flatMap(vehicle => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, make: vehicle.make, model: vehicle.model })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; make: string; model: string }> }) {
  const { locale, make, model } = await params;
  const vehicle = getVehicleKnowledge(make, model);
  if (!vehicle) return {};
  const name = `${vehicle.make} ${vehicle.model}`.replace(/\b\w/g, c => c.toUpperCase());
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: `${name} ${copy.vehicleTitleSuffix}`,
    description: copy.vehicleMetaDescription(name, vehicle.generation),
    alternates: getAlternates(`vehicles/${make}/${model}`, locale),
  };
}

export default async function VehicleProfilePage({ params }: { params: Promise<{ locale: string; make: string; model: string }> }) {
  const { locale, make, model } = await params;
  setRequestLocale(locale);
  const vehicle = getVehicleKnowledge(make, model);
  if (!vehicle) notFound();
  const name = vehicle.displayName || `${vehicle.make} ${vehicle.model}`.replace(/\b\w/g, c => c.toUpperCase());
  const copy = getKnowledgeUiCopy(locale);
  const labels = getVehicleLabels(locale);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name,
    brand: vehicle.make,
    model: vehicle.model,
    vehicleModelDate: vehicle.years,
    bodyType: vehicle.bodyStyle,
    url: `https://www.obd2hq.com/${locale}/vehicles/${make}/${model}`,
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b border-white/5 bg-[#0d1425]">
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
        </aside>
      </section>
    </main>
  );
}

function getVehicleLabels(locale: string) {
  if (locale === 'tr') {
    return {
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
    };
  }
  return {
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
