'use client';

import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const t = useTranslations('Navbar');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-3 group shrink-0">
          <div className="rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all hidden sm:block">
            <Image src="/icon.jpg" alt="OBD2HQ Premium Logo" width={40} height={40} className="w-10 h-10 object-cover" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
            OBD2<span className="text-blue-500">HQ</span>
          </span>
        </Link>

        {/* Search Bar (Visible on all sizes) */}
        <div className="flex flex-1 max-w-xl ml-4 sm:ml-8 mr-2 sm:mr-8">
          <form onSubmit={handleSearch} className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#131b2f] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </form>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-300">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{t('makes')}</Link>
          <Link href={`/${locale}/blog`} className="hover:text-white transition-colors text-blue-400">{t('blog')}</Link>
          <Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('aboutUs')}</Link>
          <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t('contact')}</Link>
          <div className="w-px h-5 bg-white/10 mx-2"></div>
          <LanguageSwitcher />
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher />
          <button 
            className="text-slate-300 hover:text-white shrink-0 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="mobile-menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#131b2f] border-b border-white/10 px-6 py-4 flex flex-col space-y-4">
          <Link href={`/${locale}`} className="text-slate-300 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>{t('makes')}</Link>
          <Link href={`/${locale}/blog`} className="text-blue-400 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>{t('blog')}</Link>
          <Link href={`/${locale}/about`} className="text-slate-300 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>{t('aboutUs')}</Link>
          <Link href={`/${locale}/contact`} className="text-slate-300 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>{t('contact')}</Link>
        </div>
      )}
    </nav>
  );
}
