'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('CommonUI');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center bg-[#0a0f1c] px-6 text-center">
      <div className="bg-red-500/10 p-6 rounded-full border border-red-500/20 mb-8">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-black text-white mb-4">{t('systemMalfunction')}</h2>
      <p className="text-slate-400 max-w-md mb-8 text-lg">
        {t('errorDesc')}
      </p>
      
      <button
        onClick={() => reset()}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
      >
        <RefreshCw className="w-5 h-5" />
        <span>{t('tryAgain')}</span>
      </button>
    </div>
  );
}
