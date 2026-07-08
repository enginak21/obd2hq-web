import { Metadata } from 'next';
import { ShieldCheck, Target, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - OBD2HQ',
  description: 'Learn about our mission to provide the most accurate OBD2 diagnostic data.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="border-b border-white/5 pt-16 pb-16 bg-[#0d1425]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Democratizing <span className="text-blue-500">Auto Repair</span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            We built OBD2HQ because we believe every car owner deserves to know exactly what&apos;s wrong with their vehicle before paying a mechanic.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-16">
        <section className="grid sm:grid-cols-3 gap-8">
          <div className="bg-[#131b2f] p-8 rounded-3xl border border-white/5 text-center">
            <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              To provide the world&apos;s most accurate, easily accessible, and comprehensive database of OBD-II diagnostic trouble codes.
            </p>
          </div>
          <div className="bg-[#131b2f] p-8 rounded-3xl border border-white/5 text-center">
            <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Data</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our data is aggregated from OEM repair manuals and verified by ASE-certified master technicians.
            </p>
          </div>
          <div className="bg-[#131b2f] p-8 rounded-3xl border border-white/5 text-center">
            <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">For Everyone</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether you&apos;re a DIY enthusiast in your garage or a professional mechanic, our platform is built for you.
            </p>
          </div>
        </section>

        <section className="prose prose-invert prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-white">The Story</h2>
          <p className="text-slate-300 leading-relaxed mt-4">
            The automotive industry has traditionally kept diagnostic information locked behind expensive proprietary software subscriptions. Mechanics charge hundreds of dollars just to &quot;plug in the scanner.&quot; We started OBD2HQ to break this monopoly. 
          </p>
          <p className="text-slate-300 leading-relaxed mt-4">
            By compiling data on over 48 global car manufacturers and analyzing over 10,000 specific Diagnostic Trouble Codes (DTCs), we&apos;ve created a search engine specifically for your car&apos;s brain. From a simple loose gas cap (P0456) to a catastrophic hybrid battery failure (P0A80), you now have the knowledge to fix it faster.
          </p>
        </section>
      </div>
    </main>
  );
}
