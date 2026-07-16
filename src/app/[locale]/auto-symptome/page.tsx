import SymptomHubRoute, { generateMetadata } from '../_symptom-content-hub';

export { generateMetadata };
export default function Page(props: { params: Promise<{ locale: string }> }) {
  return <SymptomHubRoute {...props} expectedBasePath="auto-symptome" />;
}
