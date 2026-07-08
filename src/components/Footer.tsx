import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1c] border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                OBD2<span className="text-blue-500">HQ</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The world&apos;s most comprehensive and technically accurate OBD2 diagnostic and warning light database. Find the fix faster.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Diagnostics</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Search by Make</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">Medical & Tech Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} OBD2HQ. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for car enthusiasts and mechanics worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
