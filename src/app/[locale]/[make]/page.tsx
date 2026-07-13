import { notFound } from 'next/navigation';
import { cars } from '@/data/db';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Car, ChevronRight } from 'lucide-react';
import { getAlternates } from '@/utils/seo';
import { CODE_CATEGORIES, PRIORITY_CODES } from '@/data/seo';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: any[] = [];
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
    title: `${capMake} OBD2 Codes & Dashboard Warning Lights`,
    description: `Complete diagnostic guide for all ${capMake} models. Find out what your ${capMake} OBD2 trouble code or dashboard warning light means and how to fix it.`,
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
            Top Searched Codes for {capMake}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {PRIORITY_CODES.slice(0, 8).map((code) => (
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

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-[#131b2f] border border-white/5 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Common {capMake} Diagnostic Areas</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Start with the system family that matches your warning light or scan result. This helps you avoid replacing parts before confirming whether the issue is engine, emissions, fuel trim, sensor, or transmission related.
            </p>
            <div className="space-y-4">
              {CODE_CATEGORIES.map(category => (
                <div key={category.label} className="border-t border-white/5 pt-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">{category.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.codes.slice(0, 4).map(code => (
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
            <h2 className="text-2xl font-bold text-white mb-4">{capMake} Warning Lights</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Dashboard warnings often appear before a code becomes obvious. Open a model page to compare check engine, oil pressure, battery, ABS, coolant, and brake warnings for that vehicle.
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
