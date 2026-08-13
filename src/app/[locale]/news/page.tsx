import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { getAllNews, getNewsCategoryKey } from '@/data/news';
import { getLocalized } from '@/data/db';
import { Calendar, ChevronRight, Newspaper } from 'lucide-react';
import { getAlternates } from '@/utils/seo';

function asString(value: string | string[] | null, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;


  const titles: Record<string, string> = {
    en: 'Automotive News & Gazette - OBD2HQ',
    tr: 'Otomobil Gazetesi ve Haberler - OBD2HQ',
    de: 'Automobilnachrichten - OBD2HQ',
    es: 'Noticias Automotrices - OBD2HQ',
    fr: 'Actualites automobiles - OBD2HQ'
  };
  const descriptions: Record<string, string> = {
    en: 'Latest automotive news, recalls, diagnostic technology, new model releases and issues that matter to car owners.',
    tr: 'Guncel otomobil haberleri, geri cagirmalar, teshis teknolojileri, yeni model gelismeleri ve arac sahiplerini ilgilendiren sorunlar.',
    de: 'Aktuelle Autonachrichten, Rueckrufe, Diagnosetechnik, neue Modelle und wichtige Themen fuer Fahrzeughalter.',
    es: 'Noticias automotrices, retiradas, tecnologia de diagnostico, nuevos modelos y temas importantes para propietarios.',
    fr: 'Actualites automobiles, rappels, technologie de diagnostic, nouveaux modeles et sujets importants pour les proprietaires.'
  };

  return {
    title: titles[locale] || titles['en'],
    description: descriptions[locale] || descriptions['en'],
    alternates: getAlternates('news', locale)
  };
}

export default async function NewsPortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'NewsPage' });
  const tCode = await getTranslations({ locale, namespace: 'CodePage' });

  const articles = getAllNews();
  const pageUrl = `https://www.obd2hq.com/${locale}/news`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: t('title'), item: pageUrl },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: t('title'),
        description: t('description'),
        url: pageUrl,
      },
      {
        '@type': 'ItemList',
        name: t('title'),
        itemListElement: articles.slice(0, 100).map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: asString(getLocalized(article.title, locale), article.slug),
          url: `${pageUrl}/${article.slug}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="hero-visual hero-visual-news relative border-b border-white/5 pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <nav className="flex flex-wrap items-center text-sm text-slate-400 mb-8 font-medium gap-y-2">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors shrink-0">{tCode('home')}</Link>
            <span className="mx-2 shrink-0">/</span>
            <span className="text-white capitalize shrink-0">{t('title')}</span>
          </nav>

          <div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-400 font-bold text-sm tracking-widest shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                {t('badge')}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl font-light">
              {t('description')}
            </p>
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-6 mt-12">
        {articles.length === 0 ? (
          <div className="text-center py-24 bg-[#131b2f] rounded-3xl border border-white/5">
            <Newspaper className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('noNewsTitle')}</h2>
            <p className="text-slate-400">{t('noNewsDesc')}</p>
          </div>
        ) : (
          <section aria-labelledby="news-list-heading">
            <h2 id="news-list-heading" className="mb-6 text-2xl font-bold text-white">
              {locale === 'tr' ? 'Son otomobil haberleri' : locale === 'de' ? 'Neueste Automobilnachrichten' : locale === 'es' ? 'Ultimas noticias automotrices' : locale === 'fr' ? 'Dernieres actualites automobiles' : 'Latest automotive news'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const locTitle = asString(getLocalized(article.title, locale), article.slug);
              const locSummary = asString(getLocalized(article.summary, locale));
              const categoryKey = getNewsCategoryKey(article.category);

              const dateObj = new Date(article.date);
              const formattedDate = new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(dateObj);

              return (
                <Link
                  key={article.id}
                  href={`/${locale}/news/${article.slug}`}
                  className="group flex flex-col bg-[#131b2f] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]"
                >
                  <div className="w-full h-56 relative overflow-hidden bg-[#0d1425]">
                    <Image
                      src={article.image}
                      alt={locTitle}
                      width={640}
                      height={360}
                      quality={68}
                      unoptimized={article.image.startsWith('http')}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-white/10">
                        {t(`categories.${categoryKey}`)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-slate-500 text-xs font-medium mb-3">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {formattedDate}
                    </div>

                    <p className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {locTitle}
                    </p>

                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 font-light leading-relaxed">
                      {locSummary}
                    </p>

                    <div className="flex items-center text-blue-500 text-sm font-bold mt-auto group-hover:text-blue-400 transition-colors">
                      {t('readMore')}
                      <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
