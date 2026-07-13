'use client';

import { useEffect } from 'react';

interface AdSlotProps {
  slot: string;
  label: string;
  className?: string;
}

export default function AdSlot({ slot, label, className = '' }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      const w = window as typeof window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // Ad blockers or unavailable AdSense scripts should not break content rendering.
    }
  }, [client]);

  if (!client) {
    return (
      <div className={`border border-dashed border-white/10 bg-white/[0.02] text-slate-600 text-xs rounded-2xl flex items-center justify-center ${className}`}>
        {label}
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
