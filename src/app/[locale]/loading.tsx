import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 min-h-[100dvh] flex flex-col items-center justify-center bg-[#0a0f1c]">
      <div className="relative flex items-center justify-center">
        {/* Pulsing rings */}
        <div className="absolute w-24 h-24 border-4 border-blue-500/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-16 h-16 border-4 border-blue-500/40 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        
        {/* Center Icon */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)]">
          <Activity className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>
      
      <h3 className="mt-8 text-xl font-bold text-white tracking-widest uppercase animate-pulse">
        Scanning Engine...
      </h3>
      <p className="mt-2 text-slate-400 text-sm font-medium">
        Connecting to diagnostic database
      </p>
    </div>
  );
}
