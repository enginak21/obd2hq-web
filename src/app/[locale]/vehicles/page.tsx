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
  const guideTitle = locale === 'tr' ? 'Doğru araç profilini nasıl bulursunuz?' : locale === 'de' ? 'So finden Sie das richtige Fahrzeugprofil' : locale === 'es' ? 'Cómo encontrar el perfil correcto' : locale === 'fr' ? 'Comment trouver le bon profil véhicule' : 'How to find the right vehicle profile';
  const guideText = locale === 'tr'
    ? 'Marka, model, yıl ve kasa seçimi motor kodu, yağ viskozitesi, yağ kapasitesi, şanzıman yağı ve kronik arıza bilgisini etkiler. Aynı model adı farklı pazarlarda farklı motorlarla satılabildiği için seçtiğiniz profili ruhsat, servis etiketi veya VIN destekli parça kataloğuyla doğrulayın. Bu rehber, bakım kararını hızlandırmak ve ilgili OBD2 kodlarına doğru bağlanmak için hazırlanmıştır.'
    : locale === 'de'
      ? 'Marke, Modell, Baujahr und Karosserie beeinflussen Motorcode, Ölviskosität, Ölmenge, Getriebeöl und typische Fehler. Da derselbe Modellname je nach Markt unterschiedliche Motoren haben kann, prüfen Sie das Profil mit Fahrzeugpapieren, Serviceetikett oder VIN-basiertem Teilekatalog. Dieser Leitfaden beschleunigt Wartungsentscheidungen und verknüpft passende OBD2-Codes.'
      : locale === 'es'
        ? 'Marca, modelo, año y carrocería afectan código de motor, viscosidad, capacidad de aceite, fluido de transmisión y fallas comunes. Como un mismo modelo puede usar motores distintos por mercado, confirma el perfil con documentación, etiqueta de servicio o catálogo por VIN. Esta guía acelera el mantenimiento y conecta códigos OBD2 relacionados.'
        : locale === 'fr'
          ? 'Marque, modèle, année et carrosserie influencent code moteur, viscosité, capacité d’huile, fluide de boîte et pannes fréquentes. Un même modèle pouvant avoir plusieurs moteurs selon le marché, confirmez le profil avec les papiers, l’étiquette d’entretien ou un catalogue par VIN. Ce guide accélère l’entretien et relie les codes OBD2 pertinents.'
          : 'Make, model, year and body generation affect engine code, oil viscosity, oil capacity, transmission fluid and common problem patterns. Because the same model name can use different engines by market, confirm the profile with registration, service label or a VIN-based parts catalog. This guide is built to speed up maintenance decisions and connect the right OBD2 codes.';
  const selectorItems: VehicleSpecSelectorItem[] = indexedVehicleSpecRecords.map(variant => ({
    make: variant.make,
    model: variant.model,
    displayName: variant.displayName,
    generation: variant.generation,
    year: variant.year,
    trim: variant.trim,
    slug: variant.slug,
    chassisCode: variant.chassisCode,
    engineCodes: variant.engineCodes.slice(0, 3),
    recommendedOil: variant.recommendedOil,
    oilCapacity: variant.oilCapacity,
    transmissionFluid: variant.transmissionFluid,
    relatedCodes: variant.relatedCodes.slice(0, 4),
    qualityLabel: getVehicleSpecQualityLabel(variant),
  }));
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: copy.vehicleDatabaseShort, item: `https://obd2hq.com/${locale}/vehicles` },
        ],
      },
      {
        '@type': 'ItemList',
        name: copy.vehiclesMetaTitle,
        itemListElement: indexedVehicleSpecRecords.slice(0, 100).map((variant, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${variant.year} ${variant.displayName} ${variant.engineCodes.slice(0, 2).join('/')}`,
          url: `https://obd2hq.com/${locale}/vehicles/${variant.make}/${variant.model}/${variant.year}/${variant.slug}`,
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
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
        </div>
      </section>
      <VehicleSpecSelector locale={locale} items={selectorItems} />
    </main>
  );
}
