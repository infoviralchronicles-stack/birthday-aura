import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { slugify, estimateReadingTime } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const {
      title,
      content,
      excerpt,
      featuredImage,
      categoryId,
      status,
      isFeatured,
      isTrending,
      isEditorsPick,
      metaTitle,
      metaDescription,
    } = data;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const readTime = estimateReadingTime(content);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || title.slice(0, 150),
        content,
        featuredImage: featuredImage || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
        readTime,
        status: status || 'PUBLISHED',
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isEditorsPick: Boolean(isEditorsPick),
        metaTitle: metaTitle || `${title} | Birthday Aura`,
        metaDescription: metaDescription || excerpt || title.slice(0, 150),
        categoryId,
        authorId: user.userId,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error('Article creation error:', error);
    return NextResponse.json({ error: error.message || 'Creation failed' }, { status: 500 });
  }
}

