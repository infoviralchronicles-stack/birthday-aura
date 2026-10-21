'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Star, TrendingUp, BookOpen, HelpCircle, Calendar } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full bg-[#f1f1f4] border-b border-gray-200/80 sticky top-0 z-50">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4 sm:gap-8">
        {/* Left: Clean Studio-Designed Typographic Logo (No AI gradients/sparkles) */}
        <Link href="/" className="flex items-center select-none flex-shrink-0 group">
          <span className="text-[24px] sm:text-[27px] font-black tracking-[-0.05em] text-[#111111] leading-none">
            B<span className="text-[#ff1f5a]">i</span>rthday
          </span>
          <span className="ml-1.5 px-2 py-0.5 bg-[#ff1f5a] text-white text-[18px] sm:text-[20px] font-black tracking-[-0.03em] lowercase leading-none rounded-md border-2 border-[#111111] shadow-[2px_2px_0px_#111111] -rotate-2 group-hover:rotate-0 transition-transform">
            aura
          </span>
        </Link>

        {/* Center: Large Clean White Pill Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-[680px] bg-white rounded-full h-11 sm:h-12 px-4 sm:px-5 flex items-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-gray-200/60 focus-within:border-pink-400 transition-colors"
        >
          <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-base sm:text-lg text-gray-900 placeholder-gray-700 focus:outline-none"
          />
        </form>

        {/* Right: Minimal Stacked Icon + Label Navigation */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-gray-900 flex-shrink-0">
          <Link
            href="/#popular-section"
            className="flex flex-col items-center group hover:text-[#ff1f5a] transition-colors"
          >
            <Star className="w-6 h-6 stroke-[1.75] mb-0.5" />
            <span className="text-[11px] font-medium lowercase tracking-tight">popular</span>
          </Link>

          <Link
            href="/#trending-section"
            className="flex flex-col items-center group hover:text-[#ff1f5a] transition-colors"
          >
            <TrendingUp className="w-6 h-6 stroke-[1.75] mb-0.5" />
            <span className="text-[11px] font-medium lowercase tracking-tight">trending</span>
          </Link>

          <Link
            href="/#date-picker-section"
            className="flex flex-col items-center group hover:text-[#ff1f5a] transition-colors"
          >
            <Calendar className="w-6 h-6 stroke-[1.75] mb-0.5" />
            <span className="text-[11px] font-medium lowercase tracking-tight">calendar</span>
          </Link>

          <Link
            href="/blog"
            className="flex flex-col items-center group hover:text-[#ff1f5a] transition-colors"
          >
            <BookOpen className="w-6 h-6 stroke-[1.75] mb-0.5" />
            <span className="text-[11px] font-medium lowercase tracking-tight">blog</span>
          </Link>

          <Link
            href="/about"
            className="flex flex-col items-center group hover:text-[#ff1f5a] transition-colors"
          >
            <HelpCircle className="w-6 h-6 stroke-[1.75] mb-0.5" />
            <span className="text-[11px] font-medium lowercase tracking-tight">trivia</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
