import { setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';
import VehicleSeoHub from '@/components/VehicleSeoHub';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Araç Kronik Sorunları ve Arıza Rehberi - OBD2HQ' : 'Common Car Problems by Model - OBD2HQ',
    description: locale === 'tr' ? 'Marka ve modele göre sık görülen sorunları, ilk kontrolleri ve ilgili OBD2 arıza kodlarını bulun.' : 'Find common problems by make and model with first checks, related OBD2 codes and service context.',
    alternates: getAlternates('common-problems', locale),
  };
}

export default async function CommonProblemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tr = locale === 'tr';
  return (
    <VehicleSeoHub
      locale={locale}
      mode="problems"
      eyebrow={tr ? 'Kronik sorun rehberi' : 'Common problem guide'}
      title={tr ? 'Marka ve modele göre sık görülen sorunları bulun.' : 'Find common problems by make and model.'}
      description={tr ? 'Araç rehberi kronik sorunları, ilk kontrol listesini ve ilgili arıza kodlarını teknik profil içinde birleştirir.' : 'The vehicle guide connects common problems, first checks and related diagnostic codes inside technical profiles.'}
      metricLabel={tr ? 'Öne çıkan sorunlar' : 'Highlighted problems'}
    />
  );
}
