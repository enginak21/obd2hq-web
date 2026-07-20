import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, BadgeCheck, Gauge, Link2, SearchCheck } from 'lucide-react';
import { baseCodes, cars, getLocalized, type OBD2Code } from '@/data/db';
import { getLocalizedCodeDescription, getLocalizedCodeTitle } from '@/data/code-localization';
import { getRelatedCodes } from '@/data/seo';
import { fitSeoDescription, fitSeoTitle } from '@/utils/seo';
import { getCodeHubAlternates, getCodeHubCopy, getCodeHubPath, isKnownCode } from '@/data/gsc-seo';

type PageProps = {
  params: Promise<{
    locale: string;
    code: string;
  }>;
};

function titleCase(value: string) {
  return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function getVehicleTargets(code: string) {
  const preferred = [
    { make: 'ford', model: 'focus' },
    { make: 'suzuki', model: 'jimny' },
    { make: 'toyota', model: 'camry' },
    { make: 'honda', model: 'civic' },
    { make: 'nissan', model: 'altima' },
    { make: 'ford', model: 'f-150' },
  ];
  const valid = preferred.filter(target => cars.some(car => car.make === target.make && car.models.includes(target.model)));
  return valid.slice(0, 5).map(target => ({
    ...target,
    href: `/en/${target.make}/${target.model}/${code.toLowerCase()}`,
    label: `${titleCase(target.make)} ${titleCase(target.model)} ${code}`,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, code } = await params;
  const upperCode = code.toUpperCase();
  if (!isKnownCode(upperCode)) return { title: 'Code Not Found' };
  const copy = getCodeHubCopy(locale, upperCode);
  return {
    title: fitSeoTitle(copy.title),
    description: fitSeoDescription(copy.meta),
    alternates: getCodeHubAlternates(upperCode, locale),
  };
}

export default async function CodeHubPage({ params }: PageProps) {
  const { locale, code } = await params;
  const upperCode = code.toUpperCase();
  const rawCode = (baseCodes as Record<string, Partial<OBD2Code>>)[upperCode];
  if (!rawCode) notFound();

  const copy = getCodeHubCopy(locale, upperCode);
  const rawTitle = getLocalized(rawCode.title, locale) || upperCode;
  const rawDescription = getLocalized(rawCode.description, locale) || copy.intro;
  const localizedTitle = getLocalizedCodeTitle(upperCode, locale, String(rawTitle));
  const localizedDescription = getLocalizedCodeDescription(upperCode, locale, String(rawDescription));
  const causes = Array.isArray(rawCode.causes) ? rawCode.causes.slice(0, 5) : [];
  const symptoms = Array.isArray(rawCode.symptoms) ? rawCode.symptoms.slice(0, 5) : [];
  const relatedCodes = getRelatedCodes(upperCode, Object.keys(baseCodes as Record<string, unknown>), 6);
  const vehicleTargets = getVehicleTargets(upperCode);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: copy.h1, item: `https://www.obd2hq.com${getCodeHubPath(locale, upperCode)}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: copy.faqQ, acceptedAnswer: { '@type': 'Answer', text: copy.faqA } },
      { '@type': 'Question', name: `What is ${upperCode}?`, acceptedAnswer: { '@type': 'Answer', text: localizedDescription } },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: copy.title,
    description: copy.meta,
    author: { '@type': 'Organization', name: 'OBD2HQ Editorial Team' },
    publisher: { '@type': 'Organization', name: 'OBD2HQ' },
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema, articleSchema]) }} />
      <header className="hero-visual hero-visual-code relative overflow-hidden border-b border-white/5 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href={`/${locale}`} className="hover:text-blue-300">OBD2HQ</Link>
            <span>/</span>
            <span className="text-white">{upperCode}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-200">
              <SearchCheck size={16} />
              Google Search Console opportunity
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{copy.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{copy.intro}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 pt-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-1 text-green-300" />
            <div>
              <h2 className="text-2xl font-bold text-white">{localizedTitle}</h2>
              <p className="mt-3 leading-7 text-slate-300">{localizedDescription}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-black/20 p-4">
              <h2 className="text-lg font-bold text-white">First checks</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                {copy.firstChecks.map(item => <li key={item}>- {item}</li>)}
              </ul>
            </div>
            <div className="rounded-xl bg-black/20 p-4">
              <h2 className="text-lg font-bold text-white">Related codes</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedCodes.map(related => (
                  <Link key={related} href={getCodeHubPath(locale, related)} className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-blue-100 hover:bg-blue-500/20">
                    {related}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-5">
            <div className="flex gap-3">
              <AlertTriangle className="text-amber-200" />
              <p className="text-sm leading-6 text-amber-50">{copy.warning}</p>
            </div>
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#111827] p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white"><Gauge size={20} /> Signals to compare</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div><span className="font-semibold text-slate-100">System:</span> {copy.system}</div>
              <div><span className="font-semibold text-slate-100">Common symptoms:</span> {symptoms.join(', ') || 'Check engine light, drivability change'}</div>
              <div><span className="font-semibold text-slate-100">Likely causes:</span> {causes.join(', ') || 'Wiring, connector, sensor or system fault'}</div>
            </div>
          </section>
        </aside>
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-8">
        <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><Link2 size={22} /> {copy.relatedTitle}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vehicleTargets.map(target => (
              <Link key={target.href} href={target.href.replace('/en/', `/${locale}/`)} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-slate-100 hover:border-blue-400/40">
                {target.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
