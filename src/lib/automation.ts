import Parser from 'rss-parser';
import { prisma } from './prisma';
import { slugify, estimateReadingTime, truncateText } from './utils';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
    ],
  },
});

export interface IngestionResult {
  sourceId: string;
  sourceName: string;
  found: number;
  imported: number;
  skipped: number;
  errors: string[];
}

async function generateGeminiEditorialInsight(title: string, summary: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return 'Precious metals, sovereign asset allocations, and high-net-worth liquidity channels continue to respond to shifting macro indicators. This development underscores continued investor emphasis on hard-asset preservation.';
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are the Executive Chief Editor of Birthday Aura (an elite digital publication on physical gold, precious metals, macro finance, and sovereign wealth).
Provide a concise, highly sophisticated 2-to-3 sentence analytical "Editorial Market Insight" on the following news dispatch:
Title: "${title}"
Summary: "${summary}"
Focus on bullion impact, inflation hedges, central bank monetary policy, or wealth preservation. Return only the raw paragraph text.`
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();
    const insight = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (insight) return insight;
  } catch (err) {
    console.error('Gemini synthesis fallback:', err);
  }

  return 'Precious metals, sovereign asset allocations, and high-net-worth liquidity channels continue to respond to shifting macro indicators. This development underscores continued investor emphasis on hard-asset preservation.';
}

async function fetchUnsplashImage(keyword: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const cleanQuery = encodeURIComponent(keyword.slice(0, 40));
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${cleanQuery}&per_page=1&orientation=landscape`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls?.regular || data.results[0].urls?.full || null;
      }
    }
  } catch (err) {
    console.error('Unsplash fetch error:', err);
  }

  return null;
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579247075775-68007a70823b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1624365169364-061015c9ef3b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
];

export async function ingestFeed(sourceId: string): Promise<IngestionResult> {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    include: { category: true },
  });

  if (!source) {
    throw new Error(`Source not found: ${sourceId}`);
  }

  const result: IngestionResult = {
    sourceId: source.id,
    sourceName: source.name,
    found: 0,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  try {
    const feed = await parser.parseURL(source.url);
    result.found = feed.items?.length || 0;

    const defaultAuthor = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN', 'EDITOR'] } },
    }) || await prisma.user.findFirst();

    if (!defaultAuthor) {
      throw new Error('No author found in database. Seed required.');
    }

    for (const item of feed.items || []) {
      try {
        const title = (item.title || '').trim();
        if (!title) {
          result.skipped++;
          continue;
        }

        const sourceUrl = item.link || '';
        let baseSlug = slugify(title);
        if (!baseSlug) baseSlug = 'article-' + Date.now();

        const existing = await prisma.article.findFirst({
          where: {
            OR: [
              { originalSourceUrl: sourceUrl },
              { slug: baseSlug },
            ],
          },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        let slug = baseSlug;
        let counter = 1;
        while (await prisma.article.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        let imageUrl = '';
        if (item.enclosure && item.enclosure.url) {
          imageUrl = item.enclosure.url;
        } else if ((item as any).mediaContent && (item as any).mediaContent.$ && (item as any).mediaContent.$.url) {
          imageUrl = (item as any).mediaContent.$.url;
        } else {
          // Dynamically search Unsplash for high-res photo matching article topic
          const unsplashImg = await fetchUnsplashImage(title);
          if (unsplashImg) {
            imageUrl = unsplashImg;
          } else {
            const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
            imageUrl = DEFAULT_IMAGES[randomIndex];
          }
        }

        const rawContent = (item as any).contentEncoded || item.content || item.summary || '';
        const cleanSummary = truncateText(rawContent.replace(/<[^>]*>?/gm, '').trim(), 320);

        const aiInsight = await generateGeminiEditorialInsight(title, cleanSummary);

        const synthesizedContent = `
<p class="lead text-xl font-serif leading-relaxed text-gray-700 dark:text-gray-200 mb-6">
  ${cleanSummary || title}
</p>

<div class="my-8 p-6 rounded-xl bg-gold-50 dark:bg-editorial-subtle border border-gold-200 dark:border-editorial-cardDarkBorder">
  <div class="flex items-center gap-2 mb-2">
    <span class="inline-block w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
    <h4 class="text-xs font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-400">
      Executive Editorial Analysis & Bullion Impact
    </h4>
  </div>
  <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
    ${aiInsight}
  </p>
</div>

${rawContent ? `<div class="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-300 space-y-4">${rawContent}</div>` : ''}

<div class="mt-10 p-4 rounded-lg bg-gray-50 dark:bg-editorial-subtle border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
  <span>Source Attribution: <strong>${source.name}</strong></span>
  ${sourceUrl ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer nofollow" class="text-gold-600 hover:underline">Read original dispatch &rarr;</a>` : ''}
</div>
`;

        let status = 'PUBLISHED';
        if (source.autoPublishMode === 'DRAFT') status = 'DRAFT';

        const readTime = estimateReadingTime(synthesizedContent);

        await prisma.article.create({
          data: {
            title,
            slug,
            excerpt: cleanSummary || truncateText(title, 140),
            content: synthesizedContent,
            featuredImage: imageUrl,
            imageAlt: title,
            readTime,
            status,
            isFeatured: false,
            isTrending: true,
            isEditorsPick: false,
            metaTitle: `${title} | Birthday Aura`,
            metaDescription: truncateText(cleanSummary || title, 155),
            canonicalUrl: sourceUrl || null,
            originalSourceUrl: sourceUrl || null,
            originalSourceName: source.name,
            categoryId: source.categoryId,
            authorId: defaultAuthor.id,
            publishedAt: new Date(),
          },
        });

        result.imported++;
      } catch (itemErr: any) {
        result.errors.push(itemErr.message || 'Item error');
      }
    }

    await prisma.source.update({
      where: { id: source.id },
      data: { lastFetchedAt: new Date() },
    });

    await prisma.automationLog.create({
      data: {
        sourceId: source.id,
        status: result.imported > 0 ? 'SUCCESS' : 'SKIPPED',
        articlesFound: result.found,
        articlesCreated: result.imported,
        message: `Feed sync complete. Found ${result.found}, imported ${result.imported}, skipped ${result.skipped}.`,
      },
    });

  } catch (feedErr: any) {
    result.errors.push(feedErr.message || 'Feed parse error');
    await prisma.automationLog.create({
      data: {
        sourceId: source.id,
        status: 'FAILED',
        articlesFound: 0,
        articlesCreated: 0,
        message: `Feed sync failed: ${feedErr.message || 'Unknown network error'}`,
      },
    });
  }

  return result;
}

export async function ingestAllActiveSources(): Promise<IngestionResult[]> {
  const activeSources = await prisma.source.findMany({
    where: { isActive: true },
  });

  const results: IngestionResult[] = [];
  for (const src of activeSources) {
    const res = await ingestFeed(src.id);
    results.push(res);
  }
  return results;
}

