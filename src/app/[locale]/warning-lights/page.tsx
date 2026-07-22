import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Gauge, ShieldCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getLocalizedWarningLight, warningLights } from '@/data/lights';
import { getCodeHubPath } from '@/data/gsc-seo';
import { getNavigationLabels, getPopularWarningLightLinks, getWarningLightsHubPath } from '@/data/navigation';
import { SUPPORTED_LOCALES } from '@/data/seo';
import { fitSeoDescription, fitSeoTitle } from '@/utils/seo';

type PageProps = {
  params: Promise<{ locale: string }>;
};

const copy = {
  en: {
    title: 'Dashboard Warning Lights: Meanings, Urgency and First Checks',
    description: 'Identify dashboard warning lights by symbol, urgency and first checks. Learn when to stop, what to scan, and which OBD2 codes may be related.',
    eyebrow: 'Warning light hub',
    urgentTitle: 'Start with urgency, not parts',
    urgentText: 'Red oil, brake, coolant temperature or a flashing check engine light can mean stop safely. Yellow lights usually need diagnosis soon, but the symbol and symptoms decide the risk.',
    symbols: 'Warning lights by symbol',
    vehicles: 'Popular vehicle warning-light guides',
    codes: 'Related OBD2 code paths',
    cta: 'Open guide',
  },
  tr: {
    title: 'Gösterge Uyarı Işıkları: Anlamları, Aciliyet ve İlk Kontroller',
    description: 'Gösterge uyarı ışıklarını sembole, aciliyet seviyesine ve ilk kontrollere göre bulun. Ne zaman durmanız, neyi okutmanız ve hangi OBD2 kodlarının ilişkili olabileceğini görün.',
    eyebrow: 'Uyarı ışıkları merkezi',
    urgentTitle: 'Parçadan önce aciliyeti belirleyin',
    urgentText: 'Kırmızı yağ, fren, hararet veya yanıp sönen motor ışığı güvenli yerde durmayı gerektirebilir. Sarı ışıklar genelde hızlı teşhis ister; risk sembol ve belirtiye göre değişir.',
    symbols: 'Sembole göre uyarı ışıkları',
    vehicles: 'Popüler araç uyarı ışığı rehberleri',
    codes: 'İlgili OBD2 kod yolları',
    cta: 'Rehberi aç',
  },
  de: {
    title: 'Warnleuchten im Auto: Bedeutung, Dringlichkeit und erste Prüfungen',
    description: 'Warnleuchten nach Symbol, Dringlichkeit und ersten Prüfungen verstehen. Erkennen Sie, wann Sie anhalten sollten und welche OBD2-Codes passen können.',
    eyebrow: 'Warnleuchten-Zentrale',
    urgentTitle: 'Erst Dringlichkeit klären, dann Teile prüfen',
    urgentText: 'Rote Öl-, Brems- oder Temperaturwarnungen und eine blinkende Motorkontrollleuchte können sofortiges Anhalten erfordern. Gelbe Warnungen sollten zeitnah diagnostiziert werden.',
    symbols: 'Warnleuchten nach Symbol',
    vehicles: 'Beliebte Fahrzeug-Warnleuchten',
    codes: 'Verwandte OBD2-Codepfade',
    cta: 'Ratgeber öffnen',
  },
  es: {
    title: 'Luces del tablero: significado, urgencia y primeras revisiones',
    description: 'Identifica luces del tablero por símbolo, urgencia y primeras revisiones. Aprende cuándo detenerte, qué escanear y qué códigos OBD2 pueden estar relacionados.',
    eyebrow: 'Centro de luces del tablero',
    urgentTitle: 'Primero la urgencia, luego las piezas',
    urgentText: 'Aceite, freno, temperatura en rojo o check engine parpadeando pueden requerir detenerse con seguridad. Las luces amarillas suelen pedir diagnóstico pronto.',
    symbols: 'Luces por símbolo',
    vehicles: 'Guías populares por vehículo',
    codes: 'Rutas de códigos OBD2 relacionados',
    cta: 'Abrir guía',
  },
  fr: {
    title: 'Voyants tableau de bord : signification, urgence et premiers contrôles',
    description: 'Identifiez les voyants par symbole, urgence et premiers contrôles. Sachez quand vous arrêter, quoi scanner et quels codes OBD2 peuvent être liés.',
    eyebrow: 'Centre des voyants',
    urgentTitle: 'Commencez par l’urgence, pas par les pièces',
    urgentText: 'Huile, frein, température en rouge ou voyant moteur clignotant peuvent imposer un arrêt sécurisé. Les voyants jaunes demandent souvent un diagnostic rapide.',
    symbols: 'Voyants par symbole',
    vehicles: 'Guides populaires par véhicule',
    codes: 'Codes OBD2 liés',
    cta: 'Ouvrir le guide',
  },
};

function localeCopy(locale: string) {
  return copy[(SUPPORTED_LOCALES as readonly string[]).includes(locale) ? locale as keyof typeof copy : 'en'];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = localeCopy(locale);
  const languages = Object.fromEntries(SUPPORTED_LOCALES.map((item) => [item, getWarningLightsHubPath(item)]));
  languages['x-default'] = getWarningLightsHubPath('en');

  return {
    title: fitSeoTitle(c.title),
    description: fitSeoDescription(c.description),
    alternates: {
      canonical: getWarningLightsHubPath(locale),
      languages,
    },
    openGraph: {
      title: c.title,
      description: c.description,
      images: ['/images/lights/check_engine_light_1783448321560.jpg'],
    },
  };
}

export default async function WarningLightsHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = localeCopy(locale);
  const nav = getNavigationLabels(locale);
  const lights = Object.values(warningLights).map((light) => getLocalizedWarningLight(light, locale));
  const vehicleLinks = getPopularWarningLightLinks(locale);
  const codeLinks = ['P0420', 'P0300', 'P0171', 'P0128', 'C0035', 'B0020'].map((code) => ({
    code,
    href: getCodeHubPath(locale, code),
  }));

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://obd2hq.com/${locale}` },
        { '@type': 'ListItem', position: 2, name: nav.warningLights, item: `https://obd2hq.com${getWarningLightsHubPath(locale)}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: c.title,
      description: c.description,
      url: `https://obd2hq.com${getWarningLightsHubPath(locale)}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: lights.map((light, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: light.name,
          description: light.description,
        })),
      },
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1c] pb-24 text-slate-200">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <header className="hero-visual hero-visual-lights border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400">
            <Link href={`/${locale}`} className="hover:text-blue-300">OBD2HQ</Link>
            <span>/</span>
            <span className="text-white">{nav.warningLights}</span>
          </nav>
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-black text-amber-100">
              <Gauge className="h-4 w-4" />
              {c.eyebrow}
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{c.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{c.description}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
          <h2 className="flex items-center gap-3 text-2xl font-black text-white">
            <AlertTriangle className="h-6 w-6 text-amber-200" />
            {c.urgentTitle}
          </h2>
          <p className="mt-3 max-w-4xl leading-7 text-amber-50/85">{c.urgentText}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
            <h2 className="flex items-center gap-2 text-2xl font-black text-white">
              <ShieldCheck className="h-6 w-6 text-blue-300" />
              {c.symbols}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {lights.map((light) => (
                <article key={light.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="relative h-36 bg-slate-950">
                    <Image src={light.imageSrc} alt={light.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-black text-white">{light.name}</h2>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-300">{light.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <h2 className="text-lg font-black text-white">{c.vehicles}</h2>
              <div className="mt-4 grid gap-3">
                {vehicleLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.08]">
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4 text-blue-300" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111827] p-6">
              <h2 className="text-lg font-black text-white">{c.codes}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {codeLinks.map((link) => (
                  <Link key={link.code} href={link.href} className="rounded-2xl bg-blue-500/10 px-4 py-3 text-center font-black text-blue-200 hover:bg-blue-500/20">
                    {link.code}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
