import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - OBD2HQ',
  description: 'Terms of Service for using OBD2HQ database.',
};

export default function TermsPage() {
  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-slate-300 leading-relaxed">
          By accessing and using OBD2HQ, you accept and agree to be bound by the terms and provision of this agreement. 
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Use of Information</h2>
        <p className="text-slate-300 leading-relaxed">
          The information provided on OBD2HQ is for educational and informational purposes only. We do not guarantee the absolute accuracy of the diagnostic data. Automotive repair involves inherent risks.
        </p>
      </div>
    </main>
  );
}
