'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const t = useTranslations('Navbar'); // Reuse Navbar translations for search

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-16 z-20 relative">
      <form onSubmit={handleSearch} className="relative group flex items-center shadow-2xl shadow-blue-500/10 rounded-full">
        {/* Glow behind the input */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
        
        <div className="relative flex w-full items-center bg-[#131b2f] border border-white/10 rounded-full p-2 pl-6 overflow-hidden focus-within:border-blue-500/50 transition-colors">
          <Search className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. P0100, Audi, Mass Air Flow..."
            className="flex-1 bg-transparent border-none outline-none text-white text-lg sm:text-xl placeholder-slate-500 py-3 font-medium"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-3 font-bold flex items-center transition-colors ml-2 shadow-lg shadow-blue-600/30 shrink-0"
          >
            <span className="hidden sm:inline mr-2">Diagnose Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
