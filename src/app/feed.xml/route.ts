import { NextResponse } from 'next/server';
import { CELEBRITY_DIRECTORY, MONTH_NAMES, getZodiacSign } from '@/lib/birthdayData';

export async function GET() {
  const baseUrl = 'https://www.birthdayaura.com';
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // Find today's birthday celebrities
  let stars = CELEBRITY_DIRECTORY.filter(
    (c) => c.birthMonth === currentMonth && c.birthDay === currentDay
  ).sort((a, b) => b.boosts - a.boosts);

  if (stars.length === 0) {
    stars = CELEBRITY_DIRECTORY.slice(0, 10);
  }

  const itemsXml = stars
    .map((star) => {
      const age = currentYear - star.birthYear;
      const zodiac = getZodiacSign(star.birthMonth, star.birthDay);
      const monthName = MONTH_NAMES[star.birthMonth - 1];
      const title = `Happy Birthday to ${star.name}! (${monthName} ${star.birthDay})`;
      const link = `${baseUrl}/people/${star.id}`;
      const description = `Born on ${monthName} ${star.birthDay}, ${star.birthYear} — turning ${age} today! Profession: ${star.profession}. Zodiac: ${zodiac}. Birthplace: ${star.birthplace}. ${star.about}`;
      const imageUrl = `${baseUrl}${star.image}`;

      return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${now.toUTCString()}</pubDate>
      <description><![CDATA[${description}]]></description>
      <enclosure url="${imageUrl}" length="0" type="image/jpeg" />
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Birthday Aura — Daily Celebrity Birthdays</title>
    <link>${baseUrl}</link>
    <description>Daily celebrity birthdays, verified ages, zodiac auras, and star biographies.</description>
    <language>en-us</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
