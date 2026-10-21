import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Zap, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Birthday Aura — The Celebrity Profile & Birthday Directory',
  description:
    'Learn how Birthday Aura curates daily celebrity birthdays, popularity rankings, and verified biographies.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-10 bg-white text-gray-900">
      <div className="rounded-[24px] bg-[#f8f8fa] border border-gray-200/80 p-8 sm:p-12">
        <span className="inline-block px-3 py-1 rounded-full bg-[#ffe4f2] text-[#ff1f5a] text-xs font-bold uppercase tracking-wider mb-4">
          About Birthday Aura
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 leading-tight mb-4">
          The Modern Celebrity Birthday &amp; Biography Encyclopedia
        </h1>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
          <strong>Birthday Aura</strong> is an interactive celebrity and creator directory where fans explore daily birthdays, discover celebrity ages and zodiac signs, and read complete biographies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[20px] bg-[#f8f8fa] border border-gray-200/80 space-y-3">
          <Calendar className="w-7 h-7 text-[#ff1f5a]" />
          <h3 className="text-lg font-bold text-gray-950">
            Daily Birthday Spotlights
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Explore Today&apos;s Birthdays to discover actors, creators, musicians, and athletes celebrating their birthday today.
          </p>
        </div>

        <div className="p-6 rounded-[20px] bg-[#f8f8fa] border border-gray-200/80 space-y-3">
          <Zap className="w-7 h-7 text-[#ff1f5a]" />
          <h3 className="text-lg font-bold text-gray-950">
            Popularity Rankings
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every profile is ranked based on fan engagement and trending searches across entertainment and sports.
          </p>
        </div>

        <div className="p-6 rounded-[20px] bg-[#f8f8fa] border border-gray-200/80 space-y-3">
          <Star className="w-7 h-7 text-[#ff1f5a]" />
          <h3 className="text-lg font-bold text-gray-950">
            Complete Biographies
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every biography breaks down <em>About</em>, <em>Before Fame</em>, <em>Trivia</em>, <em>Family Life</em>, <em>Associated With</em>, Birthstone, and Zodiac Aura.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-[20px] bg-[#f8f8fa] border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-950 mb-1">
            Explore Today&apos;s Birthdays
          </h2>
          <p className="text-sm text-gray-600">
            Check out the top celebrity birthdays and most popular profiles on our homepage.
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-[#ff1f5a] text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:opacity-90 transition-opacity"
        >
          Back to Home &rarr;
        </Link>
      </div>
    </div>
  );
}
