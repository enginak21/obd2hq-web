import { cars, codes } from '@/data/db';
import Link from 'next/link';
import { Search as SearchIcon, AlertTriangle, Car } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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

  // 1. Search for a specific code
  const exactCodeMatch = Object.keys(codes).find(c => c.toLowerCase() === query);
  
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
        
        {/* Exact Code Match found, but we need the user to select their car first since codes are dynamic per car! */}
        {exactCodeMatch && (
          <section>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{t('codeFound', { code: exactCodeMatch })}</h2>
                <p className="text-slate-300">
                  {t.rich('codeDesc', {
                    code: exactCodeMatch,
                    title: codes[exactCodeMatch].title,
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6">{t('selectCar', { code: exactCodeMatch })}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {cars.map((car) => (
                <Link 
                  key={car.make} 
                  href={`/${car.make}`}
                  className="bg-[#131b2f] border border-white/5 hover:border-blue-500/50 rounded-xl py-3 flex justify-center text-sm font-bold text-slate-300 hover:text-white capitalize transition-all"
                >
                  {car.make}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Model Matches */}
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
                  href={`/${m.make}/${m.model}`}
                  className="bg-[#131b2f] border border-white/5 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col transition-all group"
                >
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{m.make}</span>
                  <span className="text-lg font-bold text-slate-200 group-hover:text-white uppercase">{m.model}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {!exactCodeMatch && matchedModels.length === 0 && (
          <div className="text-center py-24">
            <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('noResults')}</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              {t('noResultsDesc', { query: rawQuery })}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
