import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CELEBRITY_DIRECTORY } from '@/lib/birthdayData';
import ArticleCard from '@/components/magazine/ArticleCard';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Celebrity Birthdays & Profiles | Birthday Aura',
  description: 'Search celebrity birthdays, ages, zodiac signs, and biographies on Birthday Aura.',
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || '').trim();
  const qLower = query.toLowerCase();
  const currentYear = new Date().getFullYear();

  const matchingCelebrities = query
    ? CELEBRITY_DIRECTORY.filter(
        (c) =>
          c.name.toLowerCase().includes(qLower) ||
          c.profession.toLowerCase().includes(qLower) ||
          c.birthplace.toLowerCase().includes(qLower) ||
          c.category.toLowerCase().includes(qLower)
      )
    : CELEBRITY_DIRECTORY.slice(0, 10);

  let articles: any[] = [];
  if (query) {
    articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
        ],
      },
      include: { category: true, author: true },
      orderBy: { publishedAt: 'desc' },
      take: 12,
    });
  }

  return (
    <div className="max-w-[1220px] mx-auto px-4 sm:px-8 py-10 space-y-10 bg-white text-gray-900">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950">
          {query ? `Search Results for "${query}"` : 'Search Celebrity Birthdays'}
        </h1>
        <form method="GET" action="/search" className="pt-2 flex items-center max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search celebrity name, profession, or birthplace..."
              className="w-full pl-11 pr-4 py-3 rounded-l-full bg-[#f8f8fa] border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#ff1f5a]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#ff1f5a] text-white text-xs font-bold uppercase tracking-wider rounded-r-full hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>
      </div>

      {/* Matching Celebrity Profile Cards */}
      {matchingCelebrities.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-950">
            {query ? 'Matching Celebrities' : 'Popular Celebrities'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
            {matchingCelebrities.map((star) => {
              const age = Math.max(1, currentYear - star.birthYear);
              return (
                <Link
                  key={star.id}
                  href={`/people/${star.id}`}
                  className="group block bg-[#f8f8fa] rounded-[20px] p-2.5 border border-gray-200/70 hover:border-[#ff1f5a]/40 hover:shadow-md transition-all"
                >
                  <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-gray-100 mb-2.5">
                    <img
                      src={star.image}
                      alt={star.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="px-1 pb-0.5">
                    <h3 className="text-[15px] font-bold text-gray-950 leading-snug group-hover:text-[#ff1f5a] transition-colors truncate">
                      {star.name}, {age}
                    </h3>
                    <p className="text-[13px] text-gray-600 leading-tight mt-0.5 truncate">
                      {star.profession}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Matching Articles */}
      {articles.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-xl font-bold text-gray-950">
            Related Biography Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} layout="standard" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
