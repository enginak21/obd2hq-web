import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BadgeCheck, ListChecks, SearchCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { automotiveTools, getToolBySlug, localizeTool } from '@/data/automotive-tools';
import ToolSimulator from '@/components/ToolSimulator';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export function generateStaticParams() {
  return automotiveTools.flatMap(tool => ['en', 'tr', 'de', 'es', 'fr'].map(locale => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const localized = localizeTool(tool, locale);
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: `${localized.title} - ${copy.toolTitleSuffix}`,
    description: localized.description,
    alternates: getAlternates(`tools/${slug}`, locale),
  };
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const localized = localizeTool(tool, locale);
  const copy = getKnowledgeUiCopy(locale);
  const pageUrl = `https://www.obd2hq.com/${locale}/tools/${slug}`;
  const practicalTitle = locale === 'tr' ? 'Bu aracı ne zaman kullanmalısın?' : locale === 'de' ? 'Wann dieses Tool sinnvoll ist' : locale === 'es' ? 'Cuándo usar esta herramienta' : locale === 'fr' ? 'Quand utiliser cet outil' : 'When this tool is useful';
  const practicalText = locale === 'tr'
    ? `${localized.title}, arıza kodunu tek başına yorumlamak yerine tarama verisini belirti, araç davranışı ve ilk kontrol sırası ile birlikte okumak için tasarlanmıştır. Sonucu kesin teşhis gibi değil, doğru parçaya geçmeden önce hangi sistemi kontrol edeceğini gösteren bir ön eleme olarak kullan. Özellikle aynı anda birden fazla kod varsa, önce akü voltajı, bağlantılar, sigorta, hortum kaçağı, yakıt ve hava ölçüm değerleri gibi temel verileri doğrulamak gereksiz parça değişimini azaltır.`
    : locale === 'de'
      ? `${localized.title} hilft, Scan-Daten nicht isoliert, sondern zusammen mit Symptomen, Fahrzeugverhalten und einer ersten Prüfreihenfolge zu bewerten. Nutze das Ergebnis nicht als endgültige Diagnose, sondern als Vorprüfung, bevor Teile ersetzt werden. Besonders bei mehreren Codes sollten Batteriespannung, Steckverbindungen, Sicherungen, Undichtigkeiten sowie Luft- und Kraftstoffwerte zuerst bestätigt werden.`
      : locale === 'es'
        ? `${localized.title} ayuda a interpretar los datos del escáner junto con los síntomas, el comportamiento del vehículo y una secuencia inicial de revisión. No lo uses como diagnóstico definitivo, sino como una guía para saber qué sistema comprobar antes de reemplazar piezas. Si hay varios códigos, confirma primero batería, conectores, fusibles, fugas y datos de aire o combustible.`
        : locale === 'fr'
          ? `${localized.title} sert à lire les données de diagnostic avec les symptômes, le comportement du véhicule et un ordre de contrôle logique. Le résultat n’est pas un diagnostic définitif, mais une aide pour savoir quel système vérifier avant de remplacer une pièce. En présence de plusieurs codes, vérifiez d’abord batterie, connecteurs, fusibles, fuites et valeurs air/carburant.`
          : `${localized.title} is meant to read scan data together with symptoms, vehicle behavior and a sensible first-check order. Treat the result as a triage guide, not a final diagnosis. When several codes appear together, confirm battery voltage, connectors, fuses, leaks, fuel data and air measurement values before replacing parts.`;
  const decisionTitle = locale === 'tr' ? 'Sonucu nasıl yorumlamalı?' : locale === 'de' ? 'Wie das Ergebnis zu lesen ist' : locale === 'es' ? 'Cómo interpretar el resultado' : locale === 'fr' ? 'Comment lire le résultat' : 'How to read the result';
  const decisionItems = locale === 'tr'
    ? ['Önce güvenlik uyarısını dikkate al: fren, yağ basıncı, hararet veya yoğun duman varsa aracı zorlamadan kontrol ettir.', 'Tek bir parçaya atlama; aynı belirti sensör, kablo, hava kaçağı veya yakıt beslemesi kaynaklı olabilir.', 'Onarım sonrası kodu silmek yetmez; kısa test sürüşü ve canlı verilerle arızanın geri dönmediğini doğrula.']
    : locale === 'de'
      ? ['Sicherheitswarnungen zuerst beachten: Bremsen, Öldruck, Überhitzung oder starker Rauch gehören sofort geprüft.', 'Nicht direkt ein Teil ersetzen; dieselben Symptome können Sensor, Kabel, Luftleck oder Kraftstoffversorgung betreffen.', 'Nach der Reparatur nicht nur Codes löschen; mit Probefahrt und Live-Daten bestätigen, dass der Fehler nicht zurückkommt.']
      : locale === 'es'
        ? ['Prioriza la seguridad: frenos, presión de aceite, sobrecalentamiento o humo intenso requieren revisión inmediata.', 'No cambies una pieza de inmediato; el mismo síntoma puede venir de sensor, cableado, fuga de aire o combustible.', 'Después de reparar, no basta borrar el código; confirma con prueba de manejo y datos en vivo.']
        : locale === 'fr'
          ? ['Priorité à la sécurité : freins, pression d’huile, surchauffe ou fumée dense doivent être contrôlés rapidement.', 'Ne remplacez pas une pièce trop vite ; un même symptôme peut venir d’un capteur, câblage, fuite d’air ou alimentation carburant.', 'Après réparation, ne vous limitez pas à effacer le code ; confirmez par essai routier et données en direct.']
          : ['Start with safety: brake warnings, oil pressure, overheating or heavy smoke need immediate attention.', 'Do not jump to one part; the same symptom can come from a sensor, wiring, an air leak or fuel delivery.', 'After repair, clearing the code is not enough; verify with a short drive cycle and live data.'];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: localized.title,
    applicationCategory: 'Automotive diagnostic tool',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      name: `${localized.title} access`,
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: pageUrl,
    },
    description: localized.description,
    url: pageUrl,
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="hero-visual hero-visual-code border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href={`/${locale}`} className="hover:text-white">OBD2HQ</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/tools`} className="hover:text-white">{copy.tools}</Link>
          </nav>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">{localized.title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">{localized.description}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-6">
          <ToolSimulator toolSlug={tool.slug} locale={locale} />

          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <ListChecks className="w-6 h-6 text-blue-400" />
              {copy.howToUseSafely}
            </h2>
            <ol className="mt-5 space-y-3 text-slate-300">
              {copy.safeToolSteps.map(step => <li key={step} className="rounded-2xl bg-white/[0.03] px-4 py-3">{step}</li>)}
            </ol>
          </section>

          <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{practicalTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{practicalText}</p>
            <h2 className="mt-7 text-xl font-black text-white">{decisionTitle}</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              {decisionItems.map(item => <li key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3">{item}</li>)}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.bestFor}</h2>
            <p className="text-slate-300 leading-relaxed">{localized.primaryUse}</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">{copy.searchDemand}</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {localized.relatedQueries.map(query => <li key={query}>- {query}</li>)}
            </ul>
          </div>
          <Link href={`/${locale}/symptoms`} className="flex items-center justify-between rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 text-blue-100 hover:bg-blue-500/15">
            <span className="font-black flex items-center gap-2">
              <SearchCheck className="w-5 h-5" />
              {copy.diagnoseBySymptom}
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href={`/${locale}/editorial-policy`} className="flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.03] p-6 text-slate-200 hover:bg-white/[0.06]">
            <span className="font-black flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-green-300" />
              {copy.methodology}
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </aside>
      </section>
    </main>
  );
}
