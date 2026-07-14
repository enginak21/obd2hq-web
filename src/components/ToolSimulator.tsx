'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, Search, Sparkles } from 'lucide-react';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export default function ToolSimulator({ toolSlug, locale }: { toolSlug: string; locale: string }) {
  const copy = getKnowledgeUiCopy(locale);
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
      if (short > 10 && long > 10) return copy.positiveTrim;
      if (short < -10 && long < -10) return copy.negativeTrim;
      return copy.normalTrim;
    }
    if (toolSlug === 'freeze-frame-interpreter') {
      const loadValue = Number(load);
      const rpmValue = Number(rpm);
      if (loadValue > 55 && rpmValue > 1800) return copy.highLoadFrame;
      return copy.lowLoadFrame;
    }
    if (toolSlug === 'repair-cost-calculator') {
      const upper = code.toUpperCase().replace(/\s/g, '');
      if (upper === 'P0420') return copy.p0420Cost;
      if (upper === 'P0300') return copy.p0300Cost;
      return copy.genericCost;
    }
    if (toolSlug === 'scanner-finder') {
      return copy.scannerFinder;
    }
    return copy.genericAssistant(code, symptom);
  }, [code, copy, load, ltft, rpm, stft, symptom, toolSlug]);

  return (
    <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{copy.interactivePreview}</h2>
          <p className="text-sm text-slate-400">{copy.previewDisclaimer}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {(toolSlug === 'diagnostic-assistant' || toolSlug === 'repair-cost-calculator') && (
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-300">{copy.obd2Code}</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-white outline-none focus:border-blue-400" />
          </label>
        )}
        {toolSlug === 'diagnostic-assistant' && (
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-300">{copy.mainSymptom}</span>
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
            <NumberInput label={copy.engineLoad} value={load} setValue={setLoad} />
          </>
        )}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-[#0a0f1c] p-5">
        <h3 className="font-black text-white flex items-center gap-2">
          {toolSlug === 'fuel-trim-analyzer' ? <Gauge className="w-5 h-5 text-green-300" /> : <Search className="w-5 h-5 text-green-300" />}
          {copy.suggestedDirection}
        </h3>
        <p className="mt-3 text-slate-300 leading-relaxed">{result}</p>
        <div className="mt-4 flex items-start gap-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {copy.toolSafetyNote}
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
