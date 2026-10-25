import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CELEBRITY_DIRECTORY, MONTH_NAMES, getZodiacSign } from '@/lib/birthdayData';
import ArticleCard from '@/components/magazine/ArticleCard';
import { Search, Calendar, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Celebrity Birthdays & Profiles | Birthday Aura',
  description: 'Search celebrity birthdays, dates, ages, zodiac signs, and biographies on Birthday Aura.',
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

interface ParsedDateResult {
  type: 'exact-date' | 'month-only' | 'zodiac';
  month?: number;
  day?: number;
  monthName?: string;
  zodiacSign?: string;
  label: string;
  dateSlug?: string;
}

const MONTH_MAP: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

const ZODIAC_LIST = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

function parseDateQuery(input: string): ParsedDateResult | null {
  if (!input) return null;
  const raw = input.toLowerCase().trim();

  // Strip common filler words
  const clean = raw
    .replace(/\b(birthdays?|born|on|in|of|celebrities|stars?|who was|who is)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Relative dates
  const now = new Date();
  if (clean === 'today') {
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const mName = MONTH_NAMES[m - 1];
    return {
      type: 'exact-date',
      month: m,
      day: d,
      monthName: mName,
      label: `${mName} ${d}`,
      dateSlug: `${mName.toLowerCase()}-${d}`,
    };
  }
  if (clean === 'tomorrow') {
    const tm = new Date(now.getTime() + 86400000);
    const m = tm.getMonth() + 1;
    const d = tm.getDate();
    const mName = MONTH_NAMES[m - 1];
    return {
      type: 'exact-date',
      month: m,
      day: d,
      monthName: mName,
      label: `${mName} ${d}`,
      dateSlug: `${mName.toLowerCase()}-${d}`,
    };
  }
  if (clean === 'yesterday') {
    const yest = new Date(now.getTime() - 86400000);
    const m = yest.getMonth() + 1;
    const d = yest.getDate();
    const mName = MONTH_NAMES[m - 1];
    return {
      type: 'exact-date',
      month: m,
      day: d,
      monthName: mName,
      label: `${mName} ${d}`,
      dateSlug: `${mName.toLowerCase()}-${d}`,
    };
  }

  // 2. Zodiac check
  for (const z of ZODIAC_LIST) {
    if (clean === z || clean === `${z}s` || clean.includes(`${z} zodiac`) || clean.includes(`${z} sign`)) {
      const proper = z.charAt(0).toUpperCase() + z.slice(1);
      return {
        type: 'zodiac',
        zodiacSign: proper,
        label: `${proper} Zodiac`,
      };
    }
  }

  // 3. Month + Day (e.g. 'October 24', 'Oct 24th', '24 October', '24th oct')
  const normalized = clean
    .replace(/(\d+)(st|nd|rd|th)\b/gi, (_m, p1) => p1)
    .replace(/[,\.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = normalized.split(' ').filter(Boolean);
  let foundMonth: number | null = null;
  let foundDay: number | null = null;

  for (const tok of tokens) {
    if (MONTH_MAP[tok]) {
      foundMonth = MONTH_MAP[tok];
    } else if (/^\d{1,2}$/.test(tok)) {
      const num = parseInt(tok, 10);
      if (num >= 1 && num <= 31 && !foundDay) {
        foundDay = num;
      }
    }
  }

  if (foundMonth && foundDay) {
    const mName = MONTH_NAMES[foundMonth - 1];
    return {
      type: 'exact-date',
      month: foundMonth,
      day: foundDay,
      monthName: mName,
      label: `${mName} ${foundDay}`,
      dateSlug: `${mName.toLowerCase()}-${foundDay}`,
    };
  }

  // If only month is entered (e.g. 'October', 'Oct')
  if (foundMonth && !foundDay && tokens.length <= 2) {
    const mName = MONTH_NAMES[foundMonth - 1];
    return {
      type: 'month-only',
      month: foundMonth,
      monthName: mName,
      label: `${mName} Birthdays`,
    };
  }

  // 4. Numeric formats: MM/DD, MM-DD, YYYY-MM-DD, DD/MM
  const numDateMatch = clean.match(/^(\d{1,4})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{1,4}))?$/);
  if (numDateMatch) {
    const p1 = parseInt(numDateMatch[1], 10);
    const p2 = parseInt(numDateMatch[2], 10);
    const p3 = numDateMatch[3] ? parseInt(numDateMatch[3], 10) : null;

    let m: number | null = null;
    let d: number | null = null;

    if (p1 > 31 && p2 <= 12 && p3 && p3 <= 31) {
      // YYYY-MM-DD
      m = p2;
      d = p3;
    } else if (p3 && p3 > 31) {
      // MM/DD/YYYY or DD/MM/YYYY
      if (p1 > 12 && p2 <= 12) {
        d = p1;
        m = p2;
      } else {
        m = p1;
        d = p2;
      }
    } else if (!p3) {
      // MM/DD or DD/MM
      if (p1 > 12 && p2 <= 12) {
        d = p1;
        m = p2;
      } else if (p2 > 12 && p1 <= 12) {
        m = p1;
        d = p2;
      } else if (p1 <= 12 && p2 <= 31) {
        m = p1;
        d = p2;
      }
    }

    if (m && d && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      const mName = MONTH_NAMES[m - 1];
      return {
        type: 'exact-date',
        month: m,
        day: d,
        monthName: mName,
        label: `${mName} ${d}`,
        dateSlug: `${mName.toLowerCase()}-${d}`,
      };
    }
  }

  return null;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || '').trim();
  const qLower = query.toLowerCase();
  const currentYear = new Date().getFullYear();

  const parsedDate = query ? parseDateQuery(query) : null;

  let matchingCelebrities: typeof CELEBRITY_DIRECTORY = [];

  if (parsedDate) {
    if (parsedDate.type === 'exact-date' && parsedDate.month && parsedDate.day) {
      matchingCelebrities = CELEBRITY_DIRECTORY.filter(
        (c) => c.birthMonth === parsedDate.month && c.birthDay === parsedDate.day
      );
    } else if (parsedDate.type === 'month-only' && parsedDate.month) {
      matchingCelebrities = CELEBRITY_DIRECTORY.filter(
        (c) => c.birthMonth === parsedDate.month
      ).sort((a, b) => a.birthDay - b.birthDay);
    } else if (parsedDate.type === 'zodiac' && parsedDate.zodiacSign) {
      const targetSign = parsedDate.zodiacSign.toLowerCase();
      matchingCelebrities = CELEBRITY_DIRECTORY.filter(
        (c) => getZodiacSign(c.birthMonth, c.birthDay).toLowerCase() === targetSign
      );
    }
  } else if (query) {
    matchingCelebrities = CELEBRITY_DIRECTORY.filter(
      (c) =>
        c.name.toLowerCase().includes(qLower) ||
        c.profession.toLowerCase().includes(qLower) ||
        c.birthplace.toLowerCase().includes(qLower) ||
        c.category.toLowerCase().includes(qLower)
    );
  } else {
    matchingCelebrities = CELEBRITY_DIRECTORY.slice(0, 10);
  }

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
          {parsedDate
            ? `Celebrities Born on ${parsedDate.label}`
            : query
            ? `Search Results for "${query}"`
            : 'Search Celebrity Birthdays & Dates'}
        </h1>
        <p className="text-sm text-gray-500">
          Search any celebrity name, exact birthday (e.g. &quot;Oct 24&quot;, &quot;10/24&quot;), month, or zodiac sign.
        </p>
        <form method="GET" action="/search" className="pt-2 flex items-center max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search celebrity name, birth date (e.g. Oct 24, 10/24), profession..."
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

      {/* Date Hub Banner when an exact date or month is searched */}
      {parsedDate && (
        <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-rose-50 border border-pink-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff1f5a] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                {parsedDate.type === 'exact-date' ? 'Date Match' : parsedDate.type === 'zodiac' ? 'Zodiac Match' : 'Month Match'}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                {matchingCelebrities.length} {matchingCelebrities.length === 1 ? 'Profile' : 'Profiles'} Found
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950">
              {parsedDate.label}
            </h2>
            <p className="text-sm text-gray-600">
              {parsedDate.type === 'exact-date'
                ? `Explore famous people, creators, and icons born on ${parsedDate.label}.`
                : parsedDate.type === 'zodiac'
                ? `Explore celebrities who share the ${parsedDate.label} sign.`
                : `Explore celebrities and famous icons born during the month of ${parsedDate.monthName}.`}
            </p>
          </div>

          {parsedDate.dateSlug && (
            <Link
              href={`/birthdays/${parsedDate.dateSlug}`}
              className="px-5 py-2.5 bg-gray-950 hover:bg-[#ff1f5a] text-white text-sm font-bold rounded-full transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow"
            >
              <span>View Full {parsedDate.label} Hub</span>
              <span>→</span>
            </Link>
          )}
        </div>
      )}

      {/* Matching Celebrity Profile Cards */}
      {matchingCelebrities.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-950">
              {parsedDate
                ? `Celebrities (${matchingCelebrities.length})`
                : query
                ? `Matching Celebrities (${matchingCelebrities.length})`
                : 'Popular Celebrities'}
            </h2>
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
      ) : query ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-gray-50 border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">
            No celebrity profiles found for &quot;{query}&quot;
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
            Try searching by celebrity name, month (e.g. &quot;October&quot;), or full date format (e.g. &quot;October 24&quot; or &quot;10/24&quot;).
          </p>
        </div>
      ) : null}

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
