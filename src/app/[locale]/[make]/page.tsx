import { notFound } from 'next/navigation';
import { cars } from '@/data/db';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Car, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
  }>;
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make } = resolvedParams;
  const carData = cars.find(c => c.make === make);
  
  if (!carData) return { title: 'Not Found' };
  
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  
  return { 
    title: `${capMake} OBD2 Codes & Dashboard Warning Lights`,
    description: `Complete diagnostic guide for all ${capMake} models. Find out what your ${capMake} OBD2 trouble code or dashboard warning light means and how to fix it.`
  };
}

export default async function MakeDirectoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, make } = resolvedParams;
  setRequestLocale(locale);
  
  const carData = cars.find(c => c.make === make);
  if (!carData) notFound();

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
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
              {capMake} Diagnostics Hub
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl font-light">
              Select your {capMake} model below to find specific OBD2 trouble codes, dashboard warning light meanings, and step-by-step repair guides for vehicles from 1996 to 2026.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <Car className="w-6 h-6 mr-3 text-blue-500" />
          Select {capMake} Model
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
      </div>
    </main>
  );
}
