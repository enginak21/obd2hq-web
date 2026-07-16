'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { resolveLocalizedSymptomPath } from '@/data/symptom-content-routing';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'tr', name: 'Türkçe' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLanguage = (newLocale: string) => {
    const localizedSymptomPath = resolveLocalizedSymptomPath(pathname, newLocale);
    if (localizedSymptomPath) {
      router.push(localizedSymptomPath);
      setIsOpen(false);
      return;
    }

    // pathname starts with /en, /es, etc.
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Change language, current language is ${currentLang.name}`}
        aria-expanded={isOpen}
        className="flex h-10 min-w-10 items-center justify-center sm:justify-start sm:space-x-2 text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline-block">{currentLang.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#1a2333] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                locale === lang.code 
                  ? 'bg-blue-600/20 text-blue-400 font-semibold' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
