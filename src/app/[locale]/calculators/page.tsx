import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

const calculatorGuides: Record<string, { title: string; intro: string; bullets: string[]; note: string }> = {
  en: {
    title: 'How to use repair calculators without guessing',
    intro: 'Use these calculators as support tools during diagnosis, not as a replacement for scan data. A pressure, torque, fuel-cost or displacement conversion is most useful when it is tied to the exact vehicle, engine, tire label or service specification.',
    bullets: ['Convert tire pressure only against the door-jamb label or owner manual.', 'Compare torque and power units when reading international repair data.', 'Use fuel-cost estimates after confirming there is no active misfire, fuel trim or oxygen sensor fault.'],
    note: 'If a warning light is on, save the code and freeze-frame data before using a calculator to estimate repair cost or fuel impact.',
  },
  tr: {
    title: 'Onarım hesaplayıcılarını tahminle değil veriyle kullanın',
    intro: 'Bu hesaplayıcılar tarama verisinin yerine geçmez; teşhis sırasında destek aracı olarak kullanılmalıdır. Basınç, tork, yakıt maliyeti veya motor hacmi dönüşümü en çok doğru araç, motor, lastik etiketi ve servis şartnamesiyle birlikte değerlidir.',
    bullets: ['Lastik basıncını kapı içi etiketi veya kullanım kılavuzuyla karşılaştırın.', 'Uluslararası servis verisi okurken tork ve güç birimlerini aynı değere çevirin.', 'Yakıt maliyeti hesabını aktif tekleme, fuel trim veya oksijen sensörü arızası olmadığını doğruladıktan sonra yorumlayın.'],
    note: 'Uyarı ışığı yanıyorsa hesap yapmadan önce arıza kodunu ve freeze-frame verisini kaydedin.',
  },
  de: {
    title: 'Reparaturrechner richtig nutzen',
    intro: 'Diese Rechner unterstützen die Diagnose, ersetzen aber keine Scandaten. Druck-, Drehmoment-, Verbrauchs- oder Hubraumwerte sind nur sinnvoll, wenn sie mit Fahrzeug, Motor, Reifenlabel und Serviceangabe abgeglichen werden.',
    bullets: ['Reifendruck immer mit Türschild oder Handbuch vergleichen.', 'Drehmoment- und Leistungswerte aus internationalen Quellen einheitlich umrechnen.', 'Kraftstoffkosten erst bewerten, wenn Fehlzündung, Fuel-Trim- oder Lambdasondenfehler ausgeschlossen sind.'],
    note: 'Bei Warnleuchte zuerst Code und Freeze-Frame sichern, dann Kosten oder Verbrauch einschätzen.',
  },
  es: {
    title: 'Cómo usar calculadoras de reparación sin adivinar',
    intro: 'Las calculadoras apoyan el diagnóstico, pero no sustituyen los datos del escáner. Una conversión de presión, torque, combustible o cilindrada sirve más cuando se compara con el vehículo, motor, etiqueta de neumáticos y especificación correctos.',
    bullets: ['Convierte presión de neumáticos usando la etiqueta de la puerta o manual.', 'Unifica torque y potencia al leer datos de servicio internacionales.', 'Evalúa costo de combustible después de descartar fallas de misfire, fuel trim u oxígeno.'],
    note: 'Si hay una luz de advertencia, guarda códigos y freeze-frame antes de estimar coste o consumo.',
  },
  fr: {
    title: 'Utiliser les calculateurs sans remplacer le diagnostic',
    intro: 'Ces calculateurs aident le diagnostic, mais ne remplacent pas les données du scanner. Pression, couple, coût carburant ou cylindrée doivent être comparés au véhicule, moteur, étiquette pneus et spécification exacte.',
    bullets: ['Convertissez la pression selon l’étiquette de porte ou le manuel.', 'Comparez couple et puissance avec des unités cohérentes.', 'Estimez le coût carburant après avoir écarté ratés, fuel trims ou défauts sonde oxygène.'],
    note: 'Avec un voyant allumé, sauvegardez code et freeze-frame avant d’estimer coût ou consommation.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.calculatorsMetaTitle,
    description: copy.calculatorsMetaDescription,
    alternates: getAlternates('calculators', locale),
  };
}

export default async function CalculatorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.calculatorsEyebrow} title={copy.calculatorsTitle} description={copy.calculatorsDescription} />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {copy.calculators.map(([slug, title, description]) => (
          <Link key={slug} href={`/${locale}/tools/diagnostic-assistant`} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-blue-400/40 transition-all">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{description}</p>
          </Link>
        ))}
      </section>
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl border border-white/5 bg-[#101827] p-8">
          <h2 className="text-2xl font-black text-white">{(calculatorGuides[locale] || calculatorGuides.en).title}</h2>
          <p className="mt-4 text-slate-300 leading-7">{(calculatorGuides[locale] || calculatorGuides.en).intro}</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {(calculatorGuides[locale] || calculatorGuides.en).bullets.map(item => (
              <li key={item} className="rounded-2xl bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-blue-200">{(calculatorGuides[locale] || calculatorGuides.en).note}</p>
        </div>
      </section>
    </main>
  );
}
