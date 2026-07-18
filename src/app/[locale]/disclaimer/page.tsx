import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: getAlternates('disclaimer', locale),
  };
}

export default async function DisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'DisclaimerPage' });

  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto prose prose-invert prose-blue">
        <h1 className="text-4xl font-bold text-white mb-8">{t('title')}</h1>
        
        <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl mb-8 text-amber-200">
          <strong>{t('warning')}</strong> {t('warningText')}
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('noAdvice')}</h2>
        <p className="text-slate-300 leading-relaxed">
          {t('noAdviceText')}
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('risk')}</h2>
        <p className="text-slate-300 leading-relaxed">
          {t('riskText')}
        </p>
      </div>
    </main>
  );
}
