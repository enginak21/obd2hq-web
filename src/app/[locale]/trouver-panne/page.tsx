import ProblemFinderHubPage, { generateProblemFinderHubMetadata } from '../_problem-finder-hub';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generateProblemFinderHubMetadata(locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <ProblemFinderHubPage locale={locale} />;
}
