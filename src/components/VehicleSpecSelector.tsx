'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Gauge, Wrench } from 'lucide-react';

export type VehicleSpecSelectorItem = {
  make: string;
  model: string;
  displayName: string;
  generation: string;
  year: number;
  trim: string;
  slug: string;
  chassisCode: string;
  engineCodes: string[];
  engineSummary: string;
  recommendedOil: string;
  oilCapacity: string;
  transmissionFluid: string;
  commonProblems: string[];
  firstChecks: string[];
  relatedCodes: string[];
};

type VehicleSpecSelectorProps = {
  locale: string;
  items: VehicleSpecSelectorItem[];
};

export default function VehicleSpecSelector({ locale, items }: VehicleSpecSelectorProps) {
  const labels = getLabels(locale);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [variantSlug, setVariantSlug] = useState('');

  const makes = useMemo(() => unique(items.map(item => item.make)), [items]);
  const models = useMemo(() => unique(items.filter(item => item.make === make).map(item => item.model)), [items, make]);
  const exactVariantsForModel = useMemo(() => items.filter(item => item.make === make && item.model === model), [items, make, model]);
  const years = useMemo(() => unique(exactVariantsForModel.map(item => String(item.year)), true), [exactVariantsForModel]);
  const variants = exactVariantsForModel.filter(item => String(item.year) === year);
  const selected = variants.find(item => item.slug === variantSlug) || null;

  function resetAfterMake(nextMake: string) {
    setMake(nextMake);
    setModel('');
    setYear('');
    setVariantSlug('');
  }

  function resetAfterModel(nextModel: string) {
    setModel(nextModel);
    setYear('');
    setVariantSlug('');
  }

  function resetAfterYear(nextYear: string) {
    setYear(nextYear);
    setVariantSlug('');
  }

  return (
    <section className="max-w-6xl mx-auto px-6 pt-10">
      <div className="rounded-3xl border border-white/10 bg-[#101827] p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-300">
              <Gauge className="h-4 w-4" />
              {labels.eyebrow}
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">{labels.title}</h2>
          </div>
          <p className="max-w-sm text-sm font-medium text-slate-400 lg:text-right">{labels.subtitle}</p>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <SelectBox label={`1. ${labels.make}`} value={make} onChange={resetAfterMake} placeholder={labels.selectMake} options={makes.map(value => ({ value, label: formatName(value) }))} />
          <SelectBox label={`2. ${labels.model}`} value={model} onChange={resetAfterModel} placeholder={labels.selectModel} disabled={!make} options={models.map(value => ({ value, label: formatName(value) }))} />
          <SelectBox label={`3. ${labels.year}`} value={year} onChange={resetAfterYear} placeholder={labels.selectYear} disabled={!model} options={years.map(value => ({ value, label: value }))} />
          <SelectBox label={`4. ${labels.variant}`} value={variantSlug} onChange={setVariantSlug} placeholder={labels.selectVariant} disabled={!year} options={variants.map(item => ({ value: item.slug, label: `${item.trim} ${item.chassisCode}` }))} />
          <div className="flex items-end">
            <Link
              href={selected ? `/${locale}/vehicles/${selected.make}/${selected.model}/${selected.year}/${selected.slug}` : '#'}
              aria-disabled={!selected}
              className={`flex h-12 w-full items-center justify-center rounded-2xl px-5 font-black transition-colors lg:w-14 ${selected ? 'bg-blue-600 text-white hover:bg-blue-500' : 'pointer-events-none bg-slate-800 text-slate-600'}`}
            >
              <ArrowRight className="h-5 w-5" />
              <span className="sr-only">{labels.openFullPage}</span>
            </Link>
          </div>
        </div>

        {selected ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-blue-400/10 bg-blue-500/5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-black text-slate-200">{selected.year}</span>
                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-black text-slate-200">{selected.displayName}</span>
                <span className="rounded-lg bg-white/10 px-3 py-1 text-xs font-black text-slate-200">{selected.trim}</span>
                <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-200">{labels.verified}</span>
              </div>
              <h3 className="mt-4 text-2xl font-black text-white">{selected.engineCodes.join(', ')} - {selected.engineSummary}</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Fact label={labels.engineCode} value={selected.engineCodes.join(', ')} />
                <Fact label={labels.chassis} value={`${selected.chassisCode} / ${selected.generation}`} />
                <Fact label={labels.oilType} value={selected.recommendedOil} />
                <Fact label={labels.oilCapacity} value={selected.oilCapacity} />
                <Fact label={labels.transmissionFluid} value={selected.transmissionFluid} />
                <Fact label={labels.relatedCodes} value={selected.relatedCodes.join(', ')} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Wrench className="h-4 w-4 text-amber-300" />
                {labels.quickChecks}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {selected.firstChecks.slice(0, 6).map(check => <li key={check}>- {check}</li>)}
              </ul>
              <p className="mt-5 text-xs font-black uppercase tracking-widest text-slate-500">{labels.commonProblems}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.commonProblems.slice(0, 6).map(problem => (
                  <span key={problem} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">{problem}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-4 text-sm font-medium text-slate-500">
            {labels.emptyState}
          </div>
        )}
      </div>
    </section>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        className="h-12 w-full rounded-2xl border border-white/10 bg-[#0a0f1c] px-4 text-sm font-bold text-white outline-none transition-colors focus:border-blue-400 disabled:cursor-not-allowed disabled:text-slate-600"
      >
        <option value="">{placeholder}</option>
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#0a0f1c] px-3 py-3">
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}

function unique(values: string[], numeric = false) {
  const output = Array.from(new Set(values));
  if (numeric) return output.sort((a, b) => Number(a) - Number(b));
  return output.sort((a, b) => formatName(a).localeCompare(formatName(b)));
}

function formatName(value: string) {
  return value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function getLabels(locale: string) {
  if (locale === 'tr') {
    return {
      eyebrow: 'Araç bilgini bul',
      title: 'Marka, model ve yılı seç; teknik detayları hemen gör.',
      subtitle: 'Yalnızca doğrulanmış ve içeriği dolu araç profilleri listelenir. Motor kodu, yağ tipi ve kapasite aynı ekranda açılır.',
      make: 'Marka',
      model: 'Model',
      year: 'Yıl',
      variant: 'Kasa',
      selectMake: 'Marka seç',
      selectModel: 'Model seç',
      selectYear: 'Yıl seç',
      selectVariant: 'Kasa/versiyon seç',
      openFullPage: 'Tam detay sayfasını aç',
      engineCode: 'Motor kodu',
      chassis: 'Kasa / jenerasyon',
      oilType: 'Motor yağı',
      oilCapacity: 'Yağ kapasitesi',
      transmissionFluid: 'Şanzıman yağı',
      relatedCodes: 'İlgili kodlar',
      quickChecks: 'İlk kontroller',
      commonProblems: 'Sık sorunlar',
      emptyState: 'Detayları görmek için marka, model, yıl ve kasa seçin.',
      verified: 'Doğrulanmış',
    };
  }

  return {
    eyebrow: 'Find vehicle specs',
    title: 'Select make, model and year; see the technical data instantly.',
    subtitle: 'Only verified vehicle profiles with complete content are listed. Engine code, oil type and capacity open on the same screen.',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    variant: 'Trim',
    selectMake: 'Select make',
    selectModel: 'Select model',
    selectYear: 'Select year',
    selectVariant: 'Select trim',
    openFullPage: 'Open full detail page',
    engineCode: 'Engine code',
    chassis: 'Chassis / generation',
    oilType: 'Engine oil',
    oilCapacity: 'Oil capacity',
    transmissionFluid: 'Transmission fluid',
    relatedCodes: 'Related codes',
    quickChecks: 'First checks',
    commonProblems: 'Common problems',
    emptyState: 'Select make, model, year and trim to see details.',
    verified: 'Verified',
  };
}
