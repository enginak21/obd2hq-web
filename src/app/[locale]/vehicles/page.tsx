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
  const guideTitle = locale === 'tr' ? 'DoÄŸru araÃ§ profilini nasÄ±l bulursunuz?' : locale === 'de' ? 'So finden Sie das richtige Fahrzeugprofil' : locale === 'es' ? 'CÃ³mo encontrar el perfil correcto' : locale === 'fr' ? 'Comment trouver le bon profil vÃ©hicule' : 'How to find the right vehicle profile';
  const guideText = locale === 'tr'
    ? 'Marka, model, yÄ±l ve kasa seÃ§imi motor kodu, yaÄŸ viskozitesi, yaÄŸ kapasitesi, ÅŸanzÄ±man yaÄŸÄ± ve kronik arÄ±za bilgisini etkiler. AynÄ± model adÄ± farklÄ± pazarlarda farklÄ± motorlarla satÄ±labildiÄŸi iÃ§in seÃ§tiÄŸiniz profili ruhsat, servis etiketi veya VIN destekli parÃ§a kataloÄŸuyla doÄŸrulayÄ±n. Bu rehber, bakÄ±m kararÄ±nÄ± hÄ±zlandÄ±rmak ve ilgili OBD2 kodlarÄ±na doÄŸru baÄŸlanmak iÃ§in hazÄ±rlanmÄ±ÅŸtÄ±r.'
    : locale === 'de'
      ? 'Marke, Modell, Baujahr und Karosserie beeinflussen Motorcode, Ã–lviskositÃ¤t, Ã–lmenge, GetriebeÃ¶l und typische Fehler. Da derselbe Modellname je nach Markt unterschiedliche Motoren haben kann, prÃ¼fen Sie das Profil mit Fahrzeugpapieren, Serviceetikett oder VIN-basiertem Teilekatalog. Dieser Leitfaden beschleunigt Wartungsentscheidungen und verknÃ¼pft passende OBD2-Codes.'
      : locale === 'es'
        ? 'Marca, modelo, aÃ±o y carrocerÃ­a afectan cÃ³digo de motor, viscosidad, capacidad de aceite, fluido de transmisiÃ³n y fallas comunes. Como un mismo modelo puede usar motores distintos por mercado, confirma el perfil con documentaciÃ³n, etiqueta de servicio o catÃ¡logo por VIN. Esta guÃ­a acelera el mantenimiento y conecta cÃ³digos OBD2 relacionados.'
        : locale === 'fr'
          ? 'Marque, modÃ¨le, annÃ©e et carrosserie influencent code moteur, viscositÃ©, capacitÃ© dâ€™huile, fluide de boÃ®te et pannes frÃ©quentes. Un mÃªme modÃ¨le pouvant avoir plusieurs moteurs selon le marchÃ©, confirmez le profil avec les papiers, lâ€™Ã©tiquette dâ€™entretien ou un catalogue par VIN. Ce guide accÃ©lÃ¨re lâ€™entretien et relie les codes OBD2 pertinents.'
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
