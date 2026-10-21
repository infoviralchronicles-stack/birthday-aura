'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CELEBRITY_DIRECTORY,
  CelebrityProfile,
  getDailyPopularityScore,
  getTodayDateKey,
  getZodiacSign,
} from '@/lib/birthdayData';

type EnrichedStar = CelebrityProfile & {
  zodiac: string;
  age: number;
  rank: number;
};

export default function BirthdayExplorer() {
  const now = new Date();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  const currentYear = now.getFullYear();
  const todayKey = getTodayDateKey(now);

  const [dailyHits, setDailyHits] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`birthday_aura_daily_hits_${todayKey}`);
      if (raw) {
        setDailyHits(JSON.parse(raw));
      }
    } catch {
      // ignore storage errors
    }
  }, [todayKey]);

  const recordProfileClick = (id: string) => {
    try {
      const storageKey = `birthday_aura_daily_hits_${todayKey}`;
      const current = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const updated = { ...current, [id]: (current[id] || 0) + 1 };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setDailyHits(updated);
    } catch {
      // ignore storage errors
    }
  };

  const allStars = useMemo(() => {
    const list: EnrichedStar[] = CELEBRITY_DIRECTORY.map((c, idx) => ({
      ...c,
      zodiac: getZodiacSign(c.birthMonth, c.birthDay),
      age: Math.max(1, currentYear - c.birthYear),
      rank: idx + 1,
    }));
    return list;
  }, [currentYear]);

  const todayLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const todayMonthSlug = now
    .toLocaleDateString('en-US', { month: 'long' })
    .toLowerCase();
  const todaySlug = `${todayMonthSlug}-${todayDay}`;

  // Celebrities born today (strictly ONLY celebrities born on today's exact month & day, even if 1)
  const dateBirthdays = useMemo(() => {
    return allStars
      .filter((c) => c.birthMonth === todayMonth && c.birthDay === todayDay)
      .sort((a, b) => b.boosts - a.boosts)
      .slice(0, 10);
  }, [allStars, todayMonth, todayDay]);

  // Daily Most Popular (sorted by today's daily popularity score + live clicks, excluding Today's Birthdays)
  const popularStars = useMemo(() => {
    const todayIds = new Set(dateBirthdays.map((s) => s.id));
    return [...allStars]
      .filter((s) => !todayIds.has(s.id))
      .sort(
        (a, b) =>
          getDailyPopularityScore(b, now, dailyHits[b.id] || 0) -
          getDailyPopularityScore(a, now, dailyHits[a.id] || 0)
      )
      .slice(0, 10);
  }, [allStars, dateBirthdays, dailyHits, todayKey]);

  return (
    <div className="space-y-10 pt-4 pb-10">
      {/* =====================================================================
          1. TODAY'S BIRTHDAYS HEADING + 10 CELEBRITY PICTURES GRID (WITH FULL PROFILE URLS)
         ===================================================================== */}
      <section
        id="date-picker-section"
        className="rounded-[24px] bg-[#f8f8fa] border border-gray-200/80 p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              Today&apos;s Birthdays
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#ff1f5a]/10 text-[#ff1f5a] text-xs font-extrabold uppercase tracking-wider">
              {todayLabel}
            </span>
          </div>
          <Link
            href={`/birthdays/${todaySlug}`}
            className="text-sm font-bold text-[#ff1f5a] hover:underline"
          >
            See More &rarr;
          </Link>
        </div>

        {/* 10 Celebrities Picture Grid (2 rows x 5 columns on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
          {dateBirthdays.map((star) => (
            <Link
              key={star.id}
              href={`/people/${star.id}`}
              onClick={() => recordProfileClick(star.id)}
              className="group block cursor-pointer bg-white rounded-[20px] p-2.5 border border-gray-200/70 hover:border-[#ff1f5a]/40 hover:shadow-md transition-all"
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
                  {star.name}, {star.age}
                </h3>
                <p className="text-[13px] text-gray-600 leading-tight mt-0.5 truncate">
                  {star.profession}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-2 flex justify-center">
          <Link
            href={`/birthdays/${todaySlug}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-300 hover:border-[#ff1f5a] hover:text-[#ff1f5a] text-gray-900 text-sm font-extrabold shadow-sm transition-all"
          >
            Show More {todayLabel} Birthdays &rarr;
          </Link>
        </div>
      </section>

      {/* =====================================================================
          2. MOST POPULAR STARS ROW (DAILY TOP 10 TRENDING CELEBRITIES)
         ===================================================================== */}
      <section id="popular-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              Most Popular
            </h2>
            <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-[11px] font-extrabold uppercase tracking-wider">
              Top 10 Today
            </span>
          </div>
          <Link
            href="/profession/all"
            className="text-sm font-bold text-[#ff1f5a] hover:underline"
          >
            See All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
          {popularStars.map((star, index) => (
            <Link
              key={star.id}
              href={`/people/${star.id}`}
              onClick={() => recordProfileClick(star.id)}
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
                  {star.name}, {star.age}
                </h3>
                <p className="text-[13.5px] text-gray-700 leading-tight mt-0.5 truncate">
                  {star.profession}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
