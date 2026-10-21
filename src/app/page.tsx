import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BirthdayExplorer from '@/components/birthday/BirthdayExplorer';

export const revalidate = 60;

export default async function HomePage() {
  const now = new Date();

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: now },
    },
    include: { category: true, author: true },
    orderBy: { publishedAt: 'desc' },
    take: 8,
  });

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-8 py-4 space-y-12 bg-white">
      {/* Main Simple FamousBirthdays Grid + Date/Month Picker + Inline Profile */}
      <BirthdayExplorer />

      {/* Clean Trending Biographies & Articles Section */}
      {articles.length > 0 && (
        <section id="trending-section" className="pt-6 border-t border-gray-200/80 space-y-5 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              Latest Blog &amp; Celebrity Stories
            </h2>
            <Link
              href="/blog"
              className="text-sm font-bold text-[#ff1f5a] hover:underline"
            >
              View All Blog Posts &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {articles.slice(0, 4).map((art) => (
              <Link
                key={art.id}
                href={`/article/${art.slug}`}
                className="group block"
              >
                <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-gray-100 mb-2.5">
                  <img
                    src={art.featuredImage}
                    alt={art.imageAlt || art.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#f50076] block mb-1">
                  {art.category?.name || 'Biography'}
                </span>
                <h3 className="text-[16px] font-bold text-gray-950 leading-snug group-hover:text-[#f50076] transition-colors line-clamp-2">
                  {art.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
