import ProblemFinderDetailPage, { generateProblemFinderDetailMetadata, generateProblemFinderDetailStaticParams } from '../../_problem-finder-detail';

export function generateStaticParams() {
  return generateProblemFinderDetailStaticParams('fr');
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return generateProblemFinderDetailMetadata(locale, slug);
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  return <ProblemFinderDetailPage locale={locale} slug={slug} />;
}
