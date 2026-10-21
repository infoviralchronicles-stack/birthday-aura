import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    await prisma.newsletterSubscriber.upsert({
      where: { email: cleanEmail },
      update: { active: true },
      create: { email: cleanEmail },
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (err: any) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
