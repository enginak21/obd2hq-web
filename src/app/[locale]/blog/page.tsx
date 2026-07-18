import { getBlogPosts } from '@/data/blog';
import { CONTENT_ROADMAP } from '@/data/seo';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternates } from '@/utils/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: getAlternates('blog', locale),
  };
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPage' });
  const blogPosts = getBlogPosts(locale);
  const roadmap = locale === 'tr' ? CONTENT_ROADMAP.tr : CONTENT_ROADMAP.en;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OBD2HQ', item: `https://www.obd2hq.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: t('title1') + t('title2'), item: `https://www.obd2hq.com/${locale}/blog` },
        ],
      },
      {
        '@type': 'Blog',
        name: t('metaTitle'),
        description: t('metaDescription'),
        url: `https://www.obd2hq.com/${locale}/blog`,
      },
      {
        '@type': 'ItemList',
        name: t('metaTitle'),
        itemListElement: blogPosts.map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: post.title,
          url: `https://www.obd2hq.com/${locale}/blog/${post.slug}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Header */}
      <header className="relative border-b border-white/5 pt-20 pb-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            {t('title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{t('title2')}</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            {t('subtitle')}
          </p>
        </div>
      </header>

      {/* Blog Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/${locale}/blog/${post.slug}`} key={post.slug} className="group flex flex-col bg-[#131b2f] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-full h-56 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity"></div>
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
                {post.date}
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-400 leading-relaxed font-light mb-6 flex-1">
                {post.description}
              </p>
              <div className="mt-auto flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                {t('readArticle')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="max-w-5xl mx-auto px-6 mt-16">
        <div className="bg-[#131b2f] border border-white/5 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-3">{t('editorialRoadmap')}</h2>
          <p className="text-slate-400 mb-6">
            {t('roadmapDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roadmap.slice(0, 12).map(topic => (
              <div key={topic} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-slate-300 text-sm">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
