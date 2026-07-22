import Link from 'next/link';
import { ArrowRight, Calculator, ScanSearch, Wrench } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { automotiveTools, localizeTool } from '@/data/automotive-tools';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.toolsMetaTitle,
    description: copy.toolsMetaDescription,
    alternates: getAlternates('tools', locale),
  };
}

export default async function ToolsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  const guideTitle = locale === 'tr' ? 'Hangi teÅŸhis aracÄ±nÄ± ne zaman kullanmalÄ±sÄ±nÄ±z?' : locale === 'de' ? 'Welches Diagnosewerkzeug wann nutzen?' : locale === 'es' ? 'QuÃ© herramienta usar y cuÃ¡ndo' : locale === 'fr' ? 'Quel outil utiliser et quand' : 'Which diagnostic tool should you use?';
  const guideText = locale === 'tr'
    ? 'Kod biliyorsanÄ±z arama ve kod rehberleri en hÄ±zlÄ± yoldur. Kod bilmiyorsanÄ±z ArÄ±za Bulucu ile belirtiyi yazÄ±n; bakÄ±m, araÃ§ profili ve uyarÄ± Ä±ÅŸÄ±ÄŸÄ± sayfalarÄ±yla ilk kontrol sÄ±rasÄ±nÄ± Ã§Ä±karÄ±n. HesaplayÄ±cÄ±lar ve geliÅŸmiÅŸ araÃ§lar parÃ§a deÄŸiÅŸtirmeden Ã¶nce masraf, risk ve doÄŸrulama adÄ±mlarÄ±nÄ± netleÅŸtirmek iÃ§in tasarlanmÄ±ÅŸtÄ±r.'
    : locale === 'de'
      ? 'Wenn Sie den Code kennen, sind Suche und Code-LeitfÃ¤den der schnellste Weg. Ohne Code beschreiben Sie das Symptom im Problemfinder und nutzen Wartung, Fahrzeugprofil und Warnleuchten fÃ¼r die ersten PrÃ¼fungen. Rechner und Werkzeuge helfen, Kosten, Risiko und PrÃ¼fschritte vor dem Teiletausch zu klÃ¤ren.'
      : locale === 'es'
        ? 'Si conoces el cÃ³digo, bÃºsqueda y guÃ­as de cÃ³digo son el camino mÃ¡s rÃ¡pido. Sin cÃ³digo, escribe el sÃ­ntoma en el buscador de fallas y combina mantenimiento, perfil del vehÃ­culo y luces del tablero. Las herramientas ayudan a aclarar coste, riesgo y verificaciÃ³n antes de cambiar piezas.'
        : locale === 'fr'
          ? 'Si vous connaissez le code, la recherche et les guides de code sont le chemin le plus rapide. Sans code, dÃ©crivez le symptÃ´me dans lâ€™outil de panne puis utilisez entretien, profil vÃ©hicule et voyants. Les outils clarifient coÃ»t, risque et contrÃ´les avant remplacement.'
          : 'If you know the code, search and code guides are the fastest path. If you do not know the code, describe the symptom in the car problem finder, then use maintenance, vehicle profiles and warning-light pages to build the first-check sequence. Tools clarify cost, risk and verification before replacing parts.';
  const pageUrl = `https://obd2hq.com/${locale}/tools`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: copy.toolsTitle, item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: copy.toolsMetaTitle,
        description: copy.toolsMetaDescription,
        url: pageUrl,
      },
      {
        '@type': 'ItemList',
        name: copy.toolsTitle,
        itemListElement: automotiveTools.map((tool, index) => {
          const localized = localizeTool(tool, locale);
          return {
            '@type': 'ListItem',
            position: index + 1,
            name: localized.title,
            url: `${pageUrl}/${tool.slug}`,
          };
        }),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="hero-visual hero-visual-code border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-200 mb-6">
            <Wrench className="w-4 h-4" />
            {copy.toolsEyebrow}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">
            {copy.toolsTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">
            {copy.toolsDescription}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {automotiveTools.map((tool) => {
          const localized = localizeTool(tool, locale);
          return (
            <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="group rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-green-400/40 hover:bg-[#17213a] transition-all">
              <div className="mb-5 rounded-2xl bg-white/5 p-3 w-fit text-green-300">
                {tool.category === 'calculator' ? <Calculator className="w-6 h-6" /> : <ScanSearch className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-black text-white">{localized.title}</h2>
              <p className="mt-3 text-slate-400 leading-relaxed">{localized.description}</p>
              <div className="mt-6 flex items-center justify-between text-sm font-bold text-green-300">
                {copy.openTool}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
