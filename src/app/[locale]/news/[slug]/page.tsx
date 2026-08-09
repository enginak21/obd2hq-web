import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllNews, getNewsBySlug, getNewsCategoryKey, getNewsRedirectSlug } from '@/data/news';
import { getLocalized } from '@/data/db';
import { Calendar, ChevronLeft, Share2 } from 'lucide-react';
import { fitSeoDescription, fitSeoTitle, getAlternates } from '@/utils/seo';
import { getTopClickNewsFocus } from '@/data/top-click-seo';

function asString(value: string | string[] | null, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export async function generateStaticParams() {
  const news = getAllNews();
  const locales = ['en', 'de', 'es', 'tr', 'fr'];

  const params: Array<{ locale: string; slug: string }> = [];

  for (const article of news) {
    for (const locale of locales) {
      params.push({
        locale: locale,
        slug: article.slug
      });
    }
  }

  return params;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    const redirectSlug = getNewsRedirectSlug(slug);
    if (redirectSlug) permanentRedirect(`/${locale}/news/${redirectSlug}`);
    notFound();
  }

  const title = asString(getLocalized(article.title, locale), article.slug);
  const description = asString(getLocalized(article.summary, locale));
  const topClickFocus = getTopClickNewsFocus(locale, slug);
  const metaTitle = fitSeoTitle(topClickFocus ? `${topClickFocus.query}: ${title}` : `${title} - OBD2HQ News`);
  const metaDescription = fitSeoDescription(topClickFocus ? `${topClickFocus.answer} Latest context, host details and what changes for the show.` : description);

  return {
    title: metaTitle,
    description: metaDescription,
    robots: {
      index: true,
      follow: true,
    },
    alternates: getAlternates(`news/${slug}`, locale),
    openGraph: {
      title,
      description: metaDescription,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    }
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'NewsPage' });
  const article = getNewsBySlug(slug);

  if (!article) {
    const redirectSlug = getNewsRedirectSlug(slug);
    if (redirectSlug) {
      permanentRedirect(`/${locale}/news/${redirectSlug}`);
    }
    notFound();
  }

  const locTitle = asString(getLocalized(article.title, locale), article.slug);
  const categoryKey = getNewsCategoryKey(article.category);
  const topClickFocus = getTopClickNewsFocus(locale, slug);

  const dateObj = new Date(article.date);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
  const articleSummary = asString(getLocalized(article.summary, locale));
  const overviewHeading = locale === 'tr' ? 'Haberin \u00f6zeti' : locale === 'de' ? 'Kurzübersicht' : locale === 'es' ? 'Resumen de la noticia' : locale === 'fr' ? 'Résumé de l\u2019article' : 'Article summary';
  const contextHeading = locale === 'tr' ? 'OBD2HQ notu' : locale === 'de' ? 'OBD2HQ-Einordnung' : locale === 'es' ? 'Nota de OBD2HQ' : locale === 'fr' ? 'Note OBD2HQ' : 'OBD2HQ context';
  const contextText = locale === 'tr'
    ? 'Bu aktif haber sayfas\u0131 kalite kontrol\u00fcnden ge\u00e7mi\u015f k\u0131sa otomotiv ba\u011flam\u0131 sunar. OBD2HQ haberleri ara\u00e7 sahipleri i\u00e7in te\u015fhis, servis eri\u015fimi, tamir hakk\u0131 ve ara\u00e7 teknolojisi etkileriyle birlikte de\u011ferlendirir.'
    : locale === 'de'
      ? 'Diese aktive Nachrichtenseite hat die Qualitätsprüfung bestanden. OBD2HQ ordnet Nachrichten für Fahrzeughalter mit Blick auf Diagnose, Servicezugang, Reparaturrecht und Fahrzeugtechnik ein.'
      : locale === 'es'
        ? 'Esta noticia activa ha pasado el control de calidad. OBD2HQ la resume para propietarios con contexto sobre diagnóstico, acceso al servicio, derecho a reparar y tecnología del vehículo.'
        : locale === 'fr'
          ? 'Cette actualité active a passé le contrôle qualité. OBD2HQ la présente avec un contexte utile pour le diagnostic, l\u2019accès au service, le droit à la réparation et la technologie automobile.'
          : 'This active news page has passed the quality gate. OBD2HQ frames each story around diagnostics, service access, right-to-repair impact and vehicle technology context for owners.';

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": locTitle,
    "image": [
      article.image
    ],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": [{
      "@type": "Organization",
      "name": "OBD2HQ AI Desk",
      "url": "https://www.obd2hq.com"
    }]
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />

      <div className="relative h-[50vh] min-h-[400px] w-full bg-[#0d1425] overflow-hidden">
        <Image
          src={article.image}
          alt={locTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href={`/${locale}/news`}
              className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-6 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('backToNews')}
            </Link>

            <div className="flex items-center space-x-4 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg">
                {t(`categories.${categoryKey}`)}
              </span>
              <span className="flex items-center text-slate-300 text-sm font-medium">
                <Calendar className="w-4 h-4 mr-1.5 opacity-70" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {locTitle}
            </h1>
          </div>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl relative">


          <div className="absolute top-8 right-8">
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all border border-white/5" aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-a:text-blue-400">
            <h2>{overviewHeading}</h2>
            <p>{articleSummary}</p>
            <h2>{contextHeading}</h2>
            <p>{contextText}</p>
            {topClickFocus && (
              <>
                <h2>{topClickFocus.title}</h2>
                <p>{topClickFocus.answer}</p>
                <ul>
                  {topClickFocus.followUps.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
