import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { FileText, ShieldCheck, PenTool, CheckCircle, BookOpen } from 'lucide-react';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Editorial Policy & Guidelines | OBD2HQ',
  description: 'Learn about the OBD2HQ editorial process, our data sources, and how we ensure the accuracy of our automotive diagnostic information.',
};

export default async function EditorialPolicyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="relative border-b border-white/5 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-6">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-semibold tracking-wide">Editorial Guidelines</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Our Editorial Policy
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
            Trust is the foundation of OBD2HQ. When a warning light illuminates on your dashboard, you need accurate, unbiased, and actionable information. Here is how we ensure our data meets the highest standards.
          </p>
          <p className="mt-4 text-sm text-slate-500">Last updated: July 2026</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 mt-16 space-y-12 prose prose-invert prose-lg max-w-none">
        
        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-500" />
            1. Data Aggregation & Accuracy
          </h2>
          <p className="text-slate-300 leading-relaxed">
            OBD2HQ combines standardized OBD-II trouble code definitions, publicly available service information, technical service bulletin research, and aggregated repair-pattern analysis. When a page does not yet have verified model-specific data, we clearly label it as a general OBD-II guide instead of presenting it as vehicle-specific certainty.
          </p>
        </section>

        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
            2. The Review Process
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Our diagnostic data is maintained and editorially reviewed by the OBD2HQ team. While individual codes are standardized by the Society of Automotive Engineers (SAE), manufacturer-specific codes (P1XXX series) and fix priorities vary wildly. Our team ensures that the most statistically common fixes are presented first to prevent you from wasting money on the "parts cannon" approach.
          </p>
        </section>

        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
            3. Review Methodology
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Each priority guide is checked for five practical questions: what the code means, whether the vehicle is safe to drive, which low-cost checks should happen first, which related codes change the diagnosis, and what repair path avoids unnecessary part replacement. We update pages as Search Console data reveals new user questions and weak spots.
          </p>
        </section>

        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <PenTool className="w-6 h-6 mr-3 text-amber-500" />
            4. Objectivity and Affiliate Disclosure
          </h2>
          <p className="text-slate-300 leading-relaxed">
            OBD2HQ remains strictly objective. If we recommend an OBD2 scanner or a specific brand of replacement part, it is because our team believes it offers the best value. We do participate in affiliate programs (such as the Amazon Associates program), which means we may earn a commission if you click a link and make a purchase. However, this never influences our diagnostic data or repair advice.
          </p>
        </section>

        <section className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 mt-12">
          <h3 className="text-xl font-bold text-red-400 mb-3">Technical Disclaimer</h3>
          <p className="text-slate-300 text-base">
            Automotive repair carries inherent risks. The information provided by OBD2HQ is for educational and informational purposes only. Working on complex automotive systems, especially high-voltage EV components or high-pressure fuel systems, can result in severe injury or death. Always consult a certified professional mechanic if you are unsure of your abilities. OBD2HQ assumes no liability for property damage or injury incurred as a result of any of the information contained on this website.
          </p>
        </section>

        <div className="text-center mt-12 pt-12 border-t border-white/5">
          <Link href={`/${locale}`} className="text-blue-400 hover:text-white font-medium transition-colors">
            Return to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}
