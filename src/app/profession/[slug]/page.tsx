import Link from 'next/link';
import type { Metadata } from 'next';
import { CELEBRITY_DIRECTORY } from '@/lib/birthdayData';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: { slug: string };
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const MAIN_CATEGORIES = [
  { label: 'All Celebrities', slug: 'all' },
  { label: 'Actors', slug: 'actors' },
  { label: 'Musicians', slug: 'musicians' },
  { label: 'Creators', slug: 'creators' },
  { label: 'Athletes', slug: 'athletes' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const rawSlug = decodeURIComponent(params.slug).toLowerCase();
  const label =
    rawSlug === 'all'
      ? 'All Celebrities'
      : rawSlug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

  return {
    title: `${label} — Celebrity Profiles & Birthdays | Birthday Aura`,
    description: `Browse ${label} celebrity profiles, birthdays, ages, and biographies on Birthday Aura.`,
  };
}

export default function ProfessionDirectoryPage({ params }: Props) {
  const rawSlug = decodeURIComponent(params.slug).toLowerCase();
  const currentYear = new Date().getFullYear();

  // Match either category (e.g. 'actors', 'musicians', 'creators', 'athletes') or specific profession (e.g. 'movie-actor')
  const matchedCelebrities =
    rawSlug === 'all'
      ? CELEBRITY_DIRECTORY
      : CELEBRITY_DIRECTORY.filter(
          (c) =>
            toSlug(c.category) === rawSlug ||
            toSlug(c.profession) === rawSlug ||
            c.category.toLowerCase().includes(rawSlug) ||
            c.profession.toLowerCase().includes(rawSlug.replace(/-/g, ' '))
        );

  const displayCelebrities =
    matchedCelebrities.length > 0 ? matchedCelebrities : CELEBRITY_DIRECTORY;

  const otherCelebrities = CELEBRITY_DIRECTORY.filter(
    (c) => !displayCelebrities.some((m) => m.id === c.id)
  );

  // Unique professions for quick pills
  const uniqueProfessions = Array.from(
    new Set(CELEBRITY_DIRECTORY.map((c) => c.profession))
  );

  const activeTitle =
    rawSlug === 'all'
      ? 'All Celebrities'
      : matchedCelebrities.length > 0
      ? toSlug(matchedCelebrities[0].category) === rawSlug
        ? matchedCelebrities[0].category
        : matchedCelebrities[0].profession + 's'
      : 'All Celebrities';

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-16">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 border-b border-gray-100 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-gray-800 hover:text-[#ff1f5a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span>/</span>
          <Link
            href="/profession/all"
            className="hover:text-[#ff1f5a] transition-colors font-medium"
          >
            Celebrities
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#ff1f5a]">{activeTitle}</span>
        </div>

        {/* Header & Category Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                {activeTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Showing {displayCelebrities.length} celebrity profiles in {activeTitle}
              </p>
            </div>
          </div>

          {/* Main Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {MAIN_CATEGORIES.map((cat) => {
              const isActive = rawSlug === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/profession/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-[#ff1f5a] text-white'
                      : 'bg-[#f1f1f4] text-gray-800 hover:bg-[#ffe4f2] hover:text-[#ff1f5a]'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Specific Profession Sub-Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {uniqueProfessions.map((prof) => {
              const profSlug = toSlug(prof);
              const isActive = rawSlug === profSlug;
              return (
                <Link
                  key={prof}
                  href={`/profession/${profSlug}`}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-[#f8f8fa] border border-gray-200 text-gray-600 hover:border-[#ff1f5a] hover:text-[#ff1f5a]'
                  }`}
                >
                  {prof}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Matched Celebrities Grid */}
        <section className="rounded-[24px] bg-[#f8f8fa] border border-gray-200/80 p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
            {displayCelebrities.map((star) => {
              const age = Math.max(1, currentYear - star.birthYear);
              return (
                <Link
                  key={star.id}
                  href={`/people/${star.id}`}
                  className="group block bg-white rounded-[20px] p-2.5 border border-gray-200/70 hover:border-[#ff1f5a]/40 hover:shadow-md transition-all"
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

        {/* All Other Celebrities Section (So the user can browse all celebrities on the same page too) */}
        {otherCelebrities.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
                More Celebrities Across All Categories
              </h2>
              <Link
                href="/profession/all"
                className="text-sm font-bold text-[#ff1f5a] hover:underline"
              >
                View All ({CELEBRITY_DIRECTORY.length}) &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
              {otherCelebrities.map((star) => {
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
      </div>
    </div>
  );
}
