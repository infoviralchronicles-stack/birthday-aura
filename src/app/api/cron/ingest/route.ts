import { NextResponse } from 'next/server';
import { ingestAllActiveSources, ingestFeed } from '@/lib/automation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sourceId = searchParams.get('sourceId');
    const secret = searchParams.get('secret');

    // Security Verification: Require valid CRON_SECRET or authenticated ADMIN session
    const cronSecret = process.env.CRON_SECRET || 'Birthday Aura_cron_token_secure';
    const user = await getCurrentUser();

    const isAuthorized = (secret && secret === cronSecret) || (user && user.role === 'ADMIN');

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized automation trigger' }, { status: 401 });
    }

    if (sourceId) {
      const result = await ingestFeed(sourceId);
      return NextResponse.json({ success: true, result });
    } else {
      const results = await ingestAllActiveSources();
      return NextResponse.json({ success: true, results });
    }
  } catch (error: any) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: error.message || 'Ingestion failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}

