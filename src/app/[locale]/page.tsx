import Link from 'next/link';
import { cars } from '@/data/db';
import { Car, ShieldCheck, Wrench, Zap } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import SmartSearch from '@/components/SmartSearch';
import FindYourFixWizard from '@/components/FindYourFixWizard';
import { PRIORITY_CODES } from '@/data/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    alternates: getAlternates('', locale)
  };
}
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const vehicleOptions = cars.map(({ make, models }) => ({ make, models }));

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OBD2HQ",
    "url": `https://obd2hq.com/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://obd2hq.com/${locale}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 selection:bg-blue-500/30 font-sans flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* Premium Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden border-b border-white/5 w-full">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 sm:pt-24 sm:pb-32 min-h-[760px] sm:min-h-[720px] flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-300 tracking-wide">{t('databaseUpdated')}</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400">
            {t('title1')} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{t('title2')}</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-slate-400 max-w-3xl mb-4 font-light leading-relaxed">
            {t('subtitle')}
          </p>

          <SmartSearch vehicles={vehicleOptions} priorityCodes={PRIORITY_CODES} />
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center space-x-2 text-slate-300">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="font-medium text-sm">{t('mechanicVerified')}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-medium text-sm">{t('instantSearch')}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Wrench className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-sm">{t('diyGuides')}</span>
            </div>
          </div>
        </div>
      </div>

      <FindYourFixWizard vehicles={vehicleOptions} priorityCodes={PRIORITY_CODES} />

      {/* Main Content Area (Layout with Sidebar Ads) */}
      <div className="w-full max-w-[1600px] flex justify-center items-start">
        
        {/* Left Ad */}
        {/* Left Ad */}
        <aside className="hidden 2xl:flex w-[160px] h-[600px] sticky top-28 bg-[#131b2f] border border-white/5 rounded-2xl items-center justify-center text-slate-600 text-xs mt-12 mx-4 shrink-0 text-center px-4">
          {t('leftAd')}
        </aside>

        <div className="flex-1 max-w-6xl w-full px-6 py-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 border-b border-white/5 pb-6">
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
              <Car className="w-8 h-8 mr-3 text-blue-500" />
              {t('browseByMake')}
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-2 sm:mt-0">{t('selectBrand')}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cars.slice(0, 15).map((car) => (
              <Link 
                key={car.make} 
                href={`/${locale}/${car.make}`}
                className="group flex flex-col items-center justify-center bg-[#131b2f] border border-white/5 hover:border-blue-500/40 hover:bg-[#1a233a] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(37,99,235,0.2)]"
              >
                <div className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  <BrandLogo make={car.make} className="w-full h-full text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-300 group-hover:text-white uppercase tracking-wider text-center">
                  {car.make.replace('-', ' ')}
                </h3>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link 
              href={`/${locale}/search`} 
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all font-medium flex items-center"
            >
              View All Makes
            </Link>
          </div>

          {/* Bottom Ad */}
          {/* Bottom Ad */}
          <div className="w-full h-[90px] bg-[#131b2f] border border-white/5 rounded-xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide mt-16 shadow-inner hidden sm:flex">
            {t('leaderboardAd')}
          </div>
        </div>

        {/* Right Ad */}
        {/* Right Ad */}
        <aside className="hidden 2xl:flex w-[160px] h-[600px] sticky top-28 bg-[#131b2f] border border-white/5 rounded-2xl items-center justify-center text-slate-600 text-xs mt-12 mx-4 shrink-0 text-center px-4">
          {t('rightAd')}
        </aside>
      </div>
    </main>
  );
}
