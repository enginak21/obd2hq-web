import Link from 'next/link';
import { AlertTriangle, Home, Search } from 'lucide-react';
import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Page Not Found - OBD2HQ',
  description: 'The requested OBD2 diagnostic code or page could not be found.',
};

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'CommonUI' });

  return (
    <main className="min-h-[80vh] bg-[#0a0f1c] text-slate-200 font-sans flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-500/10 p-6 rounded-full mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <AlertTriangle className="w-20 h-20 text-red-500" />
      </div>

      <h1 className="text-5xl font-black text-white tracking-tight mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-300 mb-6">{t('pageNotFoundTitle')}</h2>

      <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto mb-8">
        {t('pageNotFoundDesc')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          <Home className="w-5 h-5" />
          <span>{t('returnHome')}</span>
        </Link>
        <Link
          href="/search?q="
          className="flex-1 flex items-center justify-center space-x-2 bg-[#131b2f] hover:bg-[#1a233a] border border-white/10 text-white font-bold py-4 rounded-xl transition-all"
        >
          <Search className="w-5 h-5 text-blue-400" />
          <span>{t('searchCodes')}</span>
        </Link>
      </div>
    </main>
  );
}
