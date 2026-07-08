import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - OBD2HQ',
  description: 'Privacy policy and data handling practices for OBD2HQ.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information Collection</h2>
        <p className="text-slate-300 leading-relaxed">
          OBD2HQ is a public diagnostic database. We do not require users to create an account or provide personal information to search for OBD2 codes. We may collect anonymous analytics data (such as pages visited or search queries) to improve our database accuracy.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Cookies and Advertising</h2>
        <p className="text-slate-300 leading-relaxed">
          We use third-party advertising partners (such as Google AdSense) to serve ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to our website or other websites. 
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
        <p className="text-slate-300 leading-relaxed">
          While we do not store sensitive personal information, we employ industry-standard security measures to protect the integrity of our diagnostic database and ensure a safe browsing experience.
        </p>
      </div>
    </main>
  );
}
