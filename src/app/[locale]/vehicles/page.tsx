import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.vehiclesMetaTitle,
    description: copy.vehiclesMetaDescription,
    alternates: getAlternates('vehicles', locale),
  };
}

export default async function VehiclesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  const profileCount = vehicleKnowledgeProfiles.length;
  const engineCount = vehicleKnowledgeProfiles.reduce((sum, vehicle) => sum + (vehicle.engineVariants?.length || vehicle.engines.length), 0);
  const transmissionCount = vehicleKnowledgeProfiles.reduce((sum, vehicle) => sum + (vehicle.transmissionVariants?.length || vehicle.transmissions.length), 0);
  const codeCount = new Set(vehicleKnowledgeProfiles.flatMap(vehicle => vehicle.commonCodes)).size;
  const labels = getVehicleHubLabels(locale);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero
        eyebrow={copy.vehiclesEyebrow}
        title={copy.vehiclesTitle}
        description={copy.vehiclesDescription}
      />
      <section className="max-w-6xl mx-auto px-6 pt-10 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label={labels.verifiedProfiles} value={profileCount.toString()} />
        <Stat label={labels.engineVariants} value={`${engineCount}+`} />
        <Stat label={labels.transmissionVariants} value={`${transmissionCount}+`} />
        <Stat label={labels.codeClusters} value={`${codeCount}+`} />
      </section>
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-5">
        {vehicleKnowledgeProfiles.map(vehicle => (
          <KnowledgeCard
            key={`${vehicle.make}-${vehicle.model}`}
            href={`/${locale}/vehicles/${vehicle.make}/${vehicle.model}`}
            title={vehicle.displayName || `${vehicle.make.replace('-', ' ')} ${vehicle.model.replace('-', ' ')}`.replace(/\b\w/g, c => c.toUpperCase())}
            description={labels.cardDescription(
              vehicle.generation,
              vehicle.years,
              vehicle.engineVariants?.length || vehicle.engines.length,
              vehicle.transmissionVariants?.length || vehicle.transmissions.length,
              vehicle.commonCodes.slice(0, 3).join(', '),
            )}
            tags={[vehicle.generation, vehicle.years, vehicle.coverageLevel || 'seed', ...vehicle.commonCodes]}
          />
        ))}
      </section>
    </main>
  );
}

function getVehicleHubLabels(locale: string) {
  if (locale === 'tr') {
    return {
      verifiedProfiles: 'Zengin profil',
      engineVariants: 'Motor varyantı',
      transmissionVariants: 'Şanzıman varyantı',
      codeClusters: 'Kod kümesi',
      cardDescription: (generation: string, years: string, engineCount: number, transmissionCount: number, codes: string) =>
        `${generation} (${years}) için ${engineCount} motor varyantı, ${transmissionCount} şanzıman varyantı, bakım verileri, kronik arızalar ve öne çıkan kodlar: ${codes}.`,
    };
  }

  return {
    verifiedProfiles: 'Rich profiles',
    engineVariants: 'Engine variants',
    transmissionVariants: 'Transmission variants',
    codeClusters: 'Code clusters',
    cardDescription: (generation: string, years: string, engineCount: number, transmissionCount: number, codes: string) =>
      `${generation} (${years}) with ${engineCount} engine variants, ${transmissionCount} transmission variants, service data, chronic problems and priority codes: ${codes}.`,
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#131b2f] px-4 py-4">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
}
