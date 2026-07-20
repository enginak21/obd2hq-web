import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: getAlternates('privacy', locale),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });

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

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">{t('h3')}</h2>
        <p className="text-slate-300 leading-relaxed">
          {t('p3')}
        </p>
      </div>
    </main>
  );
}
