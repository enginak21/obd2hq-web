import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer - OBD2HQ',
  description: 'Medical and Technical Disclaimer for OBD2HQ.',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">Medical & Technical Disclaimer</h1>
        
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl mb-8 text-amber-200">
          <strong>WARNING:</strong> Automotive repair can be dangerous and potentially fatal if performed incorrectly. Always consult a certified mechanic if you are unsure of your abilities.
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">No Professional Advice</h2>
        <p className="text-slate-300 leading-relaxed">
          The information contained on OBD2HQ is provided for informational and educational purposes only. It should not be construed as professional mechanical or engineering advice. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or suitability of the diagnostic information provided.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Assumption of Risk</h2>
        <p className="text-slate-300 leading-relaxed">
          Any reliance you place on such information is therefore strictly at your own risk. Working on vehicles, especially high-voltage electrical systems (Hybrid/EV) or fuel systems, carries immense risk of injury, death, or catastrophic property damage. OBD2HQ and its creators are not liable for any damages, injuries, or financial losses incurred from using our database.
        </p>
      </div>
    </main>
  );
}
