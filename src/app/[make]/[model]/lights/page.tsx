import { notFound } from 'next/navigation';
import { cars } from '@/data/db';
import { warningLights } from '@/data/lights';
import { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    make: string;
    model: string;
  }>;
}

export async function generateStaticParams() {
  return []; // ISR
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { make, model } = resolvedParams;
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!isValidCar) return { title: 'Not Found' };
  
  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  return { 
    title: `${capMake} ${capModel} Dashboard Warning Lights - Meaning & Fixes`,
    description: `Complete guide to all dashboard warning lights and symbols for the ${capMake} ${capModel}. Find out what each light means, its causes, and how to fix it.`
  };
}

export default async function LightsDirectoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { make, model } = resolvedParams;
  
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!isValidCar) notFound();

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);

  const lightsList = Object.values(warningLights);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      {/* Premium Header */}
      <header className="relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href="/" className="hover:text-blue-400 transition-colors shrink-0">Home</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{make}</span>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{model}</span>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-white shrink-0">Lights</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-3 mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-[#1a233a] border border-white/5 text-slate-300 text-sm font-semibold tracking-wide uppercase">
                  {capMake} {capModel}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Dashboard Warning Lights
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl font-light">
                Select a warning light below to see what it means on your {capMake} {capModel}, common causes, and how to fix it immediately.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lightsList.map((light) => {
            let colorClasses = "";
            let glowClasses = "";
            if (light.color === 'red') {
              colorClasses = "text-red-500 bg-red-500/10 border-red-500/30";
              glowClasses = "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]";
            } else if (light.color === 'yellow') {
              colorClasses = "text-amber-500 bg-amber-500/10 border-amber-500/30";
              glowClasses = "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]";
            } else {
              colorClasses = "text-green-500 bg-green-500/10 border-green-500/30";
              glowClasses = "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]";
            }

            return (
              <Link 
                key={light.id} 
                href={`/${make}/${model}/lights/${light.id}`}
                className={`group bg-[#131b2f] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${glowClasses} flex flex-col items-center text-center`}
              >
                <div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${colorClasses} transition-transform duration-300 group-hover:scale-110`}
                  dangerouslySetInnerHTML={{ __html: light.iconSvg }}
                />
                <h3 className="text-lg font-bold text-white mb-2">{light.name}</h3>
                <span className={`text-xs font-bold uppercase tracking-wider ${light.urgency === 'Critical' ? 'text-red-400' : light.urgency === 'Moderate' ? 'text-amber-400' : 'text-blue-400'}`}>
                  {light.urgency}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
