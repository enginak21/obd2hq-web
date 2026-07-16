import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import VehicleSpecSelector, { type VehicleSpecSelectorItem } from '@/components/VehicleSpecSelector';
import { allVehicleSpecRecords } from '@/data/vehicle-spec-records';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const selectorItems: VehicleSpecSelectorItem[] = allVehicleSpecRecords.map(variant => ({
    make: variant.make,
    model: variant.model,
    displayName: variant.displayName,
    generation: variant.generation,
    year: variant.year,
    trim: variant.trim,
    slug: variant.slug,
    chassisCode: variant.chassisCode,
    engineCodes: variant.engineCodes,
    engineSummary: variant.engineSummary,
    recommendedOil: variant.recommendedOil,
    oilCapacity: variant.oilCapacity,
    transmissionFluid: variant.transmissionFluid,
    commonProblems: variant.commonProblems,
    firstChecks: variant.firstChecks,
    relatedCodes: variant.relatedCodes,
  }));

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero
        eyebrow={copy.vehiclesEyebrow}
        title={copy.vehiclesTitle}
        description={copy.vehiclesDescription}
      />
      <VehicleSpecSelector locale={locale} items={selectorItems} />
    </main>
  );
}
