import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CELEBRITY_DIRECTORY, MONTH_NAMES, CelebrityProfile } from '@/lib/birthdayData';
import ArticleCard from '@/components/magazine/ArticleCard';
import AdBanner from '@/components/layout/AdBanner';
import { Calendar, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: 'Category Not Found | Birthday Aura' };
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const todayMonthName = MONTH_NAMES[currentMonth - 1];

  const title =
    params.slug === 'todays-birthdays'
      ? `Today's Celebrity Birthdays (${todayMonthName} ${currentDay}) | Birthday Aura`
      : category.metaTitle || `${category.name} | Birthday Aura`;

  const description =
    params.slug === 'todays-birthdays'
      ? `Discover famous celebrities, actors, singers, and creators celebrating their birthdays today on ${todayMonthName} ${currentDay}.`
      : category.metaDescription || category.description || `Read the latest ${category.name} reports on Birthday Aura.`;

  return {
    title,
    description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();
  const todayMonthName = MONTH_NAMES[currentMonth - 1];

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Determine relevant celebrities from CELEBRITY_DIRECTORY based on category slug
  let matchingCelebrities: CelebrityProfile[] = [];
  let isToday = false;

  if (params.slug === 'todays-birthdays') {
    isToday = true;
    matchingCelebrities = CELEBRITY_DIRECTORY.filter(
      (c) => c.birthMonth === currentMonth && c.birthDay === currentDay
    ).sort((a, b) => b.boosts - a.boosts);

    if (matchingCelebrities.length === 0) {
      matchingCelebrities = CELEBRITY_DIRECTORY.filter(
        (c) => c.birthMonth === currentMonth
      ).sort((a, b) => b.boosts - a.boosts).slice(0, 10);
    }
  } else if (params.slug === 'creators-streamers') {
    matchingCelebrities = CELEBRITY_DIRECTORY.filter(
      (c) => c.category === 'Creators'
    ).sort((a, b) => b.boosts - a.boosts).slice(0, 10);
  } else if (params.slug === 'actors-cinema') {
    matchingCelebrities = CELEBRITY_DIRECTORY.filter(
      (c) => c.category === 'Actors'
    ).sort((a, b) => b.boosts - a.boosts).slice(0, 10);
  } else if (params.slug === 'music-icons') {
    matchingCelebrities = CELEBRITY_DIRECTORY.filter(
      (c) => c.category === 'Musicians'
    ).sort((a, b) => b.boosts - a.boosts).slice(0, 10);
  }

  const categoryDescription = isToday
    ? `Daily celebrity birthday spotlights, ${todayMonthName} ${currentDay} icons, age milestones, and verified biographies.`
    : category.description;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12 bg-white text-gray-900">
      {/* Category Hero Banner */}
      <header className="py-8 border-b border-gray-200 text-center max-w-3xl mx-auto space-y-4">
        <span
          className="inline-block px-3.5 py-1 rounded-full text-xs uppercase font-mono tracking-widest font-bold text-white shadow-sm"
          style={{ backgroundColor: category.color || '#ff1f5a' }}
        >
          {isToday ? `${todayMonthName} ${currentDay}` : 'Dossier Collection'}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950">
          {category.name}
        </h1>
        {categoryDescription && (
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        )}

        {isToday && (
          <div className="pt-2">
            <Link
              href="/birthdays/today"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff1f5a] hover:bg-black text-white text-sm font-bold rounded-full transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Today&apos;s Full Birthday Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </header>

      {/* Featured Celebrities Grid */}
      {matchingCelebrities.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              {isToday
                ? `Famous People Born Today (${todayMonthName} ${currentDay})`
                : `Featured ${category.name} Profiles`}
            </h2>
            {isToday && (
              <span className="text-xs font-semibold text-gray-500">
                {matchingCelebrities.length} {matchingCelebrities.length === 1 ? 'Profile' : 'Profiles'} Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
            {matchingCelebrities.map((star) => {
              const age = Math.max(1, currentYear - star.birthYear);
              const starDate = `${MONTH_NAMES[star.birthMonth - 1]} ${star.birthDay}`;
              return (
                <Link
                  key={star.id}
                  href={`/people/${star.id}`}
                  className="group block bg-[#f8f8fa] rounded-[20px] p-2.5 border border-gray-200/70 hover:border-[#ff1f5a]/40 hover:shadow-md transition-all"
                >
                  <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-gray-100 mb-2.5 relative">
                    <img
                      src={star.image}
                      alt={star.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white">
                      {starDate}
                    </div>
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

      {/* Articles Grid */}
      {category.articles.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
            {isToday ? 'Related Birthday Articles & Deep Dives' : 'Articles & Biographies'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.articles.map((art) => (
              <ArticleCard key={art.id} article={art} layout="standard" />
            ))}
          </div>
        </section>
      )}

      {/* Bottom Ad Placement */}
      <AdBanner slot="445566778" format="banner" />
    </div>
  );
}
