import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import TableOfContents from '@/components/magazine/TableOfContents';
import ShareButtons from '@/components/magazine/ShareButtons';
import ArticleCard from '@/components/magazine/ArticleCard';
import AdBanner from '@/components/layout/AdBanner';
import { Clock, Eye, Calendar, User, ExternalLink, ChevronRight } from 'lucide-react';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true, author: true },
  });

  if (!article) {
    return { title: 'Article Not Found | Birthday Aura' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birthdayaura.vercel.app';
  const url = `${siteUrl}/article/${article.slug}`;

  return {
    title: article.metaTitle || `${article.title} | Birthday Aura`,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: article.canonicalUrl || url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.imageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  const now = new Date();
  if (!article || article.status !== 'PUBLISHED' || (article.publishedAt && article.publishedAt > now)) {
    notFound();
  }

  // Increment views counter asynchronously
  try {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewsCount: { increment: 1 } },
    });
  } catch (e) {
    // Non-blocking view increment
  }

  // Fetch related articles from same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      status: 'PUBLISHED',
    },
    include: { category: true, author: true },
    take: 3,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://birthdayaura.vercel.app';
  const canonicalUrl = `${siteUrl}/article/${article.slug}`;

  // Structured Data Schema (NewsArticle + BreadcrumbList)
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.featuredImage],
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `${siteUrl}/author/${article.author.id}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Birthday Aura',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category.name,
        item: `${siteUrl}/category/${article.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs font-mono text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href={`/category/${article.category.slug}`} className="hover:text-gold-500 transition-colors">
            {article.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate max-w-xs text-gray-400 dark:text-gray-500">{article.title}</span>
        </nav>

        {/* Editorial Article Header */}
        <header className="max-w-4xl mx-auto text-center space-y-6 mb-10">
          <Link
            href={`/category/${article.category.slug}`}
            className="inline-block px-3.5 py-1 rounded-full text-xs uppercase font-mono tracking-widest font-bold text-white shadow-sm"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-gray-950 dark:text-white leading-[1.15] tracking-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl font-serif text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed italic">
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Author & Publication Byline */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-gray-100 dark:border-editorial-cardDarkBorder text-xs font-mono text-gray-500 dark:text-gray-400">
            <Link href={`/author/${article.author.id}`} className="flex items-center space-x-2 hover:text-gold-500">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-500/40">
                <img
                  src="/celebrities/clara-vance.jpg"
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{article.author.name}</span>
            </Link>

            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold-500" />
              {formatDate(article.publishedAt)}
            </span>

            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-gold-500" />
              {article.readTime} min read
            </span>

            {article.viewsCount > 0 && (
              <span className="flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1.5 text-gold-500" />
                {article.viewsCount} reads
              </span>
            )}
          </div>
        </header>

        {/* Featured Hero Media */}
        <div className="relative w-full aspect-[16/9] max-h-[620px] overflow-hidden rounded-2xl shadow-lg border border-gray-200 dark:border-editorial-cardDarkBorder mb-12 bg-gray-100 dark:bg-editorial-subtle">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>

        {/* Content Layout: Sticky TOC/Sidebar + Main Prose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Left Column: Floating TOC & Share Buttons (4 cols) */}
          <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="p-4 rounded-xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder">
                <ShareButtons url={canonicalUrl} title={article.title} />
              </div>

              <TableOfContents content={article.content} />

              <AdBanner slot="334455667" format="sidebar" label="Partner" />
            </div>
          </aside>

          {/* Right Column: Editorial Body & Attributions (8 cols) */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-8">
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 font-sans leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Syndication & Ethical Source Attribution Box */}
            {article.originalSourceUrl && (
              <div className="p-5 rounded-xl border border-gray-200 dark:border-editorial-cardDarkBorder bg-gray-50/80 dark:bg-editorial-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200 block sm:inline mr-2">
                    Source Attribution:
                  </span>
                  <span>{article.originalSourceName || 'Syndicated Partner'}</span>
                </div>
                <a
                  href={article.originalSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center text-gold-600 dark:text-gold-400 font-semibold hover:underline"
                >
                  Inspect Original Source Wire <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            )}

            {/* Author Profile Bio Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder flex items-start space-x-4 mt-8">
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-500">
                <img
                  src="/celebrities/clara-vance.jpg"
                  alt={article.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-600 dark:text-gold-400 font-bold">
                  About the Contributor
                </span>
                <h4 className="text-base font-serif font-bold text-gray-950 dark:text-white">
                  <Link href={`/author/${article.author.id}`} className="hover:underline">
                    {article.author.name}
                  </Link>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                  {article.author.bio || 'Pop-culture biographer & entertainment researcher at Birthday Aura, documenting verified celebrity birthdates, early lives & career stories.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner Placement */}
        <AdBanner slot="887766554" format="banner" className="mt-12" />

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200 dark:border-editorial-cardDarkBorder">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-black text-gray-950 dark:text-white">
                Related Intelligence in {article.category.name}
              </h3>
              <Link
                href={`/category/${article.category.slug}`}
                className="text-xs uppercase font-mono tracking-wider text-gold-600 dark:text-gold-400 hover:underline"
              >
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} layout="standard" />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
