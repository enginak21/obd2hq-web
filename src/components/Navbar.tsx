'use client';

import Link from 'next/link';
import { Search, Menu, Activity } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      // Basic client side routing. For now, we will route to a search page (to be built) or try to interpret the code
      // If it looks like a code (e.g. P0420), we could route directly to it, but we need make/model for that.
      // So we just route to a global search.
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group shrink-0">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hidden sm:block">
            <Activity className="w-6 h-6 text-white" />
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
              placeholder="Search code (e.g., P0420) or car make..."
              className="w-full bg-[#131b2f] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </form>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Makes</Link>
          <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-300 hover:text-white shrink-0"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#131b2f] border-b border-white/10 px-6 py-4 flex flex-col space-y-4">
          <Link href="/" className="text-slate-300 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>Makes</Link>
          <Link href="/about" className="text-slate-300 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className="text-slate-300 hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
