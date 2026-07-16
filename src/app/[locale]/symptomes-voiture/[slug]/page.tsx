import SymptomDetailRoute, { generateMetadata, generateStaticParamsForBase } from '../../_symptom-content-detail';

export { generateMetadata };
export function generateStaticParams() {
  return generateStaticParamsForBase('symptomes-voiture');
}
export default function Page(props: { params: Promise<{ locale: string; slug: string }> }) {
  return <SymptomDetailRoute {...props} expectedBasePath="symptomes-voiture" />;
}
