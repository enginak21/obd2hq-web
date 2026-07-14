'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Search, Sparkles } from 'lucide-react';

export default function ToolSimulator({ toolSlug }: { toolSlug: string }) {
  const [code, setCode] = useState('P0420');
  const [symptom, setSymptom] = useState('engine shaking');
  const [stft, setStft] = useState('12');
  const [ltft, setLtft] = useState('18');
  const [rpm, setRpm] = useState('2200');
  const [load, setLoad] = useState('62');

  const result = useMemo(() => {
    if (toolSlug === 'fuel-trim-analyzer') {
      const short = Number(stft);
      const long = Number(ltft);
      if (short > 10 && long > 10) return 'Positive trims on both short and long term suggest unmetered air, low fuel pressure, dirty MAF data, or exhaust leak before the upstream O2 sensor. Start with intake smoke test and MAF review.';
      if (short < -10 && long < -10) return 'Negative trims suggest rich operation: leaking injector, high fuel pressure, EVAP purge stuck open, restricted air intake, or biased sensor data.';
      return 'Fuel trims are close to normal. Compare idle vs cruise and look at related codes before replacing sensors.';
    }
    if (toolSlug === 'freeze-frame-interpreter') {
      const loadValue = Number(load);
      const rpmValue = Number(rpm);
      if (loadValue > 55 && rpmValue > 1800) return 'The fault happened under load. Prioritize fuel delivery, air metering, boost leaks, catalyst restriction, and ignition breakdown under acceleration.';
      return 'The fault happened at low load or idle. Prioritize vacuum leaks, idle control, fuel trim, coolant temperature data, and connector issues.';
    }
    if (toolSlug === 'repair-cost-calculator') {
      const upper = code.toUpperCase().replace(/\s/g, '');
      if (upper === 'P0420') return 'Cheap path: exhaust leak or O2 wiring repair. Typical path: oxygen sensor or exhaust repair. Expensive path: catalytic converter only after live-data proof.';
      if (upper === 'P0300') return 'Cheap path: plugs, coil boot, vacuum leak. Typical path: coils or injector diagnosis. Expensive path: compression/timing repair after mechanical testing.';
      return 'Start with scan confirmation, related codes, visual inspection and live data. Avoid buying the named part until power, ground, signal and operating conditions are verified.';
    }
    if (toolSlug === 'scanner-finder') {
      return 'For most owners, choose a scanner with live data, freeze-frame, I/M readiness and code definitions. For ABS, airbag or transmission lights, buy a model that explicitly supports those modules.';
    }
    return `For ${code.toUpperCase()} with ${symptom}, start by saving freeze-frame data, checking related codes, inspecting connectors/hoses, and verifying live data before replacing parts.`;
  }, [code, load, ltft, rpm, stft, symptom, toolSlug]);

  return (
    <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Interactive preview</h2>
          <p className="text-sm text-slate-400">Rule-based guidance, not a final repair diagnosis.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(toolSlug === 'diagnostic-assistant' || toolSlug === 'repair-cost-calculator') && (
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-300">OBD2 code</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-white outline-none focus:border-blue-400" />
          </label>
        )}
        {toolSlug === 'diagnostic-assistant' && (
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-300">Main symptom</span>
            <input value={symptom} onChange={(e) => setSymptom(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-white outline-none focus:border-blue-400" />
          </label>
        )}
        {toolSlug === 'fuel-trim-analyzer' && (
          <>
            <NumberInput label="STFT %" value={stft} setValue={setStft} />
            <NumberInput label="LTFT %" value={ltft} setValue={setLtft} />
          </>
        )}
        {toolSlug === 'freeze-frame-interpreter' && (
          <>
            <NumberInput label="RPM" value={rpm} setValue={setRpm} />
            <NumberInput label="Engine load %" value={load} setValue={setLoad} />
          </>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#0a0f1c] p-5">
        <h3 className="font-black text-white flex items-center gap-2">
          {toolSlug === 'fuel-trim-analyzer' ? <Gauge className="w-5 h-5 text-green-300" /> : <Search className="w-5 h-5 text-green-300" />}
          Suggested direction
        </h3>
        <p className="mt-3 text-slate-300 leading-relaxed">{result}</p>
        <div className="mt-4 flex items-start gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          This tool helps prioritize checks. Safety-critical symptoms, fuel leaks, brake faults and flashing check engine lights should be inspected by a qualified technician.
        </div>
      </div>
    </div>
  );
}

function NumberInput({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-300">{label}</span>
      <input value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" className="w-full rounded-2xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-white outline-none focus:border-blue-400" />
    </label>
  );
}
