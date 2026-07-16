import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import VehicleSeoHub from '@/components/VehicleSeoHub';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Motor Yağı Kapasitesi Sorgulama - OBD2HQ' : 'Engine Oil Capacity Lookup - OBD2HQ',
    description: locale === 'tr' ? 'Araç marka, model, yıl ve motor seçeneğine göre motor yağı viskozitesi ve yağ kapasitesi rehberi.' : 'Look up engine oil viscosity and oil capacity by vehicle make, model, year and engine option.',
    alternates: getAlternates('oil-capacity', locale),
  };
}

export default async function OilCapacityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tr = locale === 'tr';
  return (
    <VehicleSeoHub
      locale={locale}
      mode="oil"
      eyebrow={tr ? 'Yağ kapasitesi rehberi' : 'Oil capacity guide'}
      title={tr ? 'Aracınızın motor yağı ve kapasitesini bulun.' : 'Find your vehicle oil type and capacity.'}
      description={tr ? 'Motor kodu, yağ viskozitesi, kapasite ve servis notlarını tek araç profili içinde karşılaştırın.' : 'Compare engine code, oil viscosity, capacity and service notes inside each vehicle profile.'}
      metricLabel={tr ? 'Yağ bilgisi' : 'Oil data'}
    />
  );
}
