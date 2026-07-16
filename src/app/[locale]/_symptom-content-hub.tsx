import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SymptomContentHub } from '@/components/SymptomContentPages';
import { getSymptomHubAlternates, getSymptomContentBasePath, isSymptomContentLocale, type SymptomContentLocale } from '@/data/symptom-content';

const titles: Record<SymptomContentLocale, string> = {
  en: 'Car Symptom Guides - OBD2HQ',
  tr: 'Araç Arıza Belirtileri - OBD2HQ',
  de: 'Auto Symptome und Ursachen - OBD2HQ',
  es: 'Síntomas del Coche y Causas - OBD2HQ',
  fr: 'Symptômes Voiture et Causes - OBD2HQ',
};

const descriptions: Record<SymptomContentLocale, string> = {
  en: 'Find causes, OBD2 codes and first checks for real car symptom searches by make and model.',
  tr: 'Marka ve modele göre gaz yememe, titreme, geç çalışma, duman ve uyarı lambası gibi arıza belirtilerinin nedenlerini bulun.',
  de: 'Ursachen, OBD2-Codes und erste Prüfungen für echte Auto-Symptome nach Marke und Modell.',
  es: 'Encuentra causas, códigos OBD2 y primeras revisiones para síntomas reales por marca y modelo.',
  fr: 'Trouvez causes, codes OBD2 et premiers contrôles pour symptômes réels par marque et modèle.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSymptomContentLocale(locale)) return {};
  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: getSymptomHubAlternates(locale),
  };
}

export default async function SymptomHubRoute({ params, expectedBasePath }: { params: Promise<{ locale: string }>; expectedBasePath?: string }) {
  const { locale } = await params;
  if (!isSymptomContentLocale(locale)) notFound();
  if (expectedBasePath && getSymptomContentBasePath(locale) !== expectedBasePath) notFound();
  setRequestLocale(locale);
  return <SymptomContentHub locale={locale} />;
}

export function isCorrectSymptomHubPath(locale: string, basePath: string) {
  return isSymptomContentLocale(locale) && getSymptomContentBasePath(locale) === basePath;
}
