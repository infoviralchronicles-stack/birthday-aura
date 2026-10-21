import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  CELEBRITY_DIRECTORY,
  DAYS_IN_MONTH,
  MONTH_NAMES,
  getZodiacSign,
} from '@/lib/birthdayData';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface PageProps {
  params: { date: string };
}

function parseDateSlug(slug: string): { month: number; day: number } {
  const now = new Date();
  const clean = decodeURIComponent(slug).toLowerCase().trim();
  if (clean === 'today') {
    return { month: now.getMonth() + 1, day: now.getDate() };
  }
  const parts = clean.split('-');
  if (parts.length >= 2) {
    const mIdx = MONTH_NAMES.findIndex((m) => m.toLowerCase() === parts[0]);
    const dayNum = parseInt(parts[1], 10);
    if (mIdx !== -1 && !isNaN(dayNum) && dayNum >= 1 && dayNum <= 31) {
      return { month: mIdx + 1, day: dayNum };
    }
  }
  return { month: now.getMonth() + 1, day: now.getDate() };
}

function getAdjacentDateSlug(month: number, day: number, offset: -1 | 1): { slug: string; label: string } {
  let m = month;
  let d = day + offset;
  if (d < 1) {
    m = m === 1 ? 12 : m - 1;
    d = DAYS_IN_MONTH[m - 1];
  } else if (d > DAYS_IN_MONTH[m - 1]) {
    d = 1;
    m = m === 12 ? 1 : m + 1;
  }
  const mName = MONTH_NAMES[m - 1];
  return {
    slug: `${mName.toLowerCase()}-${d}`,
    label: `${mName} ${d}`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { month, day } = parseDateSlug(params.date);
  const monthName = MONTH_NAMES[month - 1];
  return {
    title: `${monthName} ${day} Birthdays — Celebrity Directory | Birthday Aura`,
    description: `Explore all celebrities, actors, musicians, creators, and athletes born on ${monthName} ${day} on Birthday Aura.`,
  };
}

export default function DateBirthdaysPage({ params }: PageProps) {
  const { month, day } = parseDateSlug(params.date);
  const monthName = MONTH_NAMES[month - 1];
  const currentYear = new Date().getFullYear();
  const zodiac = getZodiacSign(month, day);

  const prevDate = getAdjacentDateSlug(month, day, -1);
  const nextDate = getAdjacentDateSlug(month, day, 1);

  const exactCelebrities = CELEBRITY_DIRECTORY.filter(
    (c) => c.birthMonth === month && c.birthDay === day
  ).sort((a, b) => b.boosts - a.boosts);

  const exactIds = new Set(exactCelebrities.map((c) => c.id));
  const sameMonthCelebrities = CELEBRITY_DIRECTORY.filter(
    (c) => c.birthMonth === month && !exactIds.has(c.id)
  ).sort((a, b) => b.boosts - a.boosts);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Top Navigation Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-gray-700 hover:text-[#ff1f5a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#ff1f5a]">
              {monthName} {day} Birthdays
            </span>
          </div>

          {/* Previous / Next Day Switcher */}
          <div className="flex items-center gap-2">
            <Link
              href={`/birthdays/${prevDate.slug}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-[#ff1f5a] hover:text-white text-gray-800 text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {prevDate.label}
            </Link>
            <Link
              href={`/birthdays/${nextDate.slug}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-[#ff1f5a] hover:text-white text-gray-800 text-xs font-bold transition-colors"
            >
              {nextDate.label}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Page Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff1f5a]/10 text-[#ff1f5a] text-xs font-extrabold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            {zodiac} Birth Sign
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            {monthName} {day} Birthdays
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Showing {exactCelebrities.length} verified celebrity profiles born on {monthName} {day}. Click any celebrity to open their full biography.
          </p>
        </div>

        {/* All Celebrities Born on This Date */}
        {exactCelebrities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
            {exactCelebrities.map((star, index) => {
              const age = Math.max(1, currentYear - star.birthYear);
              return (
                <Link
                  key={star.id}
                  href={`/people/${star.id}`}
                  className="group block cursor-pointer"
                >
                  <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={star.image}
                      alt={star.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-gray-950/80 backdrop-blur-sm text-white text-[11px] font-extrabold tracking-tight">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="px-0.5">
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
        ) : (
          <p className="text-gray-500 text-sm">
            More {monthName} {day} profiles are being added daily. Explore more {monthName} birthdays below!
          </p>
        )}

        {/* More Birthdays in This Month */}
        {sameMonthCelebrities.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-gray-200/80">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              More {monthName} Birthdays
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
              {sameMonthCelebrities.map((star) => {
                const age = Math.max(1, currentYear - star.birthYear);
                return (
                  <Link
                    key={star.id}
                    href={`/people/${star.id}`}
                    className="group block cursor-pointer"
                  >
                    <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-gray-100 mb-2">
                      <img
                        src={star.image}
                        alt={star.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="px-0.5">
                      <h3 className="text-[15px] font-bold text-gray-950 leading-snug group-hover:text-[#ff1f5a] transition-colors truncate">
                        {star.name}, {age}
                      </h3>
                      <p className="text-[13px] text-gray-600 leading-tight mt-0.5 truncate">
                        {star.profession} • {monthName} {star.birthDay}
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
