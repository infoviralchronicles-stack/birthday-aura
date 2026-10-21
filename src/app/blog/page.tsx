import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Clock, Eye, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Celebrity Blog, Biographies & Stories | Birthday Aura',
  description:
    'Read in-depth celebrity biographies, Before Fame stories, zodiac compatibility guides, and pop-culture features on the Birthday Aura Blog.',
};

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true, author: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-16">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-8 pt-8 space-y-10">
        {/* Blog Header & Category Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#ffe4f2] text-[#ff1f5a] text-xs font-bold uppercase tracking-wider mb-2">
              Birthday Aura Editorial
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Blog &amp; Celebrity Stories
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              In-depth celebrity biographies, Before Fame journeys, and astrology features.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/blog"
              className="px-3.5 py-1.5 rounded-full bg-[#ff1f5a] text-white text-xs font-bold transition-colors"
            >
              All Posts ({articles.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-full bg-[#f1f1f4] hover:bg-[#ffe4f2] text-gray-800 hover:text-[#ff1f5a] text-xs font-bold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Blog Post */}
        {featuredArticle && (
          <Link
            href={`/article/${featuredArticle.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 bg-[#f8f8fa] rounded-[24px] p-5 sm:p-7 border border-gray-200/80 hover:border-[#ff1f5a]/40 hover:shadow-md transition-all items-center"
          >
            <div className="lg:col-span-6 aspect-[16/10] rounded-[18px] overflow-hidden bg-gray-200">
              <img
                src={featuredArticle.featuredImage}
                alt={featuredArticle.imageAlt || featuredArticle.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="lg:col-span-6 space-y-3.5">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                <span className="px-2.5 py-1 rounded-full bg-[#ffe4f2] text-[#ff1f5a]">
                  {featuredArticle.category?.name || 'Featured'}
                </span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featuredArticle.readTime} min read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight group-hover:text-[#ff1f5a] transition-colors">
                {featuredArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#ff1f5a]">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* All Blog Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingArticles.map((art) => (
            <Link
              key={art.id}
              href={`/article/${art.slug}`}
              className="group flex flex-col bg-[#f8f8fa] rounded-[22px] p-4 border border-gray-200/80 hover:border-[#ff1f5a]/40 hover:shadow-md transition-all"
            >
              <div className="w-full aspect-[16/10] rounded-[16px] overflow-hidden bg-gray-200 mb-3.5">
                <img
                  src={art.featuredImage}
                  alt={art.imageAlt || art.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1.5">
                <span className="text-[#ff1f5a]">
                  {art.category?.name || 'Biography'}
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.readTime}m
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-gray-950 leading-snug group-hover:text-[#ff1f5a] transition-colors line-clamp-2 mb-2">
                {art.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">
                {art.excerpt}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-gray-500">
                <span>By {art.author?.name || 'Birthday Aura'}</span>
                <span className="text-[#ff1f5a] group-hover:underline">
                  Read &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
