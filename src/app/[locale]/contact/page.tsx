import { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans p-6 md:p-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">{t('title')}</h1>
        <p className="text-slate-400 text-center mb-12">
          {t('subtitle')}
        </p>

        <div className="bg-[#131b2f] border border-white/5 p-8 rounded-3xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-blue-500/10 p-4 rounded-full">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{t('emailUs')}</h3>
              <p className="text-slate-400">support@obd2hq.com</p>
            </div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('name')}</label>
              <input type="text" className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder={t('namePlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('email')}</label>
              <input type="email" className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder={t('emailPlaceholder')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">{t('message')}</label>
              <textarea rows={5} className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder={t('messagePlaceholder')}></textarea>
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              {t('send')}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
