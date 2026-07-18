import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import VehicleSpecSelector, { type VehicleSpecSelectorItem } from '@/components/VehicleSpecSelector';
import { indexedVehicleSpecRecords } from '@/data/vehicle-spec-records';
import { getVehicleSpecQualityLabel } from '@/data/vehicle-quality';
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
  const selectorItems: VehicleSpecSelectorItem[] = indexedVehicleSpecRecords.map(variant => ({
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
    qualityLabel: getVehicleSpecQualityLabel(variant),
  }));
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: copy.vehicleDatabaseShort, item: `https://www.obd2hq.com/${locale}/vehicles` },
        ],
      },
      {
        '@type': 'ItemList',
        name: copy.vehiclesMetaTitle,
        itemListElement: indexedVehicleSpecRecords.slice(0, 100).map((variant, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${variant.year} ${variant.displayName} ${variant.engineCodes.slice(0, 2).join('/')}`,
          url: `https://www.obd2hq.com/${locale}/vehicles/${variant.make}/${variant.model}/${variant.year}/${variant.slug}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <KnowledgeHero
        eyebrow={copy.vehiclesEyebrow}
        title={copy.vehiclesTitle}
        description={copy.vehiclesDescription}
      />
      <VehicleSpecSelector locale={locale} items={selectorItems} />
    </main>
  );
}
