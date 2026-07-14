import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import VehicleSpecSelector, { type VehicleCatalogOption, type VehicleSpecSelectorItem } from '@/components/VehicleSpecSelector';
import { cars } from '@/data/db';
import { allVehicleSpecRecords } from '@/data/vehicle-spec-records';
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
  const catalog: VehicleCatalogOption[] = cars.flatMap(car => car.models.map(model => ({
    make: car.make,
    model,
    displayName: `${car.make.replace('-', ' ')} ${model.replace('-', ' ')}`.replace(/\b\w/g, c => c.toUpperCase()),
    years: buildYearRange(1996, 2026),
  })));
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
      <VehicleSpecSelector locale={locale} items={selectorItems} catalog={mergeCatalog(catalog, selectorItems)} />
    </main>
  );
}

function buildYearRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function mergeCatalog(catalog: VehicleCatalogOption[], exactItems: VehicleSpecSelectorItem[]) {
  const merged = new Map<string, VehicleCatalogOption>();
  for (const item of catalog) {
    merged.set(`${item.make}/${item.model}`, item);
  }
  for (const item of exactItems) {
    const key = `${item.make}/${item.model}`;
    const existing = merged.get(key);
    if (existing) {
      existing.years = Array.from(new Set([...existing.years, item.year])).sort((a, b) => a - b);
    } else {
      merged.set(key, {
        make: item.make,
        model: item.model,
        displayName: item.displayName,
        years: [item.year],
      });
    }
  }
  return Array.from(merged.values());
}
