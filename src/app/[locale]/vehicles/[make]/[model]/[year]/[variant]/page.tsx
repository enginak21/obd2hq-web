import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';
import {
  getVehicleKnowledge,
} from '@/data/vehicle-knowledge';
import { getVehicleSpecRecord } from '@/data/vehicle-spec-records';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; make: string; model: string; year: string; variant: string }> }) {
  const { locale, make, model, year, variant } = await params;
  const trim = getVehicleSpecRecord(make, model, year, variant);
  if (!trim) return {};
  const name = `${trim.year} ${trim.displayName} ${trim.trim}`;
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
  const pageName = `${trim.year} ${vehicleName} ${trim.trim}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: pageName,
    brand: trim.make,
    model: `${vehicleName} ${trim.trim}`,
    vehicleModelDate: String(trim.year),
    vehicleEngine: trim.engineCodes.join(', '),
    bodyType: trim.bodyStyle,
    url: `https://www.obd2hq.com/${locale}/vehicles/${make}/${model}/${year}/${variant}`,
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b border-white/5 bg-[#0d1425]">
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
          <Panel title={labels.notes} items={trim.notes} />
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.commonCodes}</h2>
            <div className="grid grid-cols-2 gap-3">
              {trim.relatedCodes.map(code => (
                <Link key={code} href={`/${locale}/${make}/${model}/${code.toLowerCase()}`} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200 hover:bg-blue-500/20">
                  {code}
                </Link>
              ))}
            </div>
          </section>
          <Panel title={labels.sourceNotes} items={trim.sourceNotes} />
          <Panel title={copy.compatibleTools} items={vehicle?.compatibleTools || [labels.verifyByVin]} />
        </aside>
      </section>
    </main>
  );
}

function getVariantLabels(locale: string) {
  if (locale === 'tr') {
    return {
      metaSuffix: 'motor kodu, yağ kapasitesi ve teknik servis bilgileri',
      metaDescription: (name: string, engine: string, oil: string) => `${name} için motor kodu ${engine}, motor yağı kapasitesi ${oil}, şanzıman, bakım ve kronik arıza bilgileri.`,
      exactVariant: 'Yıl/kasa özel kayıt',
      engineIdentity: 'Motor kimliği',
      engineCodes: 'Motor kodu',
      engineSummary: 'Motor özeti',
      displacement: 'Motor hacmi',
      power: 'Güç',
      torque: 'Tork',
      fuelSystem: 'Yakıt sistemi',
      timingDrive: 'Triger sistemi',
      fluids: 'Yağlar ve sıvılar',
      differentialFluid: 'Diferansiyel yağı',
      serviceAndParts: 'Servis ve parça bilgileri',
      manualTransmission: 'Manuel şanzıman',
      automaticTransmission: 'Otomatik şanzıman',
      sparkPlugs: 'Buji bilgisi',
      serviceInterval: 'Servis aralığı',
      commonProblems: 'Kronik ve sık görülen sorunlar',
      firstChecks: 'İlk kontrol edilmesi gerekenler',
      notes: 'Önemli notlar',
      sourceNotes: 'Kaynak ve doğrulama notları',
      verifyByVin: 'VIN ve pazara göre doğrulanmalı',
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
  };
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
