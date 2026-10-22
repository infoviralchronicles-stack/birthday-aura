import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  CELEBRITY_DIRECTORY,
  MONTH_NAMES,
  BIRTHSTONES,
  ZODIAC_DETAILS,
  getZodiacSign,
} from '@/lib/birthdayData';
import { Star, Calendar, MapPin, Sparkles, ArrowLeft, Flame } from 'lucide-react';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return CELEBRITY_DIRECTORY.map((celeb) => ({
    id: celeb.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const celeb = CELEBRITY_DIRECTORY.find(
    (c) => c.id === params.id || c.slug === params.id
  );

  if (!celeb) {
    return {
      title: 'Celebrity Profile | Birthday Aura',
    };
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - celeb.birthYear);
  const monthName = MONTH_NAMES[celeb.birthMonth - 1];
  const canonicalUrl = `https://www.birthdayaura.com/people/${celeb.id}`;
  const imageUrl = celeb.image.startsWith('http')
    ? celeb.image
    : `https://www.birthdayaura.com${celeb.image}`;

  return {
    title: `${celeb.name} - Age, Family, Bio | Birthday Aura`,
    description: `${celeb.name} (${celeb.profession}) was born on ${monthName} ${celeb.birthDay}, ${celeb.birthYear} in ${celeb.birthplace} (${age} years old). Discover ${celeb.name}'s biography, Before Fame, Trivia, and Family Life.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${celeb.name} - Age, Family, Bio | Birthday Aura`,
      description: `${celeb.name} (${celeb.profession}) was born on ${monthName} ${celeb.birthDay}, ${celeb.birthYear} in ${celeb.birthplace}.`,
      url: canonicalUrl,
      siteName: 'Birthday Aura',
      images: [
        {
          url: imageUrl,
          width: 600,
          height: 600,
          alt: celeb.name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${celeb.name} | Birthday Aura`,
      description: `${celeb.name} - ${celeb.profession} born on ${monthName} ${celeb.birthDay}, ${celeb.birthYear}.`,
      images: [imageUrl],
    },
  };
}

export default function CelebrityProfilePage({ params }: Props) {
  const celeb = CELEBRITY_DIRECTORY.find(
    (c) => c.id === params.id || c.slug === params.id
  );

  if (!celeb) {
    notFound();
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - celeb.birthYear);
  const monthName = MONTH_NAMES[celeb.birthMonth - 1];
  const zodiac = getZodiacSign(celeb.birthMonth, celeb.birthDay);
  const zodiacInfo = ZODIAC_DETAILS[zodiac];
  const birthstone = BIRTHSTONES[celeb.birthMonth] || 'Opal';

  const popularityRank =
    [...CELEBRITY_DIRECTORY]
      .sort((a, b) => b.boosts - a.boosts)
      .findIndex((c) => c.id === celeb.id) + 1;

  // Related celebrities (same birthday first, then same category)
  const relatedCelebrities = CELEBRITY_DIRECTORY.filter(
    (c) =>
      c.id !== celeb.id &&
      ((c.birthMonth === celeb.birthMonth && c.birthDay === celeb.birthDay) ||
        c.category === celeb.category)
  ).slice(0, 5);

  const morePopularCelebrities = CELEBRITY_DIRECTORY.filter(
    (c) =>
      c.id !== celeb.id && !relatedCelebrities.some((rel) => rel.id === c.id)
  ).slice(0, 5);

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-16">
      {/* Schema.org Person Structured Data for Rapid Google Knowledge Graph & Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: celeb.name,
            jobTitle: celeb.profession,
            birthDate: `${celeb.birthYear}-${String(celeb.birthMonth).padStart(2, '0')}-${String(celeb.birthDay).padStart(2, '0')}`,
            birthPlace: {
              '@type': 'Place',
              name: celeb.birthplace,
            },
            image: celeb.image.startsWith('http')
              ? celeb.image
              : `https://www.birthdayaura.com${celeb.image}`,
            description: celeb.about,
            url: `https://www.birthdayaura.com/people/${celeb.id}`,
          }),
        }}
      />
      <div className="max-w-[1220px] mx-auto px-4 sm:px-8 pt-6 space-y-10">
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-bold text-gray-800 hover:text-[#ff1f5a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/profession/${celeb.category.toLowerCase()}`}
              className="font-semibold text-gray-700 hover:text-[#ff1f5a] hover:underline transition-colors"
            >
              {celeb.category}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#ff1f5a]">{celeb.name}</span>
          </div>

          <div className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ffe4f2] text-[#f50076]">
            Popularity #{popularityRank}
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Portrait + Clean Birthday Facts (No Box Style) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-gray-100">
              <img
                src={celeb.image}
                alt={celeb.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                {celeb.name}
              </h1>
              <Link
                href={`/profession/${celeb.profession.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="inline-block text-base font-bold text-[#ff1f5a] hover:underline mt-0.5"
              >
                {celeb.profession}
              </Link>
            </div>

            {/* Quick Facts List (Clean Open Text — No Boxes) */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-2 border-t border-gray-200/70">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Birthday
                </span>
                <Link
                  href={`/birthdays/${monthName.toLowerCase()}-${celeb.birthDay}`}
                  className="text-[15px] font-extrabold text-gray-950 hover:text-[#ff1f5a] hover:underline transition-colors"
                >
                  {monthName} {celeb.birthDay}, {celeb.birthYear}
                </Link>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Birth Sign
                </span>
                <span className="text-[15px] font-extrabold text-[#ff1f5a]">
                  {zodiacInfo?.symbol} {zodiac}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Birthplace
                </span>
                <span className="text-[15px] font-extrabold text-gray-950">
                  {celeb.birthplace}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                  Age
                </span>
                <span className="text-[15px] font-extrabold text-gray-950">
                  {age} years old
                </span>
              </div>
            </div>

            {/* Popularity & Boost Stats (Clean Open Row) */}
            <div className="pt-4 border-t border-gray-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-[#ff1f5a]" />
                <div>
                  <span className="text-xs font-bold uppercase text-gray-400 mr-2">
                    Total Boosts:
                  </span>
                  <span className="text-base font-black text-gray-950">
                    {celeb.boosts.toLocaleString()}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#ff1f5a]">
                #{popularityRank} Trending
              </span>
            </div>
          </div>

          {/* Right Column: Full Biography Sections (Clean Open Text — No Box Style) */}
          <div className="lg:col-span-8 space-y-8 pt-1">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-950 mb-2">
                About
              </h2>
              <p className="text-base sm:text-[17px] text-gray-800 leading-relaxed">
                {celeb.about}
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-950 mb-2">
                Before Fame
              </h2>
              <p className="text-base sm:text-[17px] text-gray-800 leading-relaxed">
                {celeb.beforeFame}
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-950 mb-2">
                Trivia
              </h2>
              <p className="text-base sm:text-[17px] text-gray-800 leading-relaxed">
                {celeb.trivia}
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-950 mb-2">
                Family Life
              </h2>
              <p className="text-base sm:text-[17px] text-gray-800 leading-relaxed">
                {celeb.familyLife}
              </p>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-950 mb-2">
                Associated With
              </h2>
              <p className="text-base sm:text-[17px] text-gray-800 leading-relaxed">
                {celeb.associatedWith}
              </p>
            </div>

            {/* Birthday Aura & Zodiac Insights (Clean Open Text — No Boxes) */}
            <div className="pt-6 border-t border-gray-200/70">
              <h3 className="text-lg sm:text-xl font-black text-gray-950 mb-4">
                {celeb.name}&apos;s Birthday Aura &amp; Astrology
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                    Zodiac Sign
                  </span>
                  <span className="text-base font-black text-gray-950">
                    {zodiacInfo?.symbol} {zodiac} ({zodiacInfo?.dates})
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                    Element &amp; Aura
                  </span>
                  <span className="text-base font-black text-[#ff1f5a]">
                    {zodiacInfo?.element} • {zodiacInfo?.aura}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                    Birthstone
                  </span>
                  <span className="text-base font-black text-gray-950">
                    {birthstone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Celebrities Section (Clickable URLs) */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
            Fans Also Viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
            {[...relatedCelebrities, ...morePopularCelebrities]
              .slice(0, 5)
              .map((star) => {
                const starAge = Math.max(1, currentYear - star.birthYear);
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
                        {star.name}, {starAge}
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
      </div>
    </div>
  );
}
