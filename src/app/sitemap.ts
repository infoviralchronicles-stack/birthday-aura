import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { CELEBRITY_DIRECTORY } from '@/lib/birthdayData';

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.birthdayaura.com';

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
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

  // 2. All Celebrity Profile Pages (Top Priority for Google Search Indexing)
  const peopleRoutes: MetadataRoute.Sitemap = CELEBRITY_DIRECTORY.map((celeb) => ({
    url: `${baseUrl}/people/${celeb.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  // 3. Unique Profession Directory Pages
  const uniqueProfessions = Array.from(
    new Set(CELEBRITY_DIRECTORY.map((c) => toSlug(c.profession)))
  );
  const professionRoutes: MetadataRoute.Sitemap = uniqueProfessions.map((slug) => ({
    url: `${baseUrl}/profession/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // 4. Dynamic Articles
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

  // 5. Dynamic Categories
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

  return [...staticRoutes, ...peopleRoutes, ...professionRoutes, ...categoryRoutes, ...articleRoutes];
}
