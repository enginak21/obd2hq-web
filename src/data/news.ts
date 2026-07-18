import fs from 'fs';
import path from 'path';

export interface NewsArticle {
  id: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  legacySlugs?: string[];
  title: Record<string, string>;
  summary: Record<string, string>;
  content: Record<string, string>;
}

const CATEGORY_KEY_MAP: Record<string, string> = {
  'brand news': 'brand_news',
  'brand_news': 'brand_news',
  'modded & tuning': 'modified_cars',
  'modified cars': 'modified_cars',
  'modified_cars': 'modified_cars',
  'recalls & issues': 'chronic_issues',
  'chronic issues': 'chronic_issues',
  'chronic_issues': 'chronic_issues',
  'industry & tech': 'industry_news',
  'industry news': 'industry_news',
  'industry_news': 'industry_news',
};

export function getNewsCategoryKey(category: string): string {
  const normalized = category.trim().toLowerCase();
  return CATEGORY_KEY_MAP[normalized] || 'industry_news';
}

export function getAllNews(): NewsArticle[] {
  const newsDir = path.join(process.cwd(), 'src', 'data', 'news');
  
  if (!fs.existsSync(newsDir)) return [];
  
  const files = fs.readdirSync(newsDir).filter(file => file.endsWith('.json'));
  
  const articles: NewsArticle[] = files.map(file => {
    const filePath = path.join(newsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      return JSON.parse(content) as NewsArticle;
    } catch (e) {
      console.error(`Error parsing news file ${file}:`, e);
      return null;
    }
  }).filter((a): a is NewsArticle => a !== null);
  
  // Sort by date descending
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNewsBySlug(slug: string): NewsArticle | null {
  const all = getAllNews();
  return all.find(n => n.slug === slug) || null;
}

export function getNewsRedirectSlug(slug: string): string | null {
  const all = getAllNews();
  const direct = all.find(n => n.slug === slug);
  if (direct) return null;

  const legacy = all.find(n => n.legacySlugs?.includes(slug));
  return legacy?.slug || null;
}
