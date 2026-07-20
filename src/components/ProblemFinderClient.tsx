'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Gauge, Search, ShieldCheck, ThumbsDown, ThumbsUp, Wrench } from 'lucide-react';
import {
  ProblemFinderIntent,
  ProblemFinderLocale,
  getProblemFinderDetailPath,
  matchProblemQuery,
  publishedProblemFinderIntents,
} from '@/data/problem-finder';

const ui = {
  en: {
    eyebrow: 'Problem finder',
    title: 'What is wrong with your car?',
    subtitle: 'Write it the way you would search on Google. You do not need an OBD code.',
    placeholder: 'Renault losing power, car shaking, check engine light...',
    button: 'Find likely causes',
    quick: ['losing power', 'car shaking', 'using too much fuel', 'hard to start', 'white smoke', 'overheating', 'ABS light', 'gear will not engage'],
    found: 'This may be the closest fault path',
    maybe: 'Closest matches',
    explanation: 'What could this be?',
    causes: 'Most likely causes',
    checks: 'Check these first',
    replace: 'Do not replace yet',
    drive: 'Can I drive like this?',
    cost: 'Estimated cost level',
    codes: 'Related OBD codes may include',
    guides: 'Related guides',
    feedback: 'Was this useful?',
    advanced: 'Advanced diagnostic tools',
    advancedText: 'Use calculators and technical simulators after you have a likely fault direction.',
  },
  tr: {
    eyebrow: 'Arıza bulucu',
    title: 'Aracında ne sorun var?',
    subtitle: 'Google’a yazar gibi yaz. OBD kodu bilmen gerekmiyor.',
    placeholder: 'Renault Clio gaz yemiyor, araba titriyor, motor ışığı yandı...',
    button: 'Olası nedenleri bul',
    quick: ['gaz yemiyor', 'araba titriyor', 'çok yakıyor', 'geç çalışıyor', 'beyaz duman', 'hararet yaptı', 'ABS ışığı', 'vites geçmiyor'],
    found: 'En yakın arıza yolu bu olabilir',
    maybe: 'En yakın sonuçlar',
    explanation: 'Bu ne olabilir?',
    causes: 'En olası nedenler',
    checks: 'Önce şunlara baktır',
    replace: 'Hemen değiştirme',
    drive: 'Bu halde sürülür mü?',
    cost: 'Tahmini masraf seviyesi',
    codes: 'İlgili OBD kodları olabilir',
    guides: 'İlgili rehberler',
    feedback: 'İşe yaradı mı?',
    advanced: 'Gelişmiş teşhis araçları',
    advancedText: 'Olası arıza yönünü bulduktan sonra teknik hesaplayıcıları ve simülatörleri kullan.',
  },
  de: {
    eyebrow: 'Problemfinder',
    title: 'Was stimmt mit deinem Auto nicht?',
    subtitle: 'Schreibe es wie bei Google. Ein OBD-Code ist nicht nötig.',
    placeholder: 'BMW Motor macht Geräusche, Auto ruckelt, ABS-Leuchte...',
    button: 'Ursachen finden',
    quick: ['keine Leistung', 'Auto ruckelt', 'hoher Verbrauch', 'startet schwer', 'weißer Rauch', 'überhitzt', 'ABS-Leuchte', 'Gang geht nicht rein'],
    found: 'Das ist wahrscheinlich der nächste Fehlerpfad',
    maybe: 'Nächste Treffer',
    explanation: 'Was könnte das sein?',
    causes: 'Wahrscheinliche Ursachen',
    checks: 'Zuerst prüfen',
    replace: 'Noch nicht ersetzen',
    drive: 'Kann ich so fahren?',
    cost: 'Geschätztes Kostenniveau',
    codes: 'Mögliche OBD-Codes',
    guides: 'Verwandte Ratgeber',
    feedback: 'War das hilfreich?',
    advanced: 'Erweiterte Diagnosetools',
    advancedText: 'Nutzen Sie Rechner und Simulatoren nach der ersten Eingrenzung.',
  },
  es: {
    eyebrow: 'Buscador de fallas',
    title: '¿Qué le pasa a tu coche?',
    subtitle: 'Escríbelo como lo buscarías en Google. No necesitas código OBD.',
    placeholder: 'Renault no acelera, coche vibra, luz ABS...',
    button: 'Encontrar causas',
    quick: ['no acelera', 'coche vibra', 'consume mucho', 'tarda en arrancar', 'humo blanco', 'se calienta', 'luz ABS', 'no entra la marcha'],
    found: 'Esta puede ser la ruta de falla más cercana',
    maybe: 'Resultados cercanos',
    explanation: '¿Qué puede ser?',
    causes: 'Causas más probables',
    checks: 'Revisa esto primero',
    replace: 'No cambies todavía',
    drive: '¿Se puede conducir así?',
    cost: 'Nivel de coste estimado',
    codes: 'Códigos OBD relacionados',
    guides: 'Guías relacionadas',
    feedback: '¿Fue útil?',
    advanced: 'Herramientas avanzadas',
    advancedText: 'Usa calculadoras y simuladores después de tener una dirección probable.',
  },
  fr: {
    eyebrow: 'Trouver une panne',
    title: 'Quel problème a votre voiture ?',
    subtitle: 'Écrivez comme sur Google. Aucun code OBD n’est nécessaire.',
    placeholder: 'Renault manque de puissance, voiture tremble, voyant ABS...',
    button: 'Trouver les causes',
    quick: ['manque de puissance', 'voiture tremble', 'consomme trop', 'démarre mal', 'fumée blanche', 'surchauffe', 'voyant ABS', 'vitesse ne passe pas'],
    found: 'Cela peut être la piste la plus proche',
    maybe: 'Résultats proches',
    explanation: 'Qu’est-ce que cela peut être ?',
    causes: 'Causes probables',
    checks: 'À contrôler en premier',
    replace: 'Ne remplacez pas encore',
    drive: 'Puis-je rouler comme ça ?',
    cost: 'Niveau de coût estimé',
    codes: 'Codes OBD possibles',
    guides: 'Guides liés',
    feedback: 'Utile ?',
    advanced: 'Outils de diagnostic avancés',
    advancedText: 'Utilisez les calculateurs et simulateurs après avoir trouvé une piste.',
  },
};

function costLabel(locale: ProblemFinderLocale, costLevel: ProblemFinderIntent['costLevel']) {
  const labels = {
    en: { low: 'Low', medium: 'Medium', high: 'High', unknown: 'Unknown until scanned' },
    tr: { low: 'Düşük', medium: 'Orta', high: 'Yüksek', unknown: 'Kod okunmadan belirsiz' },
    de: { low: 'Niedrig', medium: 'Mittel', high: 'Hoch', unknown: 'Ohne Scan unklar' },
    es: { low: 'Bajo', medium: 'Medio', high: 'Alto', unknown: 'Sin escaneo no claro' },
    fr: { low: 'Faible', medium: 'Moyen', high: 'Élevé', unknown: 'Incertain sans lecture' },
  };
  return labels[locale][costLevel];
}

async function postEvent(path: string, body: unknown) {
  try {
    await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {

  }
}

export default function ProblemFinderClient({ locale }: { locale: ProblemFinderLocale }) {
  const copy = ui[locale];
  const [query, setQuery] = useState('');
  const [match, setMatch] = useState<ReturnType<typeof matchProblemQuery> | null>(null);
  const popular = useMemo(() => publishedProblemFinderIntents.slice(0, 16), []);

  const runSearch = (value = query) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const result = matchProblemQuery(trimmed, locale);
    setMatch(result);
    void postEvent('/api/problem-finder-query', {
      query: trimmed,
      locale,
      matchedIntent: result.best?.intent.intentKey,
      score: result.best?.score ?? 0,
      found: result.found,
    });
  };

  const selected = match?.found ? match.best?.intent : null;
  const nearest = match?.matches ?? popular.slice(0, 5).map((intent) => ({ intent, score: 0 }));

  return (
    <section className="w-full">
      <div className="hero-visual hero-visual-symptom rounded-[28px] border border-white/10 bg-[#101827] p-5 sm:p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end">
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-300">{copy.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-6xl">{copy.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">{copy.subtitle}</p>
          </div>
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 hover:border-blue-400/40 hover:text-white"
          >
            <Wrench className="h-4 w-4 text-blue-300" />
            {copy.advanced}
          </Link>
        </div>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            runSearch();
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.placeholder}
              className="h-14 w-full rounded-2xl border border-white/10 bg-[#070c16] pl-12 pr-4 text-base font-semibold text-white outline-none transition focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <button className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-500">
            {copy.button}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {copy.quick.map((quick) => (
            <button
              type="button"
              key={quick}
              onClick={() => {
                setQuery(quick);
                runSearch(quick);
              }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300 hover:border-blue-400/40 hover:text-white"
            >
              {quick}
            </button>
          ))}
        </div>
      </div>

      {(selected || match) && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {selected ? (
            <article className="rounded-[24px] border border-blue-400/20 bg-[#111a2b] p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-200">{copy.found}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">{match?.best?.score}%</span>
              </div>
              <h2 className="mt-4 text-3xl font-black text-white">{selected.titles[locale]}</h2>
              <section className="mt-6">
                <h3 className="flex items-center gap-2 text-lg font-black text-white"><Gauge className="h-5 w-5 text-blue-300" />{copy.explanation}</h3>
                <p className="mt-2 leading-7 text-slate-300">{selected.plainExplanation[locale]}</p>
              </section>
              <section className="mt-6">
                <h3 className="text-lg font-black text-white">{copy.causes}</h3>
                <ul className="mt-3 grid gap-2">
                  {selected.likelyCauses[locale].map((cause) => (
                    <li key={cause} className="rounded-xl bg-[#070c16] px-4 py-3 text-sm font-semibold text-slate-300">{cause}</li>
                  ))}
                </ul>
              </section>
              <section className="mt-6">
                <h3 className="text-lg font-black text-white">{copy.checks}</h3>
                <ol className="mt-3 grid gap-2">
                  {selected.firstChecks[locale].map((check, index) => (
                    <li key={check} className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300">
                      <span className="mr-2 text-blue-300">{index + 1}.</span>{check}
                    </li>
                  ))}
                </ol>
              </section>
            </article>
          ) : (
            <div className="rounded-[24px] border border-amber-400/20 bg-[#111a2b] p-6">
              <h2 className="text-2xl font-black text-white">{copy.maybe}</h2>
              <p className="mt-3 text-slate-400">{copy.subtitle}</p>
            </div>
          )}

          <aside className="space-y-4">
            {(selected ? [selected] : nearest.map((item) => item.intent)).map((intent) => (
              <Link
                key={intent.intentKey}
                href={getProblemFinderDetailPath(locale, intent)}
                className="block rounded-2xl border border-white/10 bg-[#111a2b] p-5 hover:border-blue-400/40"
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">{copy.guides}</p>
                <h3 className="mt-2 text-xl font-black text-white">{intent.titles[locale]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{intent.plainExplanation[locale]}</p>
              </Link>
            ))}

            {selected && (
              <div className="rounded-2xl border border-white/10 bg-[#111a2b] p-5">
                <h3 className="flex items-center gap-2 text-lg font-black text-white"><AlertTriangle className="h-5 w-5 text-amber-300" />{copy.drive}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selected.safeToDrive[locale]}</p>
                <h3 className="mt-5 text-lg font-black text-white">{copy.replace}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selected.doNotReplaceYet[locale]}</p>
                <div className="mt-5 rounded-xl bg-white/5 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">{copy.cost}</p>
                  <p className="mt-1 text-lg font-black text-white">{costLabel(locale, selected.costLevel)}</p>
                </div>
                <div className="mt-5">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">{copy.codes}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.relatedCodes.map((code) => (
                      <Link key={code} href={`/${locale}/search?q=${code}`} className="rounded-full bg-blue-500/15 px-3 py-1 text-sm font-black text-blue-200">{code}</Link>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="mr-auto text-sm font-bold text-slate-400">{copy.feedback}</span>
                  <button aria-label="Useful" onClick={() => postEvent('/api/problem-finder-feedback', { locale, intentKey: selected.intentKey, helpful: true })} className="rounded-xl bg-white/5 p-3 text-slate-300 hover:text-green-300"><ThumbsUp className="h-4 w-4" /></button>
                  <button aria-label="Not useful" onClick={() => postEvent('/api/problem-finder-feedback', { locale, intentKey: selected.intentKey, helpful: false })} className="rounded-xl bg-white/5 p-3 text-slate-300 hover:text-amber-300"><ThumbsDown className="h-4 w-4" /></button>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-[#111a2b] p-5">
              <h3 className="flex items-center gap-2 text-lg font-black text-white"><ShieldCheck className="h-5 w-5 text-green-300" />{copy.advanced}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy.advancedText}</p>
              <Link href={`/${locale}/tools`} className="mt-4 inline-flex text-sm font-black text-blue-300 hover:text-blue-200">{copy.advanced}</Link>
            </div>
          </aside>
        </div>
      )}

      {!match && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((intent) => (
            <Link key={intent.intentKey} href={getProblemFinderDetailPath(locale, intent)} className="rounded-2xl border border-white/10 bg-[#111a2b] p-5 hover:border-blue-400/40">
              <h2 className="text-lg font-black text-white">{intent.titles[locale]}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{intent.plainExplanation[locale]}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
