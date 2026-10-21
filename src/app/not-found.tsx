import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Cake, Home, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Birthday Aura',
  description: 'The requested celebrity profile or page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ff1f5a]/10 flex items-center justify-center text-[#ff1f5a]">
          <Cake className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest uppercase text-[#ff1f5a]">
            404 Error
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            The page or celebrity profile you are looking for does not exist or has been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ff1f5a] text-white text-sm font-bold shadow-sm hover:bg-[#e0144c] transition-colors"
          >
            <Home className="w-4 h-4" />
            Today&apos;s Birthdays
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-800 text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Celebrities
          </Link>
        </div>
      </div>
    </div>
  );
}
