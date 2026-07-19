import { notFound } from 'next/navigation';
import { cars } from '@/data/db';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Car, ChevronRight } from 'lucide-react';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { CODE_CATEGORIES, PRIORITY_CODES } from '@/data/seo';
import validRoutes from '@/data/valid_routes.json';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
  }>;
}

export const dynamicParams = false;
const VALID_CODE_SET = new Set((validRoutes.validCodes as string[]).map((code) => code.toUpperCase()));
const DISPLAY_PRIORITY_CODES = PRIORITY_CODES.filter((code) => VALID_CODE_SET.has(code.toUpperCase()));

export async function generateStaticParams() {
  const params: Array<{ locale: string; make: string }> = [];
  const locales = ['en', 'de', 'es', 'tr', 'fr'];
  
  for (const locale of locales) {
    for (const car of cars) {
      params.push({ locale, make: car.make });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make } = resolvedParams;
  const carData = cars.find(c => c.make === make);
  
  if (!carData) return { title: 'Not Found' };
  
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  
  return { 
    title: fitSeoTitle(`${capMake} OBD2 Codes & Dashboard Warning Lights`),
    description: fitSeoDescription(`Complete diagnostic guide for ${capMake} OBD2 codes, warning lights, symptoms and safe first repair checks.`),
    alternates: getAlternates(make, resolvedParams.locale)
  };
}

export default async function MakeDirectoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, make } = resolvedParams;
  setRequestLocale(locale);
  const tCode = await getTranslations({ locale, namespace: 'CodePage' });
  const tMake = await getTranslations({ locale, namespace: 'MakePage' });
  
  const carData = cars.find(c => c.make === make);
  if (!carData) notFound();

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const guideTitle = locale === 'tr' ? `${capMake} sayfasını nasıl kullanmalısınız?` : locale === 'de' ? `So nutzen Sie die ${capMake}-Seite` : locale === 'es' ? `Cómo usar la página de ${capMake}` : locale === 'fr' ? `Comment utiliser la page ${capMake}` : `How to use the ${capMake} hub`;
  const guideText = locale === 'tr'
    ? `${capMake} için önce modelinizi seçin, ardından arıza kodu, gösterge ışığı veya belirti rehberine ilerleyin. Kod sayfaları parça değiştirmeden önce yapılacak kontrolleri, güvenli sürüş uyarılarını, ilgili OBD2 kodlarını ve tahmini masraf seviyesini birlikte verir. Modelinizden emin değilseniz ruhsat, servis kaydı veya VIN destekli parça kataloğuyla doğrulama yapın.`
    : locale === 'de'
      ? `Wählen Sie zuerst Ihr ${capMake}-Modell und öffnen Sie danach den passenden Fehlercode, die Warnleuchte oder den Symptomleitfaden. Die Code-Seiten zeigen Prüfungen vor dem Teiletausch, Sicherheitshinweise, verwandte OBD2-Codes und eine grobe Kostenstufe. Wenn das Modell unsicher ist, prüfen Sie es über Fahrzeugpapiere, Serviceunterlagen oder VIN-basierten Teilekatalog.`
      : locale === 'es'
        ? `Elige primero tu modelo ${capMake} y después abre el código, la luz del tablero o la guía de síntomas. Las páginas de códigos reúnen pruebas antes de cambiar piezas, avisos de seguridad, códigos OBD2 relacionados y nivel aproximado de coste. Si no estás seguro del modelo, confírmalo con documentación, historial de servicio o catálogo por VIN.`
        : locale === 'fr'
          ? `Choisissez d’abord votre modèle ${capMake}, puis ouvrez le code défaut, le voyant ou le guide de symptômes. Les pages de code regroupent les contrôles avant remplacement, les alertes de sécurité, les codes OBD2 liés et un niveau de coût estimé. En cas de doute, confirmez le modèle avec les papiers, l’entretien ou un catalogue par VIN.`
          : `Choose your ${capMake} model first, then open the matching trouble code, dashboard light or symptom guide. Code pages combine checks before replacing parts, safe-driving guidance, related OBD2 codes and a practical repair-cost level. If you are not sure about the exact model, confirm it from registration, service records or a VIN-based parts catalog.`;
  const pageUrl = `https://www.obd2hq.com/${locale}/${make}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: capMake, item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: `${capMake} OBD2 Codes & Dashboard Warning Lights`,
        description: `Diagnostic hub for ${capMake} models, warning lights and common OBD2 codes.`,
        url: pageUrl,
      },
      {
        '@type': 'ItemList',
        name: `${capMake} models`,
        itemListElement: carData.models.map((model, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${capMake} ${model.replace(/-/g, ' ')}`,
          url: `${pageUrl}/${model}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{tCode('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-white capitalize shrink-0">{make}</span>
          </nav>

          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              {tMake('title', { make: capMake })}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl font-light">
              {tMake('desc', { make: capMake })}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <Car className="w-6 h-6 mr-3 text-blue-500" />
          {tMake('selectModel', { make: capMake })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {carData.models.map((model) => (
            <Link 
              key={model} 
              href={`/${locale}/${make}/${model}`}
              className="bg-[#131b2f] border border-white/5 hover:border-blue-500/50 hover:bg-[#1a233a] rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.2)] group"
            >
              <h3 className="text-lg font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">
                {model.replace('-', ' ')}
              </h3>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
            <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            {tMake('topCodes', { make: capMake })}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {DISPLAY_PRIORITY_CODES.slice(0, 8).map((code) => (
              <Link 
                key={code} 
                href={`/${locale}/${make}/${carData.models[0]}/${code.toLowerCase()}`}
                className="group flex items-center justify-center py-4 bg-[#131b2f] border border-red-500/10 hover:border-red-500/50 hover:bg-[#1a233a] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(239,68,68,0.2)]"
              >
                <span className="text-slate-300 group-hover:text-red-400 text-sm font-bold tracking-wider">
                  {code}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-16 rounded-3xl border border-white/5 bg-[#131b2f] p-8">
          <h2 className="text-2xl font-bold text-white mb-4">{guideTitle}</h2>
          <p className="text-slate-400 leading-7">{guideText}</p>
        </section>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-[#131b2f] border border-white/5 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">{tMake('diagnosticAreas', { make: capMake })}</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {tMake('diagnosticAreasDesc')}
            </p>
            <div className="space-y-4">
              {CODE_CATEGORIES.map(category => (
                <div key={category.label} className="border-t border-white/5 pt-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">{category.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.codes.filter(code => VALID_CODE_SET.has(code.toUpperCase())).slice(0, 4).map(code => (
                      <Link key={code} href={`/${locale}/${make}/${carData.models[0]}/${code.toLowerCase()}`} className="text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors">
                        {code}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#131b2f] border border-white/5 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">{tMake('warningLightsTitle', { make: capMake })}</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {tMake('warningLightsDesc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {carData.models.slice(0, 6).map(model => (
                <Link key={model} href={`/${locale}/${make}/${model}/lights`} className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 transition-colors">
                  <span className="capitalize text-slate-300 font-medium">{model.replace('-', ' ')}</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
