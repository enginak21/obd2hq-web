import { notFound } from 'next/navigation';
import { cars, getHybridObdData, baseCodes, getLocalized } from '@/data/db';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import DisqusComments from '@/components/DisqusComments';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
    model: string;
    code: string;
  }>;
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model, code } = resolvedParams;
  const obdData = getHybridObdData(make, model, code);
  if (!obdData) return { title: 'Code Not Found' };
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  const titleObj = getLocalized(obdData.title, resolvedParams.locale);
  const titleStr = typeof titleObj === 'string' ? titleObj : (titleObj?.en || 'Unknown Code');
  
  const title = `1996-2026 ${capMake} ${capModel} ${obdData.code} Code: ${titleStr}`;
  return { 
    title,
    description: `Detailed diagnostic guide for ${obdData.code} on all 1996-2026 ${capMake} ${capModel} vehicles. Symptoms, causes, and repair costs.`
  };
}

export default async function CodePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, make, model, code } = resolvedParams;
  
  const obdData = getHybridObdData(make, model, code);
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!obdData || !isValidCar) notFound();

  const upperCode = obdData.code;
  
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'CodePage' });
  const tDb = await getTranslations({ locale, namespace: 'DB' });

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  const locTitle = getLocalized(obdData.title, locale) || obdData.code;
  const locDescription = getLocalized(obdData.description, locale) || '';
  const locDiagnosticSteps = getLocalized(obdData.diagnosticSteps, locale) || [];
  const locCommonFixes = getLocalized(obdData.commonFixes, locale) || [];
  const locDrivingSafetyDesc = obdData.drivingSafety ? getLocalized(obdData.drivingSafety.description, locale) : '';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What does the ${upperCode} code mean on a ${capMake} ${capModel}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": locDescription.replace(/Engine Control Module/g, `${capMake} Engine Control Module`)
        }
      },
      {
        "@type": "Question",
        "name": `What are the common causes of the ${upperCode} code on a ${capMake}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": obdData.causes.join(', ')
        }
      },
      {
        "@type": "Question",
        "name": `How much does it cost to fix the ${upperCode} code?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The estimated repair cost for the ${upperCode} code is ${obdData.estimatedCost}. This includes parts and labor.`
        }
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "OBD2HQ"
    },
    "reviewedBy": {
      "@type": "Person",
      "name": "ASE Certified Technician"
    }
  };

  // Get 3 random related codes from the base DB to show in the widget
  // (We use a simple pseudo-random based on the char codes of make/model/code to be deterministic)
  const codeKeys = Object.keys(baseCodes || {}).slice(0, 30);
  const hash = make.charCodeAt(0) + model.charCodeAt(0) + code.charCodeAt(0);
  const relatedCode1 = codeKeys[(hash) % codeKeys.length] || 'P0300';
  const relatedCode2 = codeKeys[(hash + 5) % codeKeys.length] || 'P0171';
  const relatedCode3 = codeKeys[(hash + 11) % codeKeys.length] || 'P0420';

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Premium Header */}
      <header className="relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{t('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{make}</span>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{model}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 font-bold text-xl sm:text-2xl tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  {upperCode}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[#1a233a] border border-white/5 text-slate-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  {capMake} {capModel}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs sm:text-sm font-semibold tracking-wide">
                  {t('years')}: 1996 - 2026
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {locTitle}
              </h1>
              <div className="flex items-center text-slate-400 text-sm mt-4">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                {t('aseCertified')}
              </div>
              
              {obdData.drivingSafety && (
                <div className={`mt-6 p-4 rounded-xl border flex items-start space-x-3 ${
                  obdData.drivingSafety.level === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  obdData.drivingSafety.level === 'caution' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                  'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <div>
                    <strong className="block text-white mb-1 font-semibold">{t('drivingSafety')}</strong>
                    <span className="text-sm opacity-90">{locDrivingSafetyDesc}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner Ad Placeholder */}
      <div className="max-w-5xl mx-auto px-6 mt-8 hidden sm:block">
        <div className="w-full h-[90px] bg-[#0d1425] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide">
          {t('leaderboardAd')}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* What does it mean */}
          <section className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-3xl"></div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {t('whatDoesItMean')}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-light mb-4">
              {locDescription.replace(/Engine Control Module/g, `${capMake} Engine Control Module`)}
            </p>
            <p className="text-md text-slate-400 leading-relaxed font-light p-4 bg-white/5 rounded-xl border border-white/5">
              {t('disclaimer', { make: capMake, model: capModel })}
            </p>
          </section>

          {/* In-Article Ad Placeholder */}
          <div className="w-full h-[120px] bg-[#0d1425] border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide my-8">
            {t('inArticleAd')}
          </div>

          {/* Causes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {t('commonCauses')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {obdData.causes.map((cause, idx) => {
                const causeText = cause.startsWith('cause_') ? tDb(cause) : cause;
                return (
                <div key={idx} className="bg-[#131b2f] border border-white/5 rounded-xl p-5 flex items-start space-x-4 hover:border-white/10 transition-colors">
                  <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg mt-1 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-slate-300 font-medium">{causeText}</p>
                </div>
              );
              })}
            </div>
          </section>

          {/* Symptoms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              {t('symptomsToWatch')}
            </h2>
            <div className="bg-[#131b2f] border border-white/5 rounded-2xl p-6">
              <ul className="space-y-4">
                {obdData.symptoms.map((symptom, idx) => {
                  const symptomText = symptom.startsWith('symp_') ? tDb(symptom) : symptom;
                  return (
                  <li key={idx} className="flex items-center space-x-3 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                    <span className="text-lg">{symptomText}</span>
                  </li>
                );
                })}
              </ul>
            </div>
          </section>

          {/* Diagnostic Steps (Deep AI Content) */}
          {locDiagnosticSteps && locDiagnosticSteps.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                {t('howToDiagnose')}
              </h2>
              <div className="bg-[#131b2f] border border-white/5 rounded-2xl p-6">
                <div className="space-y-6">
                  {locDiagnosticSteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="text-slate-300 leading-relaxed pt-1">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Common Fixes (Deep AI Content) */}
          {locCommonFixes && locCommonFixes.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                {t('commonFixes')}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {locCommonFixes.map((fix: string, idx: number) => (
                  <div key={idx} className="bg-green-500/5 border border-green-500/10 rounded-xl p-5 flex items-start space-x-4 hover:border-green-500/20 transition-colors">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <p className="text-slate-300 font-medium">{fix}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Disqus Comments */}
          <section className="pt-8">
            <DisqusComments 
              url={`https://obd2hq.com/${locale}/${make}/${model}/${code}`}
              identifier={`${make}-${model}-${code}`}
              title={t('discussionTitle', { code: upperCode, make: capMake, model: capModel })}
            />
          </section>

          {/* Bottom Banner Ad Placeholder */}
          <div className="w-full h-[90px] bg-[#0d1425] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide mt-12 hidden sm:flex">
            {t('bottomLeaderboardAd')}
          </div>

        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          {/* Square Ad Placeholder */}
          <div className="w-full h-[250px] bg-[#0d1425] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-600 text-sm font-medium tracking-wide">
            <span>{t('advertisement')}</span>
            <span className="text-xs text-slate-700 mt-1">{t('sponsorAdSense')}</span>
          </div>

          {/* {t('repairEstimate')} Widget */}
          <div className="bg-gradient-to-br from-[#131b2f] to-[#0d1425] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t('repairEstimate')}</h3>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-4xl font-black text-white">{obdData.estimatedCost}</span>
            </div>
            
            {obdData.costBreakdown ? (
              <div className="mt-4 space-y-3 bg-white/5 p-4 rounded-xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('partsCost')}</span>
                  <span className="text-white font-medium">{obdData.costBreakdown.parts}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{t('laborCost')}</span>
                  <span className="text-white font-medium">{obdData.costBreakdown.labor}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">{t('costIncludesParts')}</p>
            )}
          </div>

          {/* Difficulty Widget */}
          <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t('diyDifficulty')}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  obdData.fixDifficulty === 'Moderate' || obdData.fixDifficulty === 'Medium' || obdData.fixDifficulty === 'Orta' || obdData.fixDifficulty === 'diff_moderate' ? 'w-1/2 bg-amber-500' : 
                  obdData.fixDifficulty === 'Hard' || obdData.fixDifficulty === 'High' || obdData.fixDifficulty === 'diff_hard' || obdData.fixDifficulty === 'diff_professional' ? 'w-full bg-red-500' : 'w-1/4 bg-green-500'
                }`}></div>
              </div>
              <span className="font-bold text-white w-24 text-right">{obdData.fixDifficulty.startsWith('diff_') ? tDb(obdData.fixDifficulty) : obdData.fixDifficulty}</span>
            </div>
          </div>

          {/* Related Codes Widget */}
          <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">{t('relatedCodes', { make: capMake })}</h3>
            <div className="flex flex-col space-y-3">
              {[relatedCode1, relatedCode2, relatedCode3].map(c => (
                <Link key={c} href={`/${locale}/${make}/${model}/${c.toLowerCase()}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                  <span className="font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{c}</span>
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
