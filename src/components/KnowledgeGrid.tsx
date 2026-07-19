import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function KnowledgeCard({
  href,
  title,
  description,
  tags = [],
}: {
  href: string;
  title: string;
  description: string;
  tags?: string[];
}) {
  return (
    <Link href={href} className="group rounded-3xl border border-white/5 bg-[#131b2f] p-6 hover:border-blue-500/40 hover:bg-[#17213a] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <p className="mt-3 text-slate-400 leading-relaxed">{description}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-blue-400 shrink-0 mt-2 group-hover:translate-x-1 transition-transform" />
      </div>
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.slice(0, 4).map(tag => (
            <span key={tag} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  );
}

export function KnowledgeHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="hero-visual hero-visual-vehicle border-b border-white/5 bg-[#0d1425]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-200 mb-6">
          {eyebrow}
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-400 leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
