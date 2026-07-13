interface BrandLogoProps {
  make: string;
  className?: string;
}

export default function BrandLogo({ make, className = "w-10 h-10" }: BrandLogoProps) {
  // To completely eliminate the massive inline SVG payload and improve 
  // Core Web Vitals (LCP, DOM Size), we use a lightweight, CSS-only fallback 
  // for brand logos on the directory pages.
  const initial = make.charAt(0).toUpperCase();
  
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-600 shadow-inner border-2 border-slate-700/50 ${className}`}>
      <div className="w-[85%] h-[85%] rounded-full bg-[#1a233a] flex items-center justify-center">
        <span className="font-bold text-slate-300">{initial}</span>
      </div>
    </div>
  );
}
