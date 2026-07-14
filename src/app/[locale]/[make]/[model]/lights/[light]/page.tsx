import { notFound } from 'next/navigation';
import { cars } from '@/data/db';
import { warningLights } from '@/data/lights';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
    model: string;
    light: string;
  }>;
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model, light } = resolvedParams;
  
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  const lightData = warningLights[light];
  
  if (!isValidCar || !lightData) return { title: 'Not Found' };
  
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  return { 
    title: `${lightData.name} on ${capMake} ${capModel} - Causes & Fixes`,
    description: `Why is the ${lightData.name.toLowerCase()} on in your ${capMake} ${capModel}? Learn the common causes, urgency level, and how to fix it safely.`
  };
}

export default async function LightDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, make, model, light } = resolvedParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'LightDetailPage' });
  
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  const lightData = warningLights[light];
  
  if (!isValidCar || !lightData) notFound();

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  let colorClasses = "";
  if (lightData.color === 'red') {
    colorClasses = "text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]";
  } else if (lightData.color === 'yellow') {
    colorClasses = "text-amber-500 bg-amber-500/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]";
  } else {
    colorClasses = "text-green-500 bg-green-500/10 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]";
  }

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      {/* Premium Header */}
      <header className="relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-[100px] pointer-events-none ${lightData.color === 'red' ? 'bg-red-600/10' : lightData.color === 'yellow' ? 'bg-amber-600/10' : 'bg-green-600/10'}`}></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{t('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{make}</span>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{model}</span>
            <span className="mx-2 shrink-0">/</span>
            <Link href={`/${locale}/${make}/${model}/lights`} className="hover:text-blue-400 transition-colors shrink-0">{t('lights')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-white truncate max-w-[200px] block shrink-0">{lightData.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div 
              className={`w-32 h-32 shrink-0 rounded-3xl flex items-center justify-center border ${colorClasses}`}
              dangerouslySetInnerHTML={{ __html: lightData.iconSvg }}
            />
            
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-lg bg-[#1a233a] border border-white/5 text-slate-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  {capMake} {capModel}
                </span>
                <span className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-bold uppercase tracking-widest ${lightData.urgency === 'Critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' : lightData.urgency === 'Moderate' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'}`}>
                  {t('urgency', { urgency: lightData.urgency })}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {lightData.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Meaning Section */}
          <section className="bg-[#131b2f] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-lg">
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600"></div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {t('whatItMeans', { make: capMake, model: capModel })}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              {t('description', { lightName: lightData.name.toLowerCase(), make: capMake, model: capModel, description: lightData.description })}
            </p>
          </section>

          {/* Causes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {t('commonCauses', { make: capMake, model: capModel })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lightData.commonCauses.map((cause, idx) => (
                <div key={idx} className="bg-[#131b2f] border border-white/5 rounded-xl p-5 flex items-start space-x-4">
                  <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg mt-1 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-slate-300 font-medium">{cause}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Solutions */}
          <section className="bg-gradient-to-br from-[#131b2f] to-[#0d1425] border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {t('whatToDo')}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              {lightData.whatToDo}
            </p>
          </section>
          
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          <div className="w-full h-[250px] bg-[#0d1425] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-600 text-sm font-medium tracking-wide">
            <span>{t('advertisement')}</span>
          </div>
        </div>

      </div>
    </main>
  );
}
