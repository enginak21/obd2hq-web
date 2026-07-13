import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ShieldCheck, BookOpen, Users, Mail } from 'lucide-react';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Our Editorial Team | OBD2HQ',
  description: 'Meet the OBD2HQ Editorial Team. We are dedicated to providing accurate, verifiable, and easy-to-understand automotive diagnostic information.',
};

export default async function ReviewersPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="relative border-b border-white/5 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-semibold tracking-wide">Editorially Reviewed</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            The OBD2HQ Editorial Team
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
            Our mission is to democratize automotive diagnostics. Every piece of diagnostic data on OBD2HQ is rigorously cross-referenced against OEM service manuals, verified technical service bulletins (TSBs), and aggregated real-world repair data.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-16">
        
        {/* Editorial Team Profile */}
        <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border-4 border-[#0a0f1c] shadow-xl shrink-0 overflow-hidden flex items-center justify-center">
            <Users className="w-20 h-20 text-slate-500" />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">OBD2HQ Editorial Team</h2>
                <p className="text-blue-400 font-medium">Data Aggregation & Verification</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">
              Rather than relying on a single individual, OBD2HQ utilizes a data-driven editorial approach. We aggregate diagnostic codes, symptoms, and fixes from thousands of documented repairs, cross-referencing them to ensure you get the most statistically probable cause for your specific vehicle make and model.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-slate-400">
                <BookOpen className="w-5 h-5 mr-3 text-slate-500" />
                <span>OEM Manual Cross-Referencing</span>
              </div>
              <div className="flex items-center text-slate-400">
                <ShieldCheck className="w-5 h-5 mr-3 text-slate-500" />
                <span>Data-Driven Verification</span>
              </div>
              <div className="flex items-center text-slate-400 sm:col-span-2 mt-4 pt-4 border-t border-white/10">
                <Mail className="w-5 h-5 mr-3 text-slate-500" />
                <a href="mailto:editorial@obd2hq.com" className="hover:text-white transition-colors">editorial@obd2hq.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-blue-900/10 border border-blue-500/20 rounded-3xl p-10">
          <h3 className="text-2xl font-bold text-white mb-4">Are you an ASE Certified Professional?</h3>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            We are always looking for verified experts to join our review board. If you want to help democratize diagnostic data and have verifiable credentials, we'd love to hear from you.
          </p>
          <Link href={`/${locale}/contact`} className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
            Contact Us
          </Link>
        </div>

      </div>
    </main>
  );
}
