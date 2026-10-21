import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/magazine/ArticleCard';
import AdBanner from '@/components/layout/AdBanner';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: 'Category Not Found | Birthday Aura' };
  }

  return {
    title: category.metaTitle || `${category.name} | Birthday Aura`,
    description: category.metaDescription || category.description || `Read the latest ${category.name} reports on Birthday Aura.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const now = new Date();
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: now },
        },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Category Hero Banner */}
      <header className="py-12 border-b border-gray-200 dark:border-editorial-cardDarkBorder text-center max-w-3xl mx-auto space-y-4">
        <span
          className="inline-block px-3.5 py-1 rounded-full text-xs uppercase font-mono tracking-widest font-bold text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          Dossier Collection
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-950 dark:text-white">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
            {category.description}
          </p>
        )}
      </header>

      {/* Articles Grid */}
      {category.articles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-mono text-sm">
          No dispatches published under this dossier yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.articles.map((art) => (
            <ArticleCard key={art.id} article={art} layout="standard" />
          ))}
        </div>
      )}

      {/* Bottom Ad Placement */}
      <AdBanner slot="445566778" format="banner" />
    </div>
  );
}
