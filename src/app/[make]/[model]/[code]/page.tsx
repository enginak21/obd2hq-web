import { notFound } from 'next/navigation';
import { cars, getHybridObdData } from '@/data/db';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    make: string;
    model: string;
    code: string;
  }>;
}

export async function generateStaticParams() {
  // We have 266,000+ potential pages. 
  // Pre-rendering all of them at build time would crash the server (and Vercel).
  // By returning an empty array, Next.js will use Incremental Static Regeneration (ISR).
  // Pages will be generated lightning-fast on-the-fly the first time a user visits them, 
  // and then permanently cached at the CDN level for all future visitors.
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model, code } = resolvedParams;
  const obdData = getHybridObdData(make, model, code);
  if (!obdData) return { title: 'Code Not Found' };
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  const title = `1996-2026 ${capMake} ${capModel} ${obdData.code} Code: ${obdData.title}`;
  return { 
    title,
    description: `Detailed diagnostic guide for ${obdData.code} on all 1996-2026 ${capMake} ${capModel} vehicles. Symptoms, causes, and repair costs.`
  };
}

export default async function CodePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { make, model, code } = resolvedParams;
  
  const obdData = getHybridObdData(make, model, code);
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!obdData || !isValidCar) notFound();

  const upperCode = obdData.code;

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What does the ${upperCode} code mean on a ${capMake} ${capModel}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": obdData.description.replace(/Engine Control Module/g, `${capMake} Engine Control Module`)
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
    ]
  };

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
            <Link href="/" className="hover:text-blue-400 transition-colors shrink-0">Home</Link>
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
                  Years: 1996 - 2026
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {obdData.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner Ad Placeholder */}
      <div className="max-w-5xl mx-auto px-6 mt-8 hidden sm:block">
        <div className="w-full h-[90px] bg-[#0d1425] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide">
          Advertisement Space (Leaderboard)
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
              What does this mean?
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-light mb-4">
              {obdData.description.replace(/Engine Control Module/g, `${capMake} Engine Control Module`)}
            </p>
            <p className="text-md text-slate-400 leading-relaxed font-light p-4 bg-white/5 rounded-xl border border-white/5">
              <strong>Disclaimer:</strong> This diagnostic code is part of the standard OBD2 system and can apply to <strong>{capMake} {capModel}</strong> models manufactured from <strong>1996 to 2026</strong>. However, please note that the presence of this specific code depends on your vehicle&apos;s exact engine configuration, options (such as Hybrid or Diesel systems), and production year. If your specific model year does not feature the hardware related to this code, your engine control module will simply never trigger it.
            </p>
          </section>

          {/* In-Article Ad Placeholder */}
          <div className="w-full h-[120px] bg-[#0d1425] border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide my-8">
            Advertisement (In-Article)
          </div>

          {/* Causes */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Common Causes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {obdData.causes.map((cause, idx) => (
                <div key={idx} className="bg-[#131b2f] border border-white/5 rounded-xl p-5 flex items-start space-x-4 hover:border-white/10 transition-colors">
                  <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg mt-1 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-slate-300 font-medium">{cause}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Symptoms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              Symptoms to Watch For
            </h2>
            <div className="bg-[#131b2f] border border-white/5 rounded-2xl p-6">
              <ul className="space-y-4">
                {obdData.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-red-500/50"></span>
                    <span className="text-lg">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Bottom Banner Ad Placeholder */}
          <div className="w-full h-[90px] bg-[#0d1425] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 text-sm font-medium tracking-wide mt-12 hidden sm:flex">
            Advertisement Space (Bottom Leaderboard)
          </div>

        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          {/* Square Ad Placeholder */}
          <div className="w-full h-[250px] bg-[#0d1425] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-slate-600 text-sm font-medium tracking-wide">
            <span>Advertisement</span>
            <span className="text-xs text-slate-700 mt-1">Sponsor/AdSense</span>
          </div>

          {/* Repair Estimate Widget */}
          <div className="bg-gradient-to-br from-[#131b2f] to-[#0d1425] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Repair Estimate</h3>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-black text-white">{obdData.estimatedCost}</span>
            </div>
            <p className="text-sm text-slate-500">Includes parts and labor. May vary by location.</p>
          </div>

          {/* Difficulty Widget */}
          <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 shadow-lg">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">DIY Difficulty</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  obdData.fixDifficulty === 'Moderate' || obdData.fixDifficulty === 'Medium' || obdData.fixDifficulty === 'Orta' ? 'w-1/2 bg-amber-500' : 
                  obdData.fixDifficulty === 'Hard' || obdData.fixDifficulty === 'High' ? 'w-full bg-red-500' : 'w-1/4 bg-green-500'
                }`}></div>
              </div>
              <span className="font-bold text-white w-24 text-right">{obdData.fixDifficulty}</span>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
