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
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <KnowledgeHero eyebrow={copy.maintenanceEyebrow} title={copy.maintenanceTitle} description={copy.maintenanceDescription} />
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
