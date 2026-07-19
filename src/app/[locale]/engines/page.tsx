import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { engineProfiles } from '@/data/engine-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.enginesMetaTitle,
    description: copy.enginesMetaDescription,
    alternates: getAlternates('engines', locale),
  };
}

export default async function EnginesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  const guideTitle = locale === 'tr' ? 'Motor kodu, yağ ve kronik arıza rehberi' : locale === 'de' ? 'Motorcode, Öl und typische Fehler' : locale === 'es' ? 'Código de motor, aceite y fallas comunes' : locale === 'fr' ? 'Code moteur, huile et pannes fréquentes' : 'Engine code, oil and common-failure guide';
  const guideText = locale === 'tr'
    ? 'Bu bölüm motor ailesine göre yağ viskozitesi, kapasite, triger yapısı, turbo veya atmosferik besleme, yaygın arızalar ve ilgili OBD2 kodlarını birlikte değerlendirir. Doğru motoru seçmek yağ bakımı, P0300 tekleme, P0171 fakir karışım, P0420 katalizör ve sensör arızalarını yorumlarken daha isabetli sonuç verir.'
    : locale === 'de'
      ? 'Dieser Bereich bündelt Motorfamilie, Ölviskosität, Ölmenge, Steuertrieb, Aufladung, typische Fehler und verwandte OBD2-Codes. Die richtige Motorwahl hilft bei Ölservice, P0300-Fehlzündungen, P0171-Magerlauf, P0420-Katalysatorcodes und Sensorfehlern.'
      : locale === 'es'
        ? 'Esta sección conecta familia de motor, viscosidad, capacidad de aceite, distribución, admisión, fallas comunes y códigos OBD2 relacionados. Elegir el motor correcto ayuda a interpretar mantenimiento, P0300, P0171, P0420 y fallas de sensores.'
        : locale === 'fr'
          ? 'Cette section relie famille moteur, viscosité, capacité d’huile, distribution, suralimentation, pannes fréquentes et codes OBD2 liés. Choisir le bon moteur aide à interpréter l’entretien, P0300, P0171, P0420 et les défauts de capteurs.'
          : 'This section connects engine family, oil viscosity, oil capacity, timing drive, induction type, common failures and related OBD2 codes. Choosing the correct engine improves maintenance decisions and helps interpret P0300 misfire, P0171 lean, P0420 catalyst and sensor-related faults.';
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.enginesEyebrow} title={copy.enginesTitle} description={copy.enginesDescription} />
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {engineProfiles.map(engine => (
          <KnowledgeCard key={engine.slug} href={`/${locale}/engines/${engine.slug}`} title={`${engine.manufacturer} ${engine.family}`} description={`${engine.configuration}, ${engine.displacement}, ${engine.induction}. ${copy.reliabilityLabel}: ${engine.reliabilityScore}`} tags={[engine.production, engine.oilType, ...engine.relatedCodes]} />
        ))}
      </section>
    </main>
  );
}
