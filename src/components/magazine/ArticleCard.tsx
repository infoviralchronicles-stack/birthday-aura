import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    imageAlt?: string | null;
    readTime: number;
    viewsCount: number;
    publishedAt?: Date | string | null;
    category?: {
      name: string;
      slug: string;
      color: string;
    } | null;
    author?: {
      name: string;
      avatar?: string | null;
    } | null;
    isFeatured?: boolean;
    isTrending?: boolean;
    isEditorsPick?: boolean;
  };
  layout?: 'standard' | 'horizontal' | 'compact' | 'lead';
}

export default function ArticleCard({ article, layout = 'standard' }: ArticleCardProps) {
  const categoryName = article.category?.name || 'Intelligence';
  const categorySlug = article.category?.slug || 'gold-bullion';
  const categoryColor = article.category?.color || '#d4af37';

  // 1. Horizontal List Layout (Perfect for sidebars / category listings)
  if (layout === 'horizontal') {
    return (
      <article className="group flex items-center gap-4 py-4 border-b border-gray-100 dark:border-editorial-cardDarkBorder last:border-0">
        <div className="relative w-24 h-20 sm:w-28 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-editorial-subtle">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            fill
            sizes="120px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link
            href={`/category/${categorySlug}`}
            className="text-[10px] uppercase font-mono tracking-wider font-semibold hover:underline block mb-1"
            style={{ color: categoryColor }}
          >
            {categoryName}
          </Link>
          <h4 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h4>
          <div className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono">
            <span>{formatDate(article.publishedAt)}</span>
            <span>&bull;</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </article>
    );
  }

  // 2. Compact Layout (For trending lists & numbered lists)
  if (layout === 'compact') {
    return (
      <article className="group py-3 border-b border-gray-100 dark:border-editorial-cardDarkBorder last:border-0">
        <Link
          href={`/category/${categorySlug}`}
          className="text-[10px] uppercase font-mono tracking-wider font-semibold hover:underline block mb-1"
          style={{ color: categoryColor }}
        >
          {categoryName}
        </Link>
        <h4 className="text-sm font-serif font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h4>
        <div className="flex items-center space-x-3 text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-mono">
          <span>{article.readTime} min read</span>
          {article.viewsCount > 0 && (
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" /> {article.viewsCount}
            </span>
          )}
        </div>
      </article>
    );
  }

  // 3. Lead / Hero Feature Layout
  if (layout === 'lead') {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder shadow-sm transition-all hover:shadow-xl hover:border-gold-500/40">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-2 mb-3">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-mono font-bold bg-white/20 backdrop-blur-md text-gold-300"
              >
                {categoryName}
              </span>
              {article.isEditorsPick && (
                <span className="flex items-center text-[10px] uppercase font-mono tracking-wider text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 mr-1" /> Editor&apos;s Pick
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black leading-tight mb-3 group-hover:text-gold-300 transition-colors">
              <Link href={`/article/${article.slug}`}>
                {article.title}
              </Link>
            </h3>

            <p className="text-sm sm:text-base text-gray-200 line-clamp-2 max-w-3xl font-sans mb-4 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-300 font-mono pt-3 border-t border-white/20">
              <div className="flex items-center space-x-2">
                {article.author && <span>By {article.author.name}</span>}
                <span>&bull;</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {article.readTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // 4. Standard Editorial Card (Default)
  return (
    <article className="group flex flex-col h-full bg-white dark:bg-editorial-cardDark rounded-xl border border-gray-200/80 dark:border-editorial-cardDarkBorder overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-gold-500/40">
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100 dark:bg-editorial-subtle">
        <Image
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-mono font-bold text-white shadow-sm"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryName}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-gray-950 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors mb-2">
            <Link href={`/article/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-500 dark:text-gray-400">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1 text-gold-500" /> {article.readTime} min read
          </span>
        </div>
      </div>
    </article>
  );
}
