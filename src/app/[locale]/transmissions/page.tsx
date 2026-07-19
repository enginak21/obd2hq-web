import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeCard, KnowledgeHero } from '@/components/KnowledgeGrid';
import { transmissionProfiles } from '@/data/transmission-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.transmissionsMetaTitle,
    description: copy.transmissionsMetaDescription,
    alternates: getAlternates('transmissions', locale),
  };
}

export default async function TransmissionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  const guideTitle = locale === 'tr' ? 'Şanzıman yağı, arıza belirtileri ve ilgili kodlar' : locale === 'de' ? 'Getriebeöl, Symptome und verwandte Codes' : locale === 'es' ? 'Fluido, síntomas y códigos relacionados' : locale === 'fr' ? 'Huile, symptômes et codes liés' : 'Transmission fluid, symptoms and related codes';
  const guideText = locale === 'tr'
    ? 'Bu bölüm otomatik, çift kavrama ve CVT şanzıman aileleri için yağ tipi, servis notları, yaygın arızalar ve OBD2 kodlarını birlikte gösterir. Vites geçiş vuruntusu, kaydırma, geç kavrama, hararet veya P0700/P0715/P0720 gibi kodlarda önce doğru şanzıman ailesini belirlemek gerekir.'
    : locale === 'de'
      ? 'Dieser Bereich zeigt Öltyp, Servicenotizen, typische Fehler und OBD2-Codes für Automatik-, Doppelkupplungs- und CVT-Getriebe. Bei Schaltrucken, Schlupf, verzögertem Kraftschluss, Überhitzung oder P0700/P0715/P0720 sollte zuerst die genaue Getriebefamilie geprüft werden.'
      : locale === 'es'
        ? 'Esta sección muestra fluido, servicio, fallas comunes y códigos OBD2 para transmisiones automáticas, doble embrague y CVT. Ante golpes, patinamiento, retraso, sobrecalentamiento o códigos P0700/P0715/P0720, primero identifica la familia correcta.'
        : locale === 'fr'
          ? 'Cette section présente fluide, entretien, pannes fréquentes et codes OBD2 pour boîtes automatiques, double embrayage et CVT. En cas d’à-coups, patinage, retard, surchauffe ou codes P0700/P0715/P0720, identifiez d’abord la famille exacte.'
          : 'This section maps automatic, dual-clutch and CVT transmission families to fluid type, service notes, common failures and OBD2 codes. For harsh shifts, slipping, delayed engagement, overheating or P0700/P0715/P0720, confirm the exact transmission family first.';
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.transmissionsEyebrow} title={copy.transmissionsTitle} description={copy.transmissionsDescription} />
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {transmissionProfiles.map(transmission => (
          <KnowledgeCard key={transmission.slug} href={`/${locale}/transmissions/${transmission.slug}`} title={`${transmission.maker} ${transmission.family}`} description={`${transmission.type}, ${transmission.gears}. ${copy.applicationsLabel}: ${transmission.applications.slice(0, 3).join(', ')}.`} tags={[transmission.type, transmission.gears, ...transmission.relatedCodes]} />
        ))}
      </section>
    </main>
  );
}
