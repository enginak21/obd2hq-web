import { notFound } from 'next/navigation';
import { getBlogPosts } from '@/data/blog';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

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
    title: `${post.title} - OBD2HQ Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;
  setRequestLocale(locale);
  const blogPosts = getBlogPosts(locale);
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      {/* Article Header */}
      <header className="relative border-b border-white/5 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <nav className="flex items-center text-sm text-slate-400 mb-8 font-medium">
            <Link href={`/${locale}`} className="hover:text-blue-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/blog`} className="hover:text-blue-400 transition-colors">Blog</Link>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <article 
          className="prose prose-invert prose-blue max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h3:text-2xl prose-h3:mt-8 prose-p:text-lg prose-p:leading-relaxed prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Affiliate Disclaimer */}
        <div className="mt-16 p-6 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-400">
          <strong>Affiliate Disclosure:</strong> Some of the links on this page are affiliate links. This means that, at zero cost to you, OBD2HQ will earn an affiliate commission if you click through the link and finalize a purchase. We only recommend products we personally test and believe will add value to our readers.
        </div>
      </div>
    </main>
  );
}
