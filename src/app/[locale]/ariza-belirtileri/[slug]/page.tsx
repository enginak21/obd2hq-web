import SymptomDetailRoute, { generateMetadata, generateStaticParamsForBase } from '../../_symptom-content-detail';

export { generateMetadata };
export function generateStaticParams() {
  return generateStaticParamsForBase('ariza-belirtileri');
}
export default function Page(props: { params: Promise<{ locale: string; slug: string }> }) {
  return <SymptomDetailRoute {...props} expectedBasePath="ariza-belirtileri" />;
}
