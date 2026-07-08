import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Reviews - OBD2HQ',
  description: 'Read the latest guides, fixes, and reviews for OBD2 scanners and automotive diagnostics.',
};

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans pb-24">
      {/* Header */}
      <header className="relative border-b border-white/5 pt-16 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Blog & Reviews
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Expert guides, diagnostic tips, and honest reviews of the best OBD2 tools on the market.
          </p>
        </div>
      </header>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/${locale}/blog/${post.slug}`} key={post.slug} className="group">
            <div className="bg-[#131b2f] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all shadow-xl h-full flex flex-col">
              <div className="h-48 w-full bg-slate-800 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">
                  {post.date}
                </div>
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  {post.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
