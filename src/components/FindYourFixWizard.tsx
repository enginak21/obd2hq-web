'use client';

import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, Car, Gauge } from 'lucide-react';
import { useMemo, useState } from 'react';
import { VehicleOption, formatVehicleName, normalizeCode } from '@/utils/diagnosticSearch';

type FindYourFixWizardProps = {
  vehicles: VehicleOption[];
  priorityCodes: string[];
};

export default function FindYourFixWizard({ vehicles, priorityCodes }: FindYourFixWizardProps) {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [codeInput, setCodeInput] = useState('');

  const selectedVehicle = useMemo(() => vehicles.find(vehicle => vehicle.make === make), [vehicles, make]);
  const normalizedCode = normalizeCode(codeInput);
  const canOpenCode = Boolean(make && model && normalizedCode);
  const canOpenLights = Boolean(make && model);

  const openCode = (code = normalizedCode) => {
    if (!make || !model || !code) return;
    router.push(`/${locale}/${make}/${model}/${code.toLowerCase()}`);
  };

  const openLights = () => {
    if (!make || !model) return;
    router.push(`/${locale}/${make}/${model}/lights`);
  };

  return (
    <section id="find-your-fix" className="w-full max-w-5xl mx-auto px-6 -mt-8 relative z-30 scroll-mt-28">
      <div className="bg-[#101827] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-blue-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">
              <Gauge className="w-4 h-4" />
              Find Your Fix
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Choose car, enter code, open the exact guide.</h2>
          </div>
          <div className="text-sm text-slate-400">Built for first-time OBD2 users.</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.15fr] gap-3">
          <label className="block">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">1. Make</span>
            <select
              value={make}
              onChange={(event) => {
                setMake(event.target.value);
                setModel('');
              }}
              className="w-full h-12 rounded-2xl bg-[#0a0f1c] border border-white/10 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Select make</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.make} value={vehicle.make}>{formatVehicleName(vehicle.make)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">2. Model</span>
            <select
              value={model}
              disabled={!selectedVehicle}
              onChange={(event) => setModel(event.target.value)}
              className="w-full h-12 rounded-2xl bg-[#0a0f1c] border border-white/10 px-4 text-white disabled:text-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Select model</option>
              {selectedVehicle?.models.map(candidate => (
                <option key={candidate} value={candidate}>{formatVehicleName(candidate)}</option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">3. Code</span>
            <div className="flex gap-2">
              <input
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value)}
                placeholder="P0420"
                className="min-w-0 flex-1 h-12 rounded-2xl bg-[#0a0f1c] border border-white/10 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Enter OBD2 trouble code"
              />
              <button
                type="button"
                disabled={!canOpenCode}
                onClick={() => openCode()}
                className="h-12 min-w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center px-4 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                aria-label="Open diagnostic guide"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {priorityCodes.slice(0, 6).map(code => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setCodeInput(code);
                  if (make && model) openCode(code);
                }}
                className="rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors"
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!canOpenLights}
            onClick={openLights}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm font-bold text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-500/15 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            I don't know my code
          </button>
        </div>
      </div>
    </section>
  );
}
