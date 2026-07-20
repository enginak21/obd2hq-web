import { notFound } from 'next/navigation';
import { getBlogAlternates, getBlogPosts } from '@/data/blog';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { fitSeoDescription, fitSeoTitle } from '@/utils/seo';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  const blogPosts = getBlogPosts(locale);
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: fitSeoTitle(`${post.title} - OBD2HQ Blog`),
    description: fitSeoDescription(post.description),
    alternates: getBlogAlternates(locale, slug),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPostPage' });
  const blogPosts = getBlogPosts(locale);
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "OBD2HQ Editorial Team",
      "url": `https://www.obd2hq.com/${locale}/reviewers`
    },
    "publisher": {
      "@type": "Organization",
      "name": "OBD2HQ",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.obd2hq.com/icon.jpg"
      }
    },
    "mainEntityOfPage": `https://www.obd2hq.com/${locale}/blog/${slug}`
  };

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <header className="hero-visual hero-visual-news relative border-b border-white/5 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <nav className="flex items-center text-sm text-slate-400 mb-8 font-medium">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors">{t('home')}</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/blog`} className="hover:text-blue-400 transition-colors">{t('blog')}</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-300 truncate">{post.title}</span>
          </nav>

          <div className="text-blue-400 text-sm font-bold tracking-widest uppercase mb-4">
            {post.date}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden relative">
            <Image
              src={post.image}
              alt={post.title}
              fill
              unoptimized={post.image.startsWith('http')}
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </header>


      <div className="max-w-4xl mx-auto px-6 mt-12">
        <article
          className="prose prose-invert prose-blue max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-lg prose-p:leading-relaxed prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />


        <div className="mt-16 p-6 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-400">
          <strong>{t('affiliateDisclaimer')}</strong> {t('affiliateText')}
        </div>
      </div>
    </main>
  );
}
