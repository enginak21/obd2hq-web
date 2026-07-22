import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { engineProfiles, getEngineProfile } from '@/data/engine-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';
import { getCodeHubPath } from '@/data/gsc-seo';

export function generateStaticParams() {
  return engineProfiles.flatMap(engine => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: engine.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const engine = getEngineProfile(slug);
  if (!engine) return {};
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: fitSeoTitle(`${engine.manufacturer} ${engine.family} ${copy.engineTitleSuffix}`),
    description: fitSeoDescription(copy.engineMetaDescription(engine.family)),
    alternates: getAlternates(`engines/${slug}`, locale),
  };
}

export default async function EnginePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const engine = getEngineProfile(slug);
  if (!engine) notFound();
  const copy = getKnowledgeUiCopy(locale);
  const guideTitle = locale === 'tr' ? 'Bu motor profilini nasıl kullanmalısınız?' : locale === 'de' ? 'So nutzen Sie dieses Motorprofil' : locale === 'es' ? 'Cómo usar este perfil de motor' : locale === 'fr' ? 'Comment utiliser ce profil moteur' : 'How to use this engine profile';
  const guideText = locale === 'tr'
    ? `${engine.manufacturer} ${engine.family} bilgilerini yağ seçimi, bakım planı ve arıza teşhisi için başlangıç noktası olarak kullanın. Motor kodunu kaput altı etiketi, servis kaydı veya VIN destekli parça kataloğu ile doğrulayın. Aynı motor ailesinde pazar, emisyon standardı ve model yılına göre yağ kapasitesi, sensör yerleşimi ve kronik arıza ihtimali değişebilir.`
    : locale === 'de'
      ? `Nutzen Sie die Daten zum ${engine.manufacturer} ${engine.family} als Ausgangspunkt für Ölwahl, Wartungsplanung und Fehlersuche. Prüfen Sie den Motorcode über Aufkleber im Motorraum, Serviceunterlagen oder einen VIN-basierten Teilekatalog. Innerhalb derselben Motorfamilie können Ölmenge, Sensorpositionen und typische Fehler je nach Markt, Abgasnorm und Modelljahr abweichen.`
      : locale === 'es'
        ? `Usa los datos del ${engine.manufacturer} ${engine.family} como punto de partida para aceite, mantenimiento y diagnóstico. Confirma el código de motor con la etiqueta del vano motor, historial de servicio o catálogo de piezas por VIN. En una misma familia, la capacidad de aceite, sensores y fallas comunes pueden variar por mercado, norma de emisiones y año.`
        : locale === 'fr'
          ? `Utilisez les données du ${engine.manufacturer} ${engine.family} comme point de départ pour l’huile, l’entretien et le diagnostic. Confirmez le code moteur avec l’étiquette sous capot, l’historique d’entretien ou un catalogue de pièces par VIN. Dans une même famille, la capacité d’huile, les capteurs et les pannes courantes peuvent varier selon le marché, la norme antipollution et l’année.`
          : `Use the ${engine.manufacturer} ${engine.family} profile as a starting point for oil selection, maintenance planning and diagnosis. Confirm the engine code from the under-hood label, service record or VIN-based parts catalog. Oil capacity, sensor layout and common failure patterns can vary by market, emissions package and model year within the same engine family.`;
  const diagnosticText = locale === 'tr'
    ? 'Motor profili özellikle yağ eksiltme, tekleme, turbo basıncı, yakıt karışımı ve katalizör verimliliği gibi arızalarda teşhis sırasını daraltır. İlgili OBD2 kodlarına geçmeden önce bakım geçmişini, doğru yağ kullanımını ve görsel kaçak kontrolünü birlikte değerlendirin.'
    : locale === 'de'
      ? 'Das Motorprofil grenzt die Diagnose bei Ölverbrauch, Fehlzündung, Ladedruck, Gemischaufbereitung und Katalysatorwirkung ein. Vor dem Öffnen verwandter OBD2-Codes sollten Wartungshistorie, richtige Ölspezifikation und sichtbare Lecks zusammen bewertet werden.'
      : locale === 'es'
        ? 'El perfil del motor acota el diagnóstico en consumo de aceite, misfire, presión de turbo, mezcla de combustible y eficiencia del catalizador. Antes de abrir códigos OBD2 relacionados, revisa historial de mantenimiento, aceite correcto y fugas visibles.'
        : locale === 'fr'
          ? 'Le profil moteur aide à cibler consommation d’huile, ratés, pression turbo, mélange carburant et efficacité catalyseur. Avant d’ouvrir les codes OBD2 liés, vérifiez historique d’entretien, huile correcte et fuites visibles.'
          : 'The engine profile narrows diagnosis for oil consumption, misfires, boost pressure, fuel mixture and catalyst efficiency faults. Before opening related OBD2 codes, review service history, correct oil use and visible leak checks together.';
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <section className="hero-visual hero-visual-vehicle border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <Link href={`/${locale}/engines`} className="text-sm text-slate-500 hover:text-white">{copy.engineDatabaseShort}</Link>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white">{engine.manufacturer} {engine.family}</h1>
          <p className="mt-5 text-lg text-slate-400">{engine.configuration} / {engine.displacement} / {engine.production}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
            <p className="mt-4 leading-7 text-slate-300">{diagnosticText}</p>
          </section>
          <Panel title={copy.specifications} items={[`${copy.inductionLabel}: ${engine.induction}`, `${copy.timingDriveLabel}: ${engine.timingDrive}`, `${copy.oilTypeLabel}: ${engine.oilType}`, `${copy.oilCapacityLabel}: ${engine.oilCapacity}`]} />
          <Panel title={copy.commonFailures} items={engine.commonFailures} />
          <Panel title={copy.maintenanceFocus} items={engine.maintenance} />
        </div>
        <aside className="space-y-6">
          <Panel title={copy.reliabilityScore} items={[engine.reliabilityScore]} />
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.relatedCodes}</h2>
            <div className="grid grid-cols-2 gap-3">
              {engine.relatedCodes.map(code => <Link key={code} href={getCodeHubPath(locale, code)} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200">{code}</Link>)}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6"><h2 className="text-2xl font-black text-white">{title}</h2><ul className="mt-5 space-y-3">{items.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>)}</ul></section>;
}
