import { NextResponse } from 'next/server';
import { CELEBRITY_DIRECTORY, MONTH_NAMES, getZodiacSign } from '@/lib/birthdayData';

// Ensure the RSS feed is ALWAYS computed dynamically on every request so it updates automatically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://www.birthdayaura.com';
  const now = new Date();
  
  // Use UTC/Server date
  const currentMonth = now.getUTCMonth() + 1;
  const currentDay = now.getUTCDate();
  const currentYear = now.getUTCFullYear();
  const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

  // Deterministic daily pubDate at 00:00:00 GMT so RSS readers know it's a new daily edition
  const dailyPubDate = new Date(Date.UTC(currentYear, currentMonth - 1, currentDay, 0, 0, 0)).toUTCString();

  // Find today's birthday celebrities sorted by highest popularity/boosts
  let todayStars = CELEBRITY_DIRECTORY.filter(
    (c) => c.birthMonth === currentMonth && c.birthDay === currentDay
  ).sort((a, b) => b.boosts - a.boosts);

  // If today has less than 10, fill up with tomorrow's stars
  let stars = [...todayStars];
  if (stars.length < 10) {
    const tomorrow = new Date(now.getTime() + 86400000);
    const tomorrowMonth = tomorrow.getUTCMonth() + 1;
    const tomorrowDay = tomorrow.getUTCDate();
    const tomorrowStars = CELEBRITY_DIRECTORY.filter(
      (c) => c.birthMonth === tomorrowMonth && c.birthDay === tomorrowDay
    ).sort((a, b) => b.boosts - a.boosts);
    stars = [...stars, ...tomorrowStars];
  }

  // Strictly enforce Buffer's optimal daily limit: EXACTLY TOP 10 CELEBRITIES
  const finalStars = stars.slice(0, 10);

  const itemsXml = finalStars
    .map((star) => {
      const isToday = star.birthMonth === currentMonth && star.birthDay === currentDay;
      const age = currentYear - star.birthYear;
      const zodiac = getZodiacSign(star.birthMonth, star.birthDay);
      const monthName = MONTH_NAMES[star.birthMonth - 1];
      
      const title = isToday
        ? `Happy Birthday to ${star.name}! (${monthName} ${star.birthDay})`
        : `Celebrating Tomorrow: Happy Early Birthday to ${star.name}! (${monthName} ${star.birthDay})`;

      const link = `${baseUrl}/people/${star.id}`;
      // Daily-unique GUID ensures Buffer and RSS readers detect it as a fresh daily post
      const guid = `${baseUrl}/people/${star.id}?date=${dateKey}`;
      const description = `${isToday ? 'Today' : 'Tomorrow'} we celebrate ${star.name} (${star.profession}) turning ${age}! Born on ${monthName} ${star.birthDay}, ${star.birthYear} in ${star.birthplace}. Zodiac Sign: ${zodiac}. Discover ${star.name}'s full biography, trivia, and family connections on Birthday Aura.`;
      const imageUrl = `${baseUrl}${star.image}`;

      return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${dailyPubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <enclosure url="${imageUrl}" length="0" type="image/jpeg" />
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Birthday Aura — Daily Top 10 Celebrity Birthdays</title>
    <link>${baseUrl}</link>
    <description>Daily verified celebrity birthdays, ages, zodiac auras, and biographies.</description>
    <language>en-us</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
    },
  });
}
