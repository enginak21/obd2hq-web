import { notFound } from 'next/navigation';
import { cars, codes } from '@/data/db';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
    model: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model } = resolvedParams;
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  
  if (!isValidCar) return { title: 'Not Found' };
  
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  
  return { 
    title: `1996-2026 ${capMake} ${capModel} OBD2 Codes & Warning Lights`,
    description: `Complete diagnostic data for ${capMake} ${capModel} (1996-2026). Search all OBD2 trouble codes and dashboard warning light meanings.`
  };
}

export default async function ModelDirectoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { locale, make, model } = resolvedParams;
  setRequestLocale(locale);
  const resolvedSearchParams = await searchParams;
  
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!isValidCar) notFound();

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  // Pagination Logic
  const PAGE_SIZE = 200;
  const pageParam = resolvedSearchParams.page;
  let currentPage = parseInt(pageParam || '1', 10);
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

  const allCodes = Object.keys(codes);
  const totalCodes = allCodes.length;
  const totalPages = Math.ceil(totalCodes / PAGE_SIZE);

  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayCodes = allCodes.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{tCode('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <Link href={`/${locale}/${make}`} className="hover:text-blue-400 transition-colors capitalize shrink-0">{make}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-white uppercase shrink-0">{model}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-3 mb-4">
                <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold tracking-wide">
                  Years: 1996 - 2026
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {capMake} <span className="uppercase">{model}</span> Diagnostics
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl font-light">
                Comprehensive diagnostic database for all {capMake} {capModel} vehicles manufactured between 1996 and 2026.
              </p>
            </div>
            
            <Link 
              href={`/${locale}/${make}/${model}/lights`}
              className="group flex flex-col items-center justify-center p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl hover:bg-amber-500/20 transition-all duration-300 w-full md:w-64 shrink-0"
            >
              <svg className="w-10 h-10 text-amber-500 mb-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
              <span className="text-amber-500 font-bold text-lg text-center leading-tight">Dashboard<br/>Warning Lights</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center mb-4 sm:mb-0">
            <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Powertrain (P) Codes
          </h2>
          <span className="text-sm text-slate-500 font-medium bg-[#131b2f] px-3 py-1 rounded-full border border-white/5">
            Showing {startIndex + 1} - {Math.min(endIndex, totalCodes)} of {totalCodes.toLocaleString()} codes
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displayCodes.map((code) => (
            <Link 
              key={code} 
              href={`/${locale}/${make}/${model}/${code.toLowerCase()}`}
              className="group flex items-center justify-center py-4 bg-[#131b2f] border border-white/5 hover:border-blue-500/50 hover:bg-[#1a233a] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.2)]"
            >
              <span className="text-slate-300 group-hover:text-blue-300 text-sm font-bold tracking-wider">
                {code}
              </span>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-4">
            {currentPage > 1 ? (
              <Link
                href={`/${locale}/${make}/${model}?page=${currentPage - 1}`}
                className="px-6 py-3 bg-[#131b2f] border border-white/10 hover:border-blue-500 hover:text-white rounded-xl text-slate-300 font-bold transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Previous
              </Link>
            ) : (
              <span className="px-6 py-3 bg-[#131b2f]/50 border border-white/5 rounded-xl text-slate-600 font-bold cursor-not-allowed">
                Previous
              </span>
            )}
            
            <span className="text-slate-400 font-medium bg-[#0d1425] px-4 py-2 rounded-lg border border-white/5">
              Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={`/${locale}/${make}/${model}?page=${currentPage + 1}`}
                className="px-6 py-3 bg-[#131b2f] border border-white/10 hover:border-blue-500 hover:text-white rounded-xl text-slate-300 font-bold transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Next
              </Link>
            ) : (
              <span className="px-6 py-3 bg-[#131b2f]/50 border border-white/5 rounded-xl text-slate-600 font-bold cursor-not-allowed">
                Next
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
