import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, Gauge, ShieldCheck } from 'lucide-react';
import { cars } from '@/data/db';
import { getLocalizedWarningLight, warningLights } from '@/data/lights';
import { fitSeoDescription, fitSeoTitle } from '@/utils/seo';
import { getBrandWarningCopy, getBrandWarningLightsAlternates, getBrandWarningLightsPath } from '@/data/gsc-seo';

type PageProps = {
  params: Promise<{
    locale: string;
    make: string;
  }>;
};

function titleCase(value: string) {
  return value.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function getBrandSearchIntentBlock(locale: string, displayMake: string) {
  if (locale === 'tr') {
    return {
      title: `${displayMake} uyarı ışığı aramalarını nasıl okumalı?`,
      text: `${displayMake} warning lights, ${displayMake} vehicle warning lights veya gösterge uyarı ışığı gibi aramalar aynı ihtiyaca gelir: sembolün anlamı, aciliyet seviyesi, ilk kontrol ve ilgili OBD2 kodu.`,
      chips: [`${displayMake} warning lights`, `${displayMake} vehicle warning lights`, `${displayMake} gösterge uyarı ışıkları`],
    };
  }
  if (locale === 'de') {
    return {
      title: `${displayMake} Warnleuchten richtig einordnen`,
      text: `Suchanfragen wie ${displayMake} warning lights oder ${displayMake} vehicle warning lights meinen meist dasselbe: Symbol, Dringlichkeit, erste Prüfung und passende OBD2-Codes.`,
      chips: [`${displayMake} warning lights`, `${displayMake} vehicle warning lights`, `${displayMake} Warnleuchten`],
    };
  }
  if (locale === 'es') {
    return {
      title: `Cómo leer las luces ${displayMake}`,
      text: `Búsquedas como ${displayMake} warning lights o ${displayMake} vehicle warning lights buscan la misma respuesta: símbolo, urgencia, primera revisión y códigos OBD2 relacionados.`,
      chips: [`${displayMake} warning lights`, `${displayMake} vehicle warning lights`, `luces tablero ${displayMake}`],
    };
  }
  if (locale === 'fr') {
    return {
      title: `Comment lire les voyants ${displayMake}`,
      text: `Les recherches ${displayMake} warning lights ou ${displayMake} vehicle warning lights visent la même réponse : symbole, urgence, premier contrôle et codes OBD2 liés.`,
      chips: [`${displayMake} warning lights`, `${displayMake} vehicle warning lights`, `voyants ${displayMake}`],
    };
  }
  return {
    title: `How to read ${displayMake} vehicle warning lights`,
    text: `${displayMake} warning lights and ${displayMake} vehicle warning lights usually mean the same search intent: identify the symbol, urgency, first checks and related OBD2 codes before replacing parts.`,
    chips: [`${displayMake} warning lights`, `${displayMake} vehicle warning lights`, `${displayMake} dashboard lights`],
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, make } = await params;
  if (!cars.some(car => car.make === make)) return { title: 'Not Found' };
  const copy = getBrandWarningCopy(locale, make);
  return {
    title: fitSeoTitle(copy.title),
    description: fitSeoDescription(copy.meta),
    alternates: getBrandWarningLightsAlternates(make, locale),
    openGraph: {
      images: ['/images/lights/check_engine_light_1783448321560.jpg'],
    },
  };
}

export default async function BrandWarningLightsPage({ params }: PageProps) {
  const { locale, make } = await params;
  const car = cars.find(item => item.make === make);
  if (!car) notFound();

  const copy = getBrandWarningCopy(locale, make);
  const displayMake = titleCase(make);
  const searchIntentBlock = getBrandSearchIntentBlock(locale, displayMake);
  const lights = Object.values(warningLights).map(light => getLocalizedWarningLight(light, locale));
  const modelLinks = car.models.slice(0, 9).map(model => ({
    model,
    label: `${displayMake} ${titleCase(model)}`,
    href: `/${locale}/${make}/${model}/lights`,
  }));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: displayMake, item: `https://obd2hq.com/${locale}/${make}` },
      { '@type': 'ListItem', position: 3, name: copy.h1, item: `https://obd2hq.com${getBrandWarningLightsPath(locale, make)}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${displayMake} warning lights: which one is urgent?`,
        acceptedAnswer: { '@type': 'Answer', text: copy.urgent.join(' ') },
      },
      {
        '@type': 'Question',
        name: `Should I scan codes after a ${displayMake} warning light?`,
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. Reading stored and pending OBD2 codes helps separate a warning light symptom from the actual system fault.' },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, faqSchema]) }} />
      <header className="hero-visual hero-visual-lights relative overflow-hidden border-b border-white/5 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href={`/${locale}`} className="hover:text-blue-300">OBD2HQ</Link>
            <span>/</span>
            <Link href={`/${locale}/${make}`} className="hover:text-blue-300">{displayMake}</Link>
            <span>/</span>
            <span className="text-white">{copy.h1}</span>
          </nav>
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-100">
              <Gauge size={16} />
              Search Console warning-light hub
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{copy.h1}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{copy.intro}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <section className="grid gap-4 md:grid-cols-3">
          {copy.urgent.map(item => (
            <div key={item} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-50">
              <AlertTriangle className="mb-3 text-amber-200" />
              {item}
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-blue-400/15 bg-blue-500/10 p-6">
          <h2 className="text-2xl font-bold text-white">{searchIntentBlock.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{searchIntentBlock.text}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {searchIntentBlock.chips.map(chip => (
              <span key={chip} className="rounded-full border border-blue-400/20 bg-black/20 px-3 py-1 text-sm font-semibold text-blue-100">
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white"><ShieldCheck size={22} /> Warning lights by symbol</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lights.map(light => (
              <article key={light.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="relative h-36 bg-slate-950">
                  <Image src={light.imageSrc} alt={light.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-white">{light.name}</h2>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-300">{light.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-2xl font-bold text-white">{displayMake} model warning-light guides</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modelLinks.map(link => (
              <Link key={link.href} href={link.href} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-slate-100 hover:border-blue-400/40">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
