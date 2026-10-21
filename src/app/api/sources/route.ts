import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ sources });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { name, url, categoryId, autoPublishMode, fetchIntervalMinutes } = await req.json();

    if (!name || !url || !categoryId) {
      return NextResponse.json({ error: 'Name, URL, and category are required' }, { status: 400 });
    }

    const source = await prisma.source.create({
      data: {
        name,
        url,
        categoryId,
        autoPublishMode: autoPublishMode || 'REVIEW',
        fetchIntervalMinutes: Number(fetchIntervalMinutes) || 60,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, source });
  } catch (error: any) {
    console.error('Source error:', error);
    return NextResponse.json({ error: error.message || 'Creation failed' }, { status: 500 });
  }
}
