import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { getTransmissionProfile, transmissionProfiles } from '@/data/transmission-database';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';
import { getCodeHubPath } from '@/data/gsc-seo';

export function generateStaticParams() {
  return transmissionProfiles.flatMap(transmission => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: transmission.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const transmission = getTransmissionProfile(slug);
  if (!transmission) return {};
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: fitSeoTitle(`${transmission.maker} ${transmission.family} ${copy.transmissionTitleSuffix}`),
    description: fitSeoDescription(copy.transmissionMetaDescription(transmission.family)),
    alternates: getAlternates(`transmissions/${slug}`, locale),
  };
}

export default async function TransmissionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const transmission = getTransmissionProfile(slug);
  if (!transmission) notFound();
  const copy = getKnowledgeUiCopy(locale);
  const guideTitle = locale === 'tr' ? 'Şanzıman bilgisini nasıl doğrulayın?' : locale === 'de' ? 'So prüfen Sie die Getriebedaten' : locale === 'es' ? 'Cómo verificar los datos de la transmisión' : locale === 'fr' ? 'Comment vérifier les données de transmission' : 'How to verify this transmission data';
  const guideText = locale === 'tr'
    ? `${transmission.maker} ${transmission.family} profili yağ tipi, servis aralığı ve arıza kodu yorumlama için başlangıç rehberidir. Şanzıman kodunu VIN destekli parça kataloğu, servis etiketi veya üretici bakım verisiyle doğrulayın. Aynı ailede tork kapasitesi, yazılım kalibrasyonu, filtre tipi ve yağ değişim prosedürü modele, pazara ve üretim yılına göre değişebilir.`
    : locale === 'de'
      ? `Das Profil ${transmission.maker} ${transmission.family} dient als Startpunkt für Öltyp, Serviceintervall und Fehlercode-Auswertung. Prüfen Sie den Getriebecode über VIN-basierten Teilekatalog, Serviceetikett oder Hersteller-Wartungsdaten. Drehmomentgrenze, Software, Filtertyp und Ölwechselablauf können je nach Modell, Markt und Baujahr variieren.`
      : locale === 'es'
        ? `El perfil ${transmission.maker} ${transmission.family} es una guía inicial para fluido, mantenimiento e interpretación de códigos. Confirma el código de transmisión con catálogo por VIN, etiqueta de servicio o datos del fabricante. La capacidad de par, software, filtro y procedimiento de cambio pueden variar por modelo, mercado y año.`
        : locale === 'fr'
          ? `Le profil ${transmission.maker} ${transmission.family} sert de point de départ pour le fluide, l’entretien et l’interprétation des codes. Vérifiez le code de boîte avec un catalogue par VIN, une étiquette de service ou les données constructeur. Couple admissible, logiciel, filtre et procédure de vidange peuvent varier selon le modèle, le marché et l’année.`
          : `The ${transmission.maker} ${transmission.family} profile is a starting guide for fluid selection, service planning and code interpretation. Confirm the transmission code through a VIN-based parts catalog, service label or manufacturer maintenance data. Torque rating, software calibration, filter type and fluid-change procedure can vary by model, market and production year.`;
  const diagnosticText = locale === 'tr'
    ? 'Şanzıman arızalarında önce yağ seviyesi, yağ rengi, kaçak, akü voltajı ve kayıtlı kodlar birlikte okunmalıdır. Selenoid, mekatronik, kavrama veya tork konvertörü kararı verilmeden önce canlı veri ve servis geçmişi kontrol edilmelidir.'
    : locale === 'de'
      ? 'Bei Getriebefehlern sollten zuerst Ölstand, Ölzustand, Lecks, Batteriespannung und gespeicherte Codes gemeinsam geprüft werden. Vor Entscheidungen zu Magnetventilen, Mechatronik, Kupplung oder Wandler sind Live-Daten und Servicehistorie wichtig.'
      : locale === 'es'
        ? 'En fallas de transmisión, revisa primero nivel y estado del fluido, fugas, voltaje de batería y códigos guardados. Antes de culpar solenoides, mecatrónica, embrague o convertidor, confirma datos en vivo e historial de servicio.'
        : locale === 'fr'
          ? 'Pour une panne de boîte, vérifiez d’abord niveau et état du fluide, fuites, tension batterie et codes mémorisés. Avant d’accuser solénoïdes, mécatronique, embrayage ou convertisseur, contrôlez données en direct et historique.'
          : 'For transmission faults, check fluid level and condition, leaks, battery voltage and stored codes together first. Before blaming solenoids, mechatronics, clutches or the torque converter, confirm live data and service history.';
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <section className="hero-visual hero-visual-vehicle border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <Link href={`/${locale}/transmissions`} className="text-sm text-slate-500 hover:text-white">{copy.transmissionDatabaseShort}</Link>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-white">{transmission.maker} {transmission.family}</h1>
          <p className="mt-5 text-lg text-slate-400">{transmission.type} / {transmission.gears}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
            <p className="mt-4 leading-7 text-slate-300">{diagnosticText}</p>
          </section>
          <Panel title={copy.applications} items={transmission.applications} />
          <Panel title={copy.fluidServiceNotes} items={[`${copy.fluidLabel}: ${transmission.fluid}`, ...transmission.serviceNotes]} />
          <Panel title={copy.commonFailures} items={transmission.commonFailures} />
        </div>
        <aside className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 h-fit">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.relatedCodes}</h2>
          <div className="grid grid-cols-2 gap-3">
            {transmission.relatedCodes.map(code => <Link key={code} href={getCodeHubPath(locale, code)} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200">{code}</Link>)}
          </div>
        </aside>
      </section>
    </main>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6"><h2 className="text-2xl font-black text-white">{title}</h2><ul className="mt-5 space-y-3">{items.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-slate-300">{item}</li>)}</ul></section>;
}
