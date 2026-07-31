import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SymptomContentHub } from '@/components/SymptomContentPages';
import { getSymptomHubAlternates, getSymptomContentBasePath, isSymptomContentLocale, type SymptomContentLocale } from '@/data/symptom-content';

const titles: Record<SymptomContentLocale, string> = {
  en: 'Car Symptom Guides: Causes, OBD2 Codes and First Checks - OBD2HQ',
  tr: 'Araç Arıza Belirtileri: Nedenler, OBD2 Kodları ve İlk Kontroller - OBD2HQ',
  de: 'Auto Symptome: Ursachen, OBD2-Codes und erste Prüfungen - OBD2HQ',
  es: 'Síntomas del Coche: Causas, Códigos OBD2 y Primeras Revisiones - OBD2HQ',
  fr: 'Symptômes Voiture : Causes, Codes OBD2 et Premiers Contrôles - OBD2HQ',
};

const descriptions: Record<SymptomContentLocale, string> = {
  en: 'Find causes, related OBD2 codes, safety advice and first checks for real car symptom searches by make and model.',
  tr: 'Marka ve modele göre gaz yememe, titreme, geç çalışma, duman ve uyarı lambası gibi arıza belirtilerinin nedenlerini, ilgili OBD2 kodlarını ve ilk kontrolleri bulun.',
  de: 'Finden Sie Ursachen, passende OBD2-Codes, Sicherheitshinweise und erste Prüfungen für echte Auto-Symptome nach Marke und Modell.',
  es: 'Encuentra causas, códigos OBD2 relacionados, consejos de seguridad y primeras revisiones para síntomas reales por marca y modelo.',
  fr: 'Trouvez les causes, codes OBD2 liés, conseils de sécurité et premiers contrôles pour les symptômes réels par marque et modèle.',
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
