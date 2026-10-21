'use client';

import { useState } from 'react';
import ArticleCard from '@/components/magazine/ArticleCard';
import { Loader2 } from 'lucide-react';

interface ArticleItem {
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
}

interface LoadMoreFeedProps {
  initialArticles: ArticleItem[];
  allRemainingArticles: ArticleItem[];
  pageSize?: number;
}

export default function LoadMoreFeed({
  initialArticles,
  allRemainingArticles,
  pageSize = 4,
}: LoadMoreFeedProps) {
  const [displayedArticles, setDisplayedArticles] = useState<ArticleItem[]>(initialArticles);
  const [visibleCount, setVisibleCount] = useState<number>(initialArticles.length);
  const [loading, setLoading] = useState(false);

  const totalArticles = initialArticles.length + allRemainingArticles.length;
  const hasMore = visibleCount < totalArticles;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const nextIndex = visibleCount - initialArticles.length + pageSize;
      const nextBatch = allRemainingArticles.slice(0, nextIndex);
      setDisplayedArticles([...initialArticles, ...nextBatch]);
      setVisibleCount(initialArticles.length + nextBatch.length);
      setLoading(false);
    }, 350);
  };

  return (
    <div className="space-y-8">
      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {displayedArticles.map((art) => (
          <ArticleCard key={art.id} article={art} layout="standard" />
        ))}
      </div>

      {/* Load More Button & Counter Status */}
      <div className="pt-6 pb-2 text-center space-y-3">
        {hasMore ? (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#0d121c] dark:bg-editorial-cardDark text-white hover:bg-gold-500 hover:text-black dark:hover:bg-gold-500 dark:hover:text-black border border-gray-800 dark:border-editorial-cardDarkBorder text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-gold-500" /> Loading Stories...
              </>
            ) : (
              'Load More Articles'
            )}
          </button>
        ) : (
          <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 dark:bg-editorial-subtle text-gray-500 dark:text-gray-400 text-xs font-mono">
            All latest stories loaded
          </div>
        )}

        <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
          Showing {visibleCount} of {totalArticles} articles
        </p>
      </div>
    </div>
  );
}
