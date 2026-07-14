import Link from 'next/link';
import { ArrowRight, Calculator, ScanSearch, Wrench } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { automotiveTools, localizeTool } from '@/data/automotive-tools';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: 'Automotive Diagnostic Tools - OBD2HQ',
    description: 'Free OBD2 diagnostic tools: repair cost calculator, fuel trim analyzer, freeze-frame interpreter, scanner finder and diagnostic assistant.',
    alternates: getAlternates('tools', locale),
  };
}

export default async function ToolsHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <section className="border-b border-white/5 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-200 mb-6">
            <Wrench className="w-4 h-4" />
            Automotive tools
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">
            Tools that turn scan data into next steps.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">
            These tools are designed to capture high-intent search traffic and help users make better diagnostic decisions before replacing parts.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {automotiveTools.map((tool) => {
          const localized = localizeTool(tool, locale);
          return (
            <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="group rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-green-400/40 hover:bg-[#17213a] transition-all">
              <div className="mb-5 rounded-2xl bg-white/5 p-3 w-fit text-green-300">
                {tool.category === 'calculator' ? <Calculator className="w-6 h-6" /> : <ScanSearch className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-black text-white">{localized.title}</h2>
              <p className="mt-3 text-slate-400 leading-relaxed">{localized.description}</p>
              <div className="mt-6 flex items-center justify-between text-sm font-bold text-green-300">
                Open tool
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
