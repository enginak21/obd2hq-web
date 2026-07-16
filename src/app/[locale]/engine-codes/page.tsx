import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import VehicleSeoHub from '@/components/VehicleSeoHub';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Motor Kodu Sorgulama - OBD2HQ' : 'Engine Code Lookup by Vehicle - OBD2HQ',
    description: locale === 'tr' ? 'Marka, model ve yıla göre motor kodlarını, yağ bilgisini ve ilgili OBD2 arıza kodlarını bulun.' : 'Find engine codes by make, model and year with oil data, common problems and related OBD2 codes.',
    alternates: getAlternates('engine-codes', locale),
  };
}

export default async function EngineCodesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tr = locale === 'tr';
  return (
    <VehicleSeoHub
      locale={locale}
      mode="engine"
      eyebrow={tr ? 'Motor kodu veritabanı' : 'Engine code database'}
      title={tr ? 'Marka ve modele göre motor kodlarını bulun.' : 'Find engine codes by make and model.'}
      description={tr ? 'Araç profilleri motor kodlarını, yağ bilgisini, sık arızaları ve ilgili OBD2 kodlarını aynı yerde toplar.' : 'Vehicle profiles connect engine codes with oil data, common problems and related OBD2 diagnostics.'}
      metricLabel={tr ? 'Başlıca motor kodları' : 'Main engine codes'}
    />
  );
}
