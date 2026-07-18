import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { FileText, ShieldCheck, PenTool, CheckCircle, BookOpen } from 'lucide-react';
import { getAlternates } from '@/utils/seo';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'EditorialPolicyPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: getAlternates('editorial-policy', locale),
  };
}

export default async function EditorialPolicyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'EditorialPolicyPage' });

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <header className="relative border-b border-white/5 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full mb-6">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-semibold tracking-wide">{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <p className="mt-4 text-sm text-slate-500">{t('lastUpdated')}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 mt-16 space-y-12 prose prose-invert prose-lg max-w-none">
        
        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <ShieldCheck className="w-6 h-6 mr-3 text-blue-500" />
            {t('dataTitle')}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {t('dataText')}
          </p>
        </section>

        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
            {t('reviewTitle')}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {t('reviewText')}
          </p>
        </section>

        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
            {t('methodologyTitle')}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {t('methodologyText')}
          </p>
        </section>

        <section>
          <h2 className="flex items-center text-2xl font-bold text-white mb-4">
            <PenTool className="w-6 h-6 mr-3 text-amber-500" />
            {t('objectivityTitle')}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {t('objectivityText')}
          </p>
        </section>

        <section className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 mt-12">
          <h3 className="text-xl font-bold text-red-400 mb-3">{t('disclaimerTitle')}</h3>
          <p className="text-slate-300 text-base">
            {t('disclaimerText')}
          </p>
        </section>

        <div className="text-center mt-12 pt-12 border-t border-white/5">
          <Link href={`/${locale}`} className="text-blue-400 hover:text-white font-medium transition-colors">
            {t('returnHome')}
          </Link>
        </div>

      </div>
    </main>
  );
}
