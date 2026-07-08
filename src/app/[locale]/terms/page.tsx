import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Terms of Service - OBD2HQ',
  description: 'Terms of Service for using OBD2HQ database.',
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'TermsPage' });

  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
        <p className="text-slate-400">{t('lastUpdated')} {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('h1')}</h2>
        <p className="text-slate-300 leading-relaxed">
          {t('p1')}
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('h2')}</h2>
        <p className="text-slate-300 leading-relaxed">
          {t('p2')}
        </p>
      </div>
    </main>
  );
}
