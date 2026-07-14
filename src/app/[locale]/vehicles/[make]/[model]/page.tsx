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
  const name = `${vehicle.make} ${vehicle.model}`.replace(/\b\w/g, c => c.toUpperCase());
  const copy = getKnowledgeUiCopy(locale);

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
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
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
          <Panel title={copy.maintenanceScheduleFocus} items={vehicle.maintenance} />
          <Panel title={copy.knownProblems} items={vehicle.knownProblems} />
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
        </aside>
      </section>
    </main>
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
