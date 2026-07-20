import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  return (
    <footer className="bg-[#0a0f1c] border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">


          <div className="col-span-1 md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                OBD2<span className="text-blue-500">HQ</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>


          <div>
            <h4 className="text-white font-bold mb-4">{t('links')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href={`/${locale}`} className="hover:text-blue-400 transition-colors">{t('searchByMake')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('resources')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href={`/${locale}/about`} className="hover:text-blue-400 transition-colors">{t('aboutUs')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-blue-400 transition-colors">{t('contact')}</Link></li>
              <li><Link href={`/${locale}/blog`} className="hover:text-blue-400 transition-colors">{t('blog')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">{t('legal')}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href={`/${locale}/privacy`} className="hover:text-blue-400 transition-colors">{t('privacyPolicy')}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-blue-400 transition-colors">{t('termsOfService')}</Link></li>
              <li><Link href={`/${locale}/disclaimer`} className="hover:text-blue-400 transition-colors">{t('disclaimer')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Max Ajans ile tüm hakları saklıdır.</p>
          <p className="mt-2 md:mt-0">{t('builtFor')}</p>
        </div>
      </div>
    </footer>
  );
}
