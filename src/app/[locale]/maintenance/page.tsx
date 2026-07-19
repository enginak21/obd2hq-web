import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import { vehicleKnowledgeProfiles } from '@/data/vehicle-knowledge';
import { KnowledgeHero } from '@/components/KnowledgeGrid';
import { getKnowledgeUiCopy } from '@/data/knowledge-ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const copy = getKnowledgeUiCopy(locale);
  return {
    title: copy.maintenanceMetaTitle,
    description: copy.maintenanceMetaDescription,
    alternates: getAlternates('maintenance', locale),
  };
}

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getKnowledgeUiCopy(locale);
  const guideTitle = locale === 'tr' ? 'Bakım planını arıza teşhisiyle birlikte okuyun' : locale === 'de' ? 'Wartung zusammen mit Diagnose lesen' : locale === 'es' ? 'Lee el mantenimiento junto al diagnóstico' : locale === 'fr' ? 'Lire l’entretien avec le diagnostic' : 'Read maintenance together with diagnosis';
  const guideText = locale === 'tr'
    ? 'Yağ, filtre, buji, triger, soğutma sıvısı ve şanzıman bakımı geciktiğinde yakıt tüketimi, tekleme, hararet, çekiş düşüklüğü ve emisyon kodları daha sık görülür. Bu bölüm bakım maddelerini ilgili araç profilleriyle birleştirir; böylece sadece parça listesi değil, hangi belirtinin hangi bakım eksiğiyle ilişkili olabileceğini de görebilirsiniz.'
    : locale === 'de'
      ? 'Wenn Öl, Filter, Zündkerzen, Steuertrieb, Kühlmittel oder Getriebeservice überfällig sind, treten Verbrauch, Fehlzündungen, Überhitzung, Leistungsverlust und Emissionscodes häufiger auf. Dieser Bereich verbindet Wartungspunkte mit Fahrzeugprofilen und zeigt, welche Symptome mit vernachlässigtem Service zusammenhängen können.'
      : locale === 'es'
        ? 'Cuando aceite, filtros, bujías, distribución, refrigerante o transmisión se retrasan, aparecen más consumo, fallos de encendido, temperatura, pérdida de potencia y códigos de emisiones. Esta sección conecta mantenimiento con perfiles de vehículo para entender qué síntomas pueden venir de servicio pendiente.'
        : locale === 'fr'
          ? 'Quand huile, filtres, bougies, distribution, liquide de refroidissement ou boîte sont en retard, consommation, ratés, surchauffe, perte de puissance et codes antipollution deviennent plus probables. Cette section relie entretien et profils véhicule pour comprendre les symptômes liés au service.'
          : 'When oil, filters, spark plugs, timing service, coolant or transmission maintenance are overdue, fuel use, misfires, overheating, low power and emissions codes become more likely. This section connects maintenance items to vehicle profiles so you can understand which symptoms may come from missed service.';
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.maintenanceEyebrow} title={copy.maintenanceTitle} description={copy.maintenanceDescription} />
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-black text-white">{guideTitle}</h2>
          <p className="mt-4 leading-7 text-slate-300">{guideText}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
        {vehicleKnowledgeProfiles.map(vehicle => (
          <Link key={`${vehicle.make}-${vehicle.model}`} href={`/${locale}/vehicles/${vehicle.make}/${vehicle.model}`} className="rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-green-400/40 transition-all">
            <h2 className="text-2xl font-black text-white capitalize">{vehicle.make.replace('-', ' ')} {vehicle.model.replace('-', ' ')}</h2>
            <ul className="mt-4 space-y-2 text-slate-300">
              {vehicle.maintenance.slice(0, 4).map(item => <li key={item}>- {item}</li>)}
            </ul>
          </Link>
        ))}
      </section>
    </main>
  );
}
