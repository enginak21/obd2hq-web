'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Car, Search, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  VehicleOption,
  findVehicleMatches,
  getDiagnosticSearchTarget,
  normalizeCode,
} from '@/utils/diagnosticSearch';
import { getWarningLightsHubPath } from '@/data/navigation';

type SmartSearchProps = {
  vehicles: VehicleOption[];
  priorityCodes: string[];
  variant?: 'hero' | 'nav';
};

export default function SmartSearch({ vehicles, priorityCodes, variant = 'hero' }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const isHero = variant === 'hero';
  const t = useTranslations('SmartSearch');

  const normalizedCode = normalizeCode(query);
  const vehicleMatches = useMemo(() => findVehicleMatches(query, vehicles, isHero ? 5 : 3), [query, vehicles, isHero]);
  const showSuggestions = isHero && (query.trim().length > 1 || normalizedCode);

  const submitSearch = (value = query) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) return;
    router.push(getDiagnosticSearchTarget(locale, trimmed, vehicles));
  };

  return (
    <div className={isHero ? 'w-full max-w-3xl mx-auto mt-8 mb-8 z-20 relative' : 'w-full'}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
        className={isHero ? 'relative group flex items-center shadow-2xl shadow-blue-500/10 rounded-3xl' : 'relative w-full group'}
      >
        {isHero && <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />}
        <div className={isHero ? 'relative flex w-full items-center bg-[#131b2f] border border-white/10 rounded-3xl p-2 pl-5 overflow-hidden focus-within:border-blue-500/50 transition-colors' : 'relative'}>
          <div className={isHero ? 'shrink-0' : 'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'}>
            <Search className={isHero ? 'w-6 h-6 text-blue-400 mr-4' : 'w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors'} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isHero ? t('heroPlaceholder') : t('navPlaceholder')}
            className={isHero ? 'flex-1 min-w-0 bg-transparent border-none outline-none text-white text-base sm:text-xl placeholder-slate-500 py-3 font-medium' : 'w-full bg-[#131b2f] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'}
            aria-label={t('ariaLabel')}
          />
          {isHero && (
            <button
              type="submit"
              aria-label={t('submitAria')}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl min-h-12 min-w-12 sm:min-w-0 sm:px-6 py-3 font-bold flex items-center justify-center transition-colors ml-2 shadow-lg shadow-blue-600/30 shrink-0"
            >
              <span className="hidden sm:inline mr-2">{t('findFix')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isHero && (
        <div className="mt-4 space-y-4">
          {showSuggestions && (
            <div className="bg-[#101827]/95 border border-white/10 rounded-2xl p-3 shadow-2xl text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {normalizedCode && (
                  <Link
                    href={`/${locale}/search?q=${normalizedCode}`}
                    className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-amber-200 hover:bg-amber-500/15 transition-colors"
                  >
                    <span className="font-bold">{t('foundCode', { code: normalizedCode })}</span>
                    <span className="text-xs text-amber-300">{t('chooseCar')}</span>
                  </Link>
                )}
                {vehicleMatches.map((match) => (
                  <Link
                    key={match.hrefPart}
                    href={`/${locale}/${match.hrefPart}`}
                    className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-slate-200 hover:bg-white/10 hover:border-blue-500/30 transition-colors"
                  >
                    <span className="font-semibold">{match.label}</span>
                    <Car className="w-4 h-4 text-blue-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {priorityCodes.slice(0, 6).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => submitSearch(code)}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-blue-400" />
                {code}
              </button>
            ))}
            <Link href={getWarningLightsHubPath(locale)} className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/15 transition-colors">
              {t('unknownCode')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
