import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f1f1f4] border-t border-gray-200 text-gray-700">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <Link href="/" className="flex items-center select-none group">
          <span className="text-[22px] font-black tracking-[-0.05em] text-[#111111] leading-none">
            B<span className="text-[#ff1f5a]">i</span>rthday
          </span>
          <span className="ml-1.5 px-2 py-0.5 bg-[#ff1f5a] text-white text-[16px] font-black tracking-[-0.03em] lowercase leading-none rounded-md border-2 border-[#111111] shadow-[2px_2px_0px_#111111] -rotate-2 group-hover:rotate-0 transition-transform">
            aura
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-[#ff1f5a] transition-colors">
            Home
          </Link>
          <Link href="/blog" className="hover:text-[#ff1f5a] transition-colors">
            Blog
          </Link>
          <Link href="/category/todays-birthdays" className="hover:text-[#ff1f5a] transition-colors">
            Today&apos;s Birthdays
          </Link>
          <Link href="/category/creators-streamers" className="hover:text-[#f50076] transition-colors">
            Creators
          </Link>
          <Link href="/category/actors-cinema" className="hover:text-[#f50076] transition-colors">
            Actors
          </Link>
          <Link href="/about" className="hover:text-[#f50076] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#f50076] transition-colors">
            Contact
          </Link>
          <Link href="/privacy-policy" className="hover:text-[#f50076] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#f50076] transition-colors">
            Terms
          </Link>
        </div>

        <div className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Birthday Aura
        </div>
      </div>
    </footer>
  );
}
