import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllNews, getNewsBySlug, getNewsCategoryKey } from '@/data/news';
import { getLocalized } from '@/data/db';
import { Calendar, ChevronLeft, Share2 } from 'lucide-react';
import { getAlternates } from '@/utils/seo';

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = getNewsBySlug(slug);
  
  if (!article) return {};

  const title = asString(getLocalized(article.title, locale), article.slug);
  const description = asString(getLocalized(article.summary, locale));

  return {
    title: `${title} - OBD2HQ News`,
    description: description,
    alternates: getAlternates(`news/${slug}`, locale),
    openGraph: {
      title: title,
      description: description,
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
    notFound();
  }

  const locTitle = asString(getLocalized(article.title, locale), article.slug);
  const locContent = asString(getLocalized(article.content, locale));
  const categoryKey = getNewsCategoryKey(article.category);
  
  const dateObj = new Date(article.date);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);

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
      "url": "https://obd2hq.com"
    }]
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      {/* Article Header with Parallax-like Image */}
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

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl relative">
          
          {/* Share button floating */}
          <div className="absolute top-8 right-8">
            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all border border-white/5" aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300 prose-p:font-light prose-p:leading-relaxed prose-headings:text-white prose-a:text-blue-400">
            {/* Split content by paragraphs simply for the sample. In a real app, markdown rendering is preferred. */}
            {locContent.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
