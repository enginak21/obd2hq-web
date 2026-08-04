import Link from 'next/link';
import { ArrowRight, SearchCheck } from 'lucide-react';
import focusLinks from '@/data/generated/seo-focus-links.json';

type FocusLink = {
  href: string;
  locale: string;
  title: string;
  type: string;
  score: number;
  queries?: string[];
};

const labels: Record<string, { eyebrow: string; title: string; subtitle: string; open: string }> = {
  en: {
    eyebrow: 'Popular diagnostic paths',
    title: 'Guides drivers are looking for now',
    subtitle: 'Fast links to OBD2 codes, warning lights and vehicle-specific checks with strong diagnostic intent.',
    open: 'Open guide',
  },
  tr: {
    eyebrow: 'Popüler teşhis yolları',
    title: 'Sürücülerin şu anda aradığı rehberler',
    subtitle: 'OBD2 kodları, uyarı ışıkları ve araç özel ilk kontroller için hızlı bağlantılar.',
    open: 'Rehberi aç',
  },
  de: {
    eyebrow: 'Beliebte Diagnosepfade',
    title: 'Ratgeber, die Fahrer aktuell suchen',
    subtitle: 'Schnelle Links zu OBD2-Codes, Warnleuchten und fahrzeugspezifischen Prüfungen.',
    open: 'Ratgeber öffnen',
  },
  es: {
    eyebrow: 'Rutas de diagnóstico populares',
    title: 'Guías que los conductores buscan ahora',
    subtitle: 'Enlaces rápidos a códigos OBD2, luces de advertencia y revisiones por vehículo.',
    open: 'Abrir guía',
  },
  fr: {
    eyebrow: 'Parcours diagnostic populaires',
    title: 'Guides recherchés par les conducteurs',
    subtitle: 'Liens rapides vers codes OBD2, voyants et contrôles propres au véhicule.',
    open: 'Ouvrir le guide',
  },
};

function typeLabel(type: string, locale: string) {
  const map: Record<string, Record<string, string>> = {
    code_hub: { en: 'Code guide', tr: 'Kod rehberi', de: 'Code-Ratgeber', es: 'Guía de código', fr: 'Guide code' },
    gsc_vehicle_code: { en: 'Vehicle check', tr: 'Araç kontrolü', de: 'Fahrzeugprüfung', es: 'Revisión vehículo', fr: 'Contrôle véhicule' },
    warning_light: { en: 'Warning light', tr: 'Uyarı ışığı', de: 'Warnleuchte', es: 'Luz tablero', fr: 'Voyant' },
    news: { en: 'News insight', tr: 'Haber analizi', de: 'News-Analyse', es: 'Análisis noticia', fr: 'Analyse actualité' },
    symptom_content: { en: 'Symptom guide', tr: 'Belirti rehberi', de: 'Symptom-Ratgeber', es: 'Guía síntoma', fr: 'Guide symptôme' },
    problem_finder: { en: 'Problem finder', tr: 'Arıza bulucu', de: 'Problemfinder', es: 'Buscador fallas', fr: 'Trouver panne' },
  };
  return map[type]?.[locale] || map[type]?.en || 'Guide';
}

export default function DailySeoFocusLinks({ locale }: { locale: string }) {
  const copy = labels[locale] || labels.en;
  const links = (focusLinks as FocusLink[])
    .filter(link => link.locale === locale)
    .slice(0, 8);

  if (!links.length) return null;

  return (
    <section className="w-full border-y border-white/5 bg-[#0d1424]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-100">
            <SearchCheck size={16} />
            {copy.eyebrow}
          </div>
          <h2 className="text-3xl font-black text-white">{copy.title}</h2>
          <p className="mt-3 leading-7 text-slate-400">{copy.subtitle}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-white/10 bg-[#131b2f] p-4 transition hover:border-blue-400/40 hover:bg-[#18223a]"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">{typeLabel(link.type, locale)}</span>
              <h3 className="mt-3 min-h-[48px] text-base font-black leading-6 text-white">{link.title}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-100">
                {copy.open}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
