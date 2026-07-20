import { notFound } from 'next/navigation';
import { cars } from '@/data/db';
import { getLocalizedWarningLight, warningLights } from '@/data/lights';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';

interface PageProps {
  params: Promise<{
    locale: string;
    make: string;
    model: string;
  }>;
}

function getUrgencyLabel(urgency: string, locale: string) {
  const labels: Record<string, Record<string, string>> = {
    tr: { Critical: 'Kritik', Moderate: 'Orta', Information: 'Bilgi' },
    de: { Critical: 'Kritisch', Moderate: 'Mittel', Information: 'Hinweis' },
    es: { Critical: 'Crítico', Moderate: 'Moderado', Information: 'Información' },
    fr: { Critical: 'Critique', Moderate: 'Modéré', Information: 'Information' },
  };
  return labels[locale]?.[urgency] || urgency;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, make, model } = resolvedParams;
  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!isValidCar) return { title: 'Not Found' };
  const t = await getTranslations({ locale, namespace: 'LightsPage' });

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  return {
    title: fitSeoTitle(t('metaTitle', { make: capMake, model: capModel })),
    description: fitSeoDescription(t('metaDescription', { make: capMake, model: capModel })),
    alternates: getAlternates(`${make}/${model}/lights`, locale),
    openGraph: {
      images: ['/images/lights/check_engine_light_1783448321560.jpg'],
    },
  };
}

export default async function LightsDirectoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, make, model } = resolvedParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'LightsPage' });

  const isValidCar = cars.some(c => c.make === make && c.models.includes(model));
  if (!isValidCar) notFound();

  const capMake = make.charAt(0).toUpperCase() + make.slice(1);
  const capModel = model.charAt(0).toUpperCase() + model.slice(1);
  const introTitle = locale === 'tr' ? 'Uyarı ışıklarını aciliyetine göre okuyun' : locale === 'de' ? 'Warnleuchten nach Dringlichkeit lesen' : locale === 'es' ? 'Lee las luces por nivel de urgencia' : locale === 'fr' ? 'Lire les voyants par niveau d’urgence' : 'Read warning lights by urgency';
  const introText = locale === 'tr'
    ? `${capMake} ${capModel} gösterge ışıkları renk, yanıp sönme durumu ve sürüş belirtisine göre değerlendirilmelidir. Kırmızı ışık, yağ basıncı, fren, hararet veya yanıp sönen motor arıza lambası varsa aracı güvenli şekilde durdurup önce temel kontrolleri yapın. Sabit sarı uyarılarda kodu okuyun, belirtileri not alın ve arızayı silmeden önce freeze-frame verisini saklayın.`
    : locale === 'de'
      ? `${capMake} ${capModel} Warnleuchten sollten nach Farbe, Blinkverhalten und Fahrsymptomen bewertet werden. Rote Symbole, Öldruck, Bremse, Überhitzung oder eine blinkende Motorkontrollleuchte brauchen sofortige Aufmerksamkeit. Bei dauerhaft gelben Warnungen den Code auslesen, Symptome notieren und Freeze-Frame-Daten sichern, bevor Fehler gelöscht werden.`
      : locale === 'es'
        ? `Las luces del tablero del ${capMake} ${capModel} deben evaluarse por color, parpadeo y síntomas. Una luz roja, aceite, freno, temperatura o check engine intermitente requiere detenerse con seguridad y revisar primero. Con una luz amarilla fija, lee el código, anota los síntomas y guarda los datos freeze-frame antes de borrar fallas.`
        : locale === 'fr'
          ? `Les voyants du ${capMake} ${capModel} doivent être lus selon la couleur, le clignotement et les symptômes. Un voyant rouge, huile, frein, température ou moteur clignotant demande un arrêt sûr et des contrôles immédiats. Avec un voyant jaune fixe, lisez le code, notez les symptômes et sauvegardez les données freeze-frame avant d’effacer les défauts.`
          : `${capMake} ${capModel} dashboard lights should be read by color, flashing behavior and driving symptoms. Red lights, oil pressure, brake, coolant temperature or a flashing check engine light need immediate safe checks. For a steady amber warning, read the code, record the symptoms and save freeze-frame data before clearing faults.`;
  const priorityTitle = locale === 'tr' ? 'Önce hangi ışığa bakmalısınız?' : locale === 'de' ? 'Welche Warnung zuerst prüfen?' : locale === 'es' ? '¿Qué luz revisar primero?' : locale === 'fr' ? 'Quel voyant vérifier en premier ?' : 'Which warning should you check first?';
  const priorityItems = locale === 'tr'
    ? ['Kırmızı yağ, fren veya hararet ışığı varsa sürüşe devam etmeyin.', 'Yanıp sönen motor arıza lambası aktif tekleme ve katalizör riski anlamına gelebilir.', 'Sarı sabit ışıkta kodu okuyun, belirtileri not alın ve aynı gün kontrol planlayın.', 'Işık söndü diye hafızadaki arıza kaydını silmeyin; önce freeze-frame verisini kaydedin.']
    : locale === 'de'
      ? ['Bei roter Öl-, Brems- oder Temperaturwarnung nicht weiterfahren.', 'Eine blinkende Motorkontrollleuchte kann aktive Fehlzündungen und Katalysatorschäden bedeuten.', 'Bei dauerhaft gelber Warnung Code auslesen, Symptome notieren und zeitnah prüfen.', 'Löschen Sie gespeicherte Fehler nicht sofort; sichern Sie zuerst Freeze-Frame-Daten.']
      : locale === 'es'
        ? ['Con luz roja de aceite, freno o temperatura, no sigas conduciendo.', 'Un check engine intermitente puede indicar fallo de encendido activo y riesgo para el catalizador.', 'Con luz amarilla fija, lee el código, anota síntomas y programa una revisión.', 'No borres la memoria de fallas antes de guardar los datos freeze-frame.']
        : locale === 'fr'
          ? ['Avec un voyant rouge d’huile, frein ou température, évitez de continuer à rouler.', 'Un voyant moteur clignotant peut indiquer des ratés actifs et un risque pour le catalyseur.', 'Avec un voyant jaune fixe, lisez le code, notez les symptômes et prévoyez un contrôle.', 'Ne supprimez pas les défauts avant d’avoir sauvegardé les données freeze-frame.']
          : ['Do not keep driving with a red oil, brake or temperature warning.', 'A flashing check engine light can mean active misfire and catalyst damage risk.', 'For a steady amber warning, read the code, note symptoms and plan diagnosis soon.', 'Do not clear stored faults before saving freeze-frame data.'];

  const lightsList = Object.values(warningLights).map(light => getLocalizedWarningLight(light, locale));
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
      { '@type': 'ListItem', position: 2, name: capMake, item: `https://www.obd2hq.com/${locale}/${make}` },
      { '@type': 'ListItem', position: 3, name: capModel, item: `https://www.obd2hq.com/${locale}/${make}/${model}` },
      { '@type': 'ListItem', position: 4, name: t('lights'), item: `https://www.obd2hq.com/${locale}/${make}/${model}/lights` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('metaTitle', { make: capMake, model: capModel }),
    itemListElement: lightsList.map((light, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: light.name,
      url: `https://www.obd2hq.com/${locale}/${make}/${model}/lights/${light.id}`,
      image: `https://www.obd2hq.com${light.imageSrc}`,
    })),
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t('faqMeaningQ', { make: capMake, model: capModel }),
        acceptedAnswer: { '@type': 'Answer', text: t('faqMeaningA') },
      },
      {
        '@type': 'Question',
        name: t('faqDriveQ'),
        acceptedAnswer: { '@type': 'Answer', text: t('faqDriveA') },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbSchema, itemListSchema, faqSchema]) }}
      />

      <header className="hero-visual hero-visual-lights relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">

          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{t('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{make}</span>
            <span className="mx-2 shrink-0">/</span>
            <span className="capitalize shrink-0">{model}</span>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-white shrink-0">{t('lights')}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-3 mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-[#1a233a] border border-white/5 text-slate-300 text-sm font-semibold tracking-wide uppercase">
                  {capMake} {capModel}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl font-light">
                {t('subtitle', { make: capMake, model: capModel })}
              </p>
            </div>
          </div>
        </div>
      </header>


      <div className="max-w-5xl mx-auto px-6 mt-12">
        <section className="mb-8 rounded-3xl border border-white/5 bg-[#131b2f] p-6">
          <h2 className="text-2xl font-bold text-white">{introTitle}</h2>
          <p className="mt-3 leading-7 text-slate-400">{introText}</p>
          <h2 className="mt-6 text-xl font-bold text-white">{priorityTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {priorityItems.map(item => (
              <li key={item} className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-300">{item}</li>
            ))}
          </ul>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lightsList.map((light) => {
            let colorClasses = "";
            let glowClasses = "";
            if (light.color === 'red') {
              colorClasses = "text-red-500 bg-red-500/10 border-red-500/30";
              glowClasses = "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]";
            } else if (light.color === 'yellow') {
              colorClasses = "text-amber-500 bg-amber-500/10 border-amber-500/30";
              glowClasses = "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]";
            } else {
              colorClasses = "text-green-500 bg-green-500/10 border-green-500/30";
              glowClasses = "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]";
            }

            return (
              <Link
                key={light.id}
                href={`/${locale}/${make}/${model}/lights/${light.id}`}
                className={`group overflow-hidden bg-[#131b2f] border border-white/5 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${glowClasses} flex flex-col`}
              >
                <div className="relative aspect-[16/10] w-full bg-[#0b1222]">
                  <Image
                    src={light.imageSrc}
                    alt={`${capMake} ${capModel} ${light.name} dashboard warning light`}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 100vw"
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131b2f] via-transparent to-transparent" />
                  <div
                    className={`absolute bottom-4 left-4 w-14 h-14 rounded-2xl flex items-center justify-center border ${colorClasses} backdrop-blur-md transition-transform duration-300 group-hover:scale-110`}
                    dangerouslySetInnerHTML={{ __html: light.iconSvg }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{light.name}</h3>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-400">{light.description}</p>
                  <span className={`mt-5 text-xs font-bold uppercase tracking-wider ${light.urgency === 'Critical' ? 'text-red-400' : light.urgency === 'Moderate' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {getUrgencyLabel(light.urgency, locale)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
