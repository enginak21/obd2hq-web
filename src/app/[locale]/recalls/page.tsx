import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

const recallGuides: Record<string, { title: string; intro: string; steps: string[]; warning: string }> = {
  en: {
    title: 'Recall research workflow for owners',
    intro: 'A recall or TSB search should start with the VIN and the exact market where the vehicle was sold. The same model year can have different campaigns by engine, trim, production date and country.',
    steps: ['Check the official manufacturer recall portal or government recall database.', 'Compare the symptom with related OBD2 codes and dashboard warning lights.', 'Save dates, photos, scan reports and dealer communication before clearing codes.'],
    warning: 'Do not ignore brake, steering, airbag, fuel leak, overheating or high-voltage recall notices. These are safety issues, not ordinary maintenance items.',
  },
  tr: {
    title: 'Araç sahipleri için geri çağırma araştırma akışı',
    intro: 'Geri çağırma veya TSB araştırması VIN ve aracın satıldığı pazar bilgisiyle başlamalıdır. Aynı model yılı; motor, donanım, üretim tarihi ve ülkeye göre farklı kampanyalara sahip olabilir.',
    steps: ['Resmi üretici geri çağırma portalını veya devlet veri tabanını kontrol edin.', 'Belirtiyi ilgili OBD2 kodları ve gösterge uyarı ışıklarıyla karşılaştırın.', 'Kod silmeden önce tarih, fotoğraf, tarama raporu ve servis görüşmelerini saklayın.'],
    warning: 'Fren, direksiyon, airbag, yakıt kaçağı, hararet veya yüksek voltaj geri çağırmalarını ertelemeyin. Bunlar bakım değil güvenlik konusudur.',
  },
  de: {
    title: 'Rückrufrecherche für Fahrzeughalter',
    intro: 'Eine Rückruf- oder TSB-Suche sollte mit VIN und Verkaufsmarkt beginnen. Gleiches Modelljahr kann je nach Motor, Ausstattung, Produktionsdatum und Land andere Kampagnen haben.',
    steps: ['Offizielles Herstellerportal oder staatliche Rückrufdatenbank prüfen.', 'Symptom mit OBD2-Codes und Warnleuchten abgleichen.', 'Daten, Fotos, Scanberichte und Händlerkommunikation vor dem Löschen sichern.'],
    warning: 'Bremsen, Lenkung, Airbag, Kraftstoffleck, Überhitzung oder Hochvolt-Rückrufe nicht ignorieren.',
  },
  es: {
    title: 'Flujo de investigación de retiros para propietarios',
    intro: 'Una búsqueda de retiro o TSB debe empezar con VIN y mercado de venta. El mismo año modelo puede tener campañas distintas por motor, versión, fecha de producción y país.',
    steps: ['Consulta el portal oficial del fabricante o la base gubernamental.', 'Compara el síntoma con códigos OBD2 y luces del tablero.', 'Guarda fechas, fotos, reportes de escáner y comunicación con el taller antes de borrar códigos.'],
    warning: 'No ignores avisos de freno, dirección, airbag, fuga de combustible, sobrecalentamiento o alto voltaje.',
  },
  fr: {
    title: 'Méthode de recherche rappel pour propriétaires',
    intro: 'Une recherche de rappel ou TSB commence par le VIN et le marché de vente. Une même année modèle peut varier selon moteur, finition, date de production et pays.',
    steps: ['Vérifiez le portail officiel constructeur ou la base gouvernementale.', 'Comparez le symptôme avec codes OBD2 et voyants.', 'Gardez dates, photos, rapports de scan et échanges avant d’effacer les codes.'],
    warning: 'N’ignorez pas freins, direction, airbag, fuite carburant, surchauffe ou rappels haute tension.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.recallsMetaTitle,
    description: copy.recallsMetaDescription,
    alternates: getAlternates('recalls', locale),
  };
}

export default async function RecallsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.recallsEyebrow} title={copy.recallsTitle} description={copy.recallsDescription} />
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-5">
        {copy.recallCards.map(([title, text]) => (
          <section key={title} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{text}</p>
          </section>
        ))}
      </section>
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl border border-white/5 bg-[#101827] p-8">
          <h2 className="text-2xl font-black text-white">{(recallGuides[locale] || recallGuides.en).title}</h2>
          <p className="mt-4 text-slate-300 leading-7">{(recallGuides[locale] || recallGuides.en).intro}</p>
          <ol className="mt-5 grid gap-3 md:grid-cols-3">
            {(recallGuides[locale] || recallGuides.en).steps.map((item, index) => (
              <li key={item} className="rounded-2xl bg-white/[0.04] p-4 text-sm leading-6 text-slate-300">
                <span className="mb-2 block text-xs font-black uppercase tracking-widest text-blue-200">{index + 1}</span>
                {item}
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">{(recallGuides[locale] || recallGuides.en).warning}</p>
        </div>
      </section>
    </main>
  );
}
