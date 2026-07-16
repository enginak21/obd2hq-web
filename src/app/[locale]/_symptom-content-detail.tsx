import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SymptomContentDetail } from '@/components/SymptomContentPages';
import {
  getSymptomContentAlternates,
  getSymptomContentBasePath,
  isSymptomContentLocale,
  publishedSymptomContentGroups,
  SYMPTOM_CONTENT_LOCALES,
  symptomContentBasePaths,
} from '@/data/symptom-content';

export function generateStaticParams() {
  return publishedSymptomContentGroups.flatMap(group =>
    SYMPTOM_CONTENT_LOCALES.map(locale => ({ locale, slug: group.locales[locale].slug }))
  );
}

export function generateStaticParamsForBase(expectedBasePath: string) {
  const locale = SYMPTOM_CONTENT_LOCALES.find(item => symptomContentBasePaths[item] === expectedBasePath);
  if (!locale) return [];
  return publishedSymptomContentGroups.map(group => ({ locale, slug: group.locales[locale].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isSymptomContentLocale(locale)) return {};
  const group = publishedSymptomContentGroups.find(item => item.locales[locale].slug === slug);
  if (!group) return {};
  const localized = group.locales[locale];
  return {
    title: localized.title,
    description: localized.metaDescription,
    alternates: getSymptomContentAlternates(group, locale),
  };
}

export default async function SymptomDetailRoute({ params, expectedBasePath }: { params: Promise<{ locale: string; slug: string }>; expectedBasePath?: string }) {
  const { locale, slug } = await params;
  if (!isSymptomContentLocale(locale)) notFound();
  if (expectedBasePath && getSymptomContentBasePath(locale) !== expectedBasePath) notFound();
  setRequestLocale(locale);
  const group = publishedSymptomContentGroups.find(item => item.locales[locale].slug === slug) || null;
  if (!group) notFound();
  return <SymptomContentDetail locale={locale} group={group} />;
}
