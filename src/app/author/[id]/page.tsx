import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/magazine/ArticleCard';
import { Twitter, Linkedin, Globe, Shield } from 'lucide-react';

interface AuthorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!author) return { title: 'Author Not Found | Birthday Aura' };

  return {
    title: `${author.name} — Editorial Profile | Birthday Aura`,
    description: author.bio || `Articles and market commentary by ${author.name} on Birthday Aura.`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: { category: true, author: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!author) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birthdayaura.vercel.app';

  const jsonLdAuthor = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    image: author.avatar,
    jobTitle: author.role === 'ADMIN' ? 'Executive Editor' : 'Staff Writer',
    worksFor: {
      '@type': 'NewsMediaOrganization',
      name: 'Birthday Aura',
    },
    url: `${siteUrl}/author/${author.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAuthor) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
        {/* Author Bio Header Card */}
        <div className="p-8 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-gold-500 shadow-md">
            <img
              src="/celebrities/clara-vance.jpg"
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400 bg-gold-500/10 border border-gold-500/20">
              <Shield className="w-3.5 h-3.5 mr-1" />
              {author.role === 'ADMIN' ? 'Senior Celebrity Biographer' : 'Contributing Biographer'}
            </div>

            <h1 className="text-3xl font-serif font-black text-gray-950 dark:text-white">
              {author.name}
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              {author.bio || 'Pop-culture biographer & entertainment researcher at Birthday Aura, documenting verified celebrity birthdates, early lives & career stories.'}
            </p>

            <div className="flex items-center justify-center md:justify-start space-x-3 pt-2">
              {author.twitter && (
                <a
                  href={author.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gold-500"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gold-500"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gold-500"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Authored Articles */}
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-950 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-editorial-cardDarkBorder">
            Dispatches by {author.name} ({author.articles.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {author.articles.map((art) => (
              <ArticleCard key={art.id} article={art} layout="standard" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
