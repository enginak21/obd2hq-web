import { cars, codes, getLocalized } from '@/data/db';
import Link from 'next/link';
import { Search as SearchIcon, AlertTriangle, Car, Wrench, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { PRIORITY_CODES } from '@/data/seo';
import { getLocalizedCodeTitle } from '@/data/code-localization';
import { findVehicleMatches, formatVehicleName, normalizeCode, normalizeSearchText } from '@/utils/diagnosticSearch';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SearchPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: getAlternates('search', locale),
    robots: {
      index: false,
      follow: true,
    },
  };
}

function asString(value: string | string[] | null, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q: string }>;
}) {
  const resolvedParams = await searchParams;
  const rawQuery = resolvedParams.q || '';
  const query = rawQuery.toLowerCase().trim();

  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'SearchPage' });
  const tExtra = await getTranslations({ locale, namespace: 'SearchPageExtra' });
  const vehicleOptions = cars.map(({ make, models }) => ({ make, models }));
  const normalizedCode = normalizeCode(rawQuery);
  const compactQuery = normalizeSearchText(rawQuery);
  const directVehicleMatch = cars.flatMap(car => car.models.map(model => ({ make: car.make, model })))
    .find(vehicle => {
      const compactMake = normalizeSearchText(vehicle.make);
      const compactModel = normalizeSearchText(vehicle.model);
      return compactQuery.includes(compactModel) && (compactQuery.includes(compactMake) || compactModel.length >= 4);
    });
  const directMakeMatch = cars.find(car => compactQuery.includes(normalizeSearchText(car.make)));
  const parsed = {
    code: normalizedCode,
    make: directVehicleMatch?.make || directMakeMatch?.make || null,
    model: directVehicleMatch?.model || null,
  };

  if (query.length > 1 && parsed.code && parsed.make && parsed.model) {
    redirect(`/${locale}/${parsed.make}/${parsed.model}/${parsed.code.toLowerCase()}`);
  }

  if (query.length > 1 && !parsed.code && parsed.make && parsed.model) {
    redirect(`/${locale}/${parsed.make}/${parsed.model}`);
  }

  if (query.length > 1 && !parsed.code && parsed.make) {
    redirect(`/${locale}/${parsed.make}`);
  }
  const directTarget = parsed.make && parsed.model
    ? `/${locale}/${parsed.make}/${parsed.model}${parsed.code ? `/${parsed.code.toLowerCase()}` : ''}`
    : null;

  // 1. Search for a specific code
  const exactCodeMatch = normalizedCode ? Object.keys(codes).find(c => c === normalizedCode) : null;
  const exactCodeTitle = exactCodeMatch
    ? getLocalizedCodeTitle(exactCodeMatch, locale, asString(getLocalized(codes[exactCodeMatch].title, locale), exactCodeMatch))
    : '';
  const isWarningIntent = /check engine|warning|light|dashboard|ikaz|lamba|motor ariza/i.test(rawQuery);
  
  // 2. Search for models
  const matchedModels: { make: string, model: string }[] = [];
  
  if (query.length > 2) {
    cars.forEach(car => {
      if (car.make.toLowerCase().includes(query)) {
        car.models.forEach(m => matchedModels.push({ make: car.make, model: m }));
      } else {
        car.models.forEach(m => {
          if (m.toLowerCase().includes(query)) {
            matchedModels.push({ make: car.make, model: m });
          }
        });
      }
    });
  }

  const quickVehicleMatches = findVehicleMatches(rawQuery, vehicleOptions, 8);
  const popularMakes = ['toyota', 'ford', 'honda', 'chevrolet', 'bmw', 'audi', 'mercedes-benz', 'volkswagen']
    .map(make => cars.find(car => car.make === make))
    .filter((car): car is (typeof cars)[number] => Boolean(car));
  const hasSearchQuery = rawQuery.trim().length > 0;
  const searchGuideTitle = locale === 'tr' ? 'Nasıl arama yapmalısınız?' : locale === 'de' ? 'So suchen Sie richtig' : locale === 'es' ? 'Cómo buscar mejor' : locale === 'fr' ? 'Comment mieux chercher' : 'How to search effectively';
  const searchGuideText = locale === 'tr'
    ? 'OBD kodunu biliyorsanız P0420, P0300 veya P0171 gibi doğrudan yazın. Kodu bilmiyorsanız “Toyota Camry motor ışığı”, “Renault gaz yemiyor” veya “BMW motorundan ses geliyor” gibi araç ve belirtiyi birlikte girin. Arama, kodu, marka/model eşleşmesini ve ilgili arıza bulucu rehberlerini aynı akışta yönlendirmek için tasarlanmıştır.'
    : locale === 'de'
      ? 'Wenn Sie den OBD-Code kennen, geben Sie P0420, P0300 oder P0171 direkt ein. Ohne Code suchen Sie mit Fahrzeug und Symptom, zum Beispiel Toyota Camry Motorkontrollleuchte, Renault keine Leistung oder BMW Motorgeräusch. Die Suche verbindet Code, Fahrzeugtreffer und passende Problemfinder-Leitfäden.'
      : locale === 'es'
        ? 'Si conoces el código OBD, escribe P0420, P0300 o P0171 directamente. Si no sabes el código, busca con vehículo y síntoma, por ejemplo Toyota Camry check engine, Renault no acelera o ruido de motor BMW. La búsqueda conecta códigos, vehículo y guías de fallas relacionadas.'
        : locale === 'fr'
          ? 'Si vous connaissez le code OBD, tapez directement P0420, P0300 ou P0171. Sans code, cherchez avec véhicule et symptôme, par exemple Toyota Camry voyant moteur, Renault manque de puissance ou bruit moteur BMW. La recherche relie codes, véhicule et guides de panne.'
          : 'If you know the OBD code, type P0420, P0300 or P0171 directly. If you do not know the code, search with the vehicle and symptom, such as Toyota Camry check engine, Renault losing power or BMW engine noise. Search is designed to connect code matches, vehicle pages and related problem-finder guides.';

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="border-b border-white/5 pt-12 pb-12 bg-[#0d1425]">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <SearchIcon className="w-8 h-8 mr-4 text-blue-500" />
            {t('title', { query: rawQuery })}
          </h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        <section className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-black text-white">{searchGuideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-300">{searchGuideText}</p>
        </section>

        {!hasSearchQuery && (
          <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-200">
                <SearchIcon className="h-4 w-4" />
                {tExtra('searchHubBadge')}
              </div>
              <h2 className="text-3xl font-black text-white">{tExtra('searchHubTitle')}</h2>
              <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed">{tExtra('searchHubDesc')}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {PRIORITY_CODES.slice(0, 6).map(code => (
                  <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-2xl border border-blue-500/10 bg-blue-500/10 px-4 py-3 text-center font-black text-blue-100 hover:border-blue-400/40">
                    {code}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-8">
              <h2 className="text-2xl font-black text-white">{tExtra('popularVehicles')}</h2>
              <div className="mt-5 space-y-3">
                {popularMakes.slice(0, 6).map((car) => (
                  <Link key={car.make} href={`/${locale}/${car.make}`} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 font-bold text-slate-200 hover:bg-white/[0.07]">
                    {formatVehicleName(car.make)}
                    <ArrowRight className="h-4 w-4 text-blue-300" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 grid gap-4 md:grid-cols-3">
              {[
                { href: `/${locale}/car-problem-finder`, title: tExtra('findByProblem'), desc: tExtra('findByProblemDesc') },
                { href: `/${locale}/vehicles`, title: tExtra('findByVehicle'), desc: tExtra('findByVehicleDesc') },
                { href: `/${locale}/toyota/camry/lights`, title: tExtra('findByLight'), desc: tExtra('findByLightDesc') },
              ].map(item => (
                <Link key={item.href} href={item.href} className="rounded-3xl border border-white/5 bg-[#101827] p-6 hover:border-blue-400/40">
                  <h2 className="text-xl font-black text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {directTarget && (
          <section className="bg-blue-500/10 border border-blue-500/25 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">{tExtra('bestMatch')}</div>
              <h2 className="text-2xl font-extrabold text-white">
                {formatVehicleName(parsed.make!)} {formatVehicleName(parsed.model!)} {parsed.code || ''}
              </h2>
            </div>
            <Link href={directTarget} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 font-bold transition-colors">
              {tExtra('openGuide')} <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {exactCodeMatch && (
          <section>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 mb-8 flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-extrabold text-white mb-2">{t('codeFound', { code: exactCodeMatch })}</h2>
                <p className="text-slate-300 leading-relaxed">
                  {t.rich('codeDesc', {
                    code: exactCodeMatch,
                    title: exactCodeTitle,
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">{t('selectCar', { code: exactCodeMatch })}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {popularMakes.map((car) => (
                <Link 
                  key={car.make} 
                  href={`/${locale}/${car.make}`}
                  className="bg-[#131b2f] border border-white/5 hover:border-blue-500/50 rounded-2xl p-4 flex items-center justify-between text-sm font-bold text-slate-300 hover:text-white transition-all"
                >
                  <span>{formatVehicleName(car.make)}</span>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </Link>
              ))}
            </div>

            <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">{tExtra('popularShortcuts', { code: exactCodeMatch })}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { make: 'toyota', model: 'camry' },
                  { make: 'ford', model: 'focus' },
                  { make: 'honda', model: 'civic' },
                ].map(vehicle => (
                  <Link key={`${vehicle.make}-${vehicle.model}`} href={`/${locale}/${vehicle.make}/${vehicle.model}/${exactCodeMatch.toLowerCase()}`} className="rounded-2xl bg-white/5 border border-white/5 px-4 py-3 hover:bg-white/10 hover:border-blue-500/30 transition-colors">
                    <span className="block text-white font-bold">{formatVehicleName(vehicle.make)} {formatVehicleName(vehicle.model)}</span>
                    <span className="text-xs text-slate-500">{tExtra('openCodeGuide', { code: exactCodeMatch })}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {!exactCodeMatch && matchedModels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Car className="w-6 h-6 mr-3 text-blue-500" />
              {t('matchingVehicles')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matchedModels.map((m, idx) => (
                <Link 
                  key={idx} 
                  href={`/${locale}/${m.make}/${m.model}`}
                  className="bg-[#131b2f] border border-white/5 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col transition-all group"
                >
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{formatVehicleName(m.make)}</span>
                  <span className="text-lg font-bold text-slate-200 group-hover:text-white uppercase">{formatVehicleName(m.model)}</span>
                  <span className="mt-4 inline-flex items-center text-sm font-bold text-blue-400">
                    {tExtra('selectThisVehicle')} <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!exactCodeMatch && isWarningIntent && (
          <section className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-3">{tExtra('startWithLights')}</h2>
            <p className="text-slate-400 mb-5">{tExtra('lightsDesc')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { make: 'toyota', model: 'camry' },
                { make: 'ford', model: 'focus' },
                { make: 'honda', model: 'civic' },
              ].map(vehicle => (
                <Link key={`${vehicle.make}-${vehicle.model}`} href={`/${locale}/${vehicle.make}/${vehicle.model}/lights`} className="rounded-2xl bg-white/5 border border-white/5 px-4 py-3 hover:bg-white/10 transition-colors">
                  <span className="font-bold text-amber-200">{formatVehicleName(vehicle.make)} {formatVehicleName(vehicle.model)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {hasSearchQuery && !exactCodeMatch && matchedModels.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('noResults')}</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              {t('noResultsDesc', { query: rawQuery })}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {PRIORITY_CODES.slice(0, 6).map(code => (
                <Link key={code} href={`/${locale}/search?q=${code}`} className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  {code}
                </Link>
              ))}
              {quickVehicleMatches.map(match => (
                <Link key={match.hrefPart} href={`/${locale}/${match.hrefPart}`} className="rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-sm font-bold text-blue-300 hover:bg-blue-500/15 transition-colors">
                  {match.label}
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
