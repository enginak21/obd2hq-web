import { cars, codes } from '@/data/db';
import Link from 'next/link';
import { Search as SearchIcon, AlertTriangle, Car, Wrench, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { PRIORITY_CODES } from '@/data/seo';
import { findVehicleMatches, formatVehicleName, normalizeCode, normalizeSearchText } from '@/utils/diagnosticSearch';

export const metadata: Metadata = {
  title: 'Search Results - OBD2HQ',
  description: 'Search results for OBD2 diagnostic codes and car models.',
};

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
        {directTarget && (
          <section className="bg-blue-500/10 border border-blue-500/25 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Best match</div>
              <h2 className="text-2xl font-extrabold text-white">
                {formatVehicleName(parsed.make!)} {formatVehicleName(parsed.model!)} {parsed.code || ''}
              </h2>
            </div>
            <Link href={directTarget} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 font-bold transition-colors">
              Open guide <ArrowRight className="w-4 h-4" />
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
                    title: codes[exactCodeMatch].title,
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
              <h3 className="text-lg font-bold text-white mb-3">Popular {exactCodeMatch} shortcuts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { make: 'toyota', model: 'camry' },
                  { make: 'ford', model: 'focus' },
                  { make: 'honda', model: 'civic' },
                ].map(vehicle => (
                  <Link key={`${vehicle.make}-${vehicle.model}`} href={`/${locale}/${vehicle.make}/${vehicle.model}/${exactCodeMatch.toLowerCase()}`} className="rounded-2xl bg-white/5 border border-white/5 px-4 py-3 hover:bg-white/10 hover:border-blue-500/30 transition-colors">
                    <span className="block text-white font-bold">{formatVehicleName(vehicle.make)} {formatVehicleName(vehicle.model)}</span>
                    <span className="text-xs text-slate-500">Open {exactCodeMatch} guide</span>
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
                    Select this vehicle <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!exactCodeMatch && isWarningIntent && (
          <section className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-3">Start with warning lights</h2>
            <p className="text-slate-400 mb-5">If you do not know the code yet, choose your car first and compare dashboard symbols by severity.</p>
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

        {!exactCodeMatch && matchedModels.length === 0 && (
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
