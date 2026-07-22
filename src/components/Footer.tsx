import Link from 'next/link';
import { Activity } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getFooterLinkGroups } from '@/data/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const linkGroups = getFooterLinkGroups(locale);

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0a0f1c] pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <Link href={`/${locale}`} className="mb-6 flex items-center space-x-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 p-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                OBD2<span className="text-blue-500">HQ</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">{group.title}</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}`}>
                      <Link href={link.href} className="transition-colors hover:text-blue-400">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/5 pt-8 text-xs text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Max Ajans ile tüm hakları saklıdır.</p>
          <p className="mt-2 md:mt-0">{t('builtFor')}</p>
        </div>
      </div>
    </footer>
  );
}
