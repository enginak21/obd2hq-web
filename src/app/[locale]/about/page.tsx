import { Metadata } from 'next';
import { ShieldCheck, Target, Users } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="border-b border-white/5 pt-16 pb-16 bg-[#0d1425]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
            {t('title1')} <span className="text-blue-500">{t('title2')}</span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-16">
        <section className="grid sm:grid-cols-3 gap-8">
          <div className="bg-[#131b2f] p-8 rounded-3xl border border-white/5 text-center">
            <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t('mission')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('missionDesc')}
            </p>
          </div>
          <div className="bg-[#131b2f] p-8 rounded-3xl border border-white/5 text-center">
            <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t('verified')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('verifiedDesc')}
            </p>
          </div>
          <div className="bg-[#131b2f] p-8 rounded-3xl border border-white/5 text-center">
            <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t('everyone')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('everyoneDesc')}
            </p>
          </div>
        </section>

        <section className="prose prose-invert prose-blue max-w-none">
          <h2 className="text-2xl font-bold text-white">{t('story')}</h2>
          <p className="text-slate-300 leading-relaxed mt-4">
            {t('storyP1')}
          </p>
          <p className="text-slate-300 leading-relaxed mt-4">
            {t('storyP2')}
          </p>
        </section>
      </div>
    </main>
  );
}
