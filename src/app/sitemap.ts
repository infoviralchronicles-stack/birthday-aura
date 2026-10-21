import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://Birthday Aura.com';

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/about',
    '/editorial-policy',
    '/contact',
    '/privacy-policy',
    '/disclaimer',
    '/terms',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Articles
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const now = new Date();
    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: now },
      },
      select: { slug: true, updatedAt: true },
      take: 1000,
    });

    articleRoutes = articles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.error('Error fetching articles for sitemap:', err);
  }

  // 3. Dynamic Categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));
  } catch (err) {
    console.error('Error fetching categories for sitemap:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}

