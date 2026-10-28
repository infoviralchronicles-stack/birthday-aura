import { NextResponse } from 'next/server';
import { CELEBRITY_DIRECTORY, MONTH_NAMES, getZodiacSign } from '@/lib/birthdayData';

export async function GET() {
  const baseUrl = 'https://www.birthdayaura.com';
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // Find today's birthday celebrities sorted by highest popularity/boosts
  let todayStars = CELEBRITY_DIRECTORY.filter(
    (c) => c.birthMonth === currentMonth && c.birthDay === currentDay
  ).sort((a, b) => b.boosts - a.boosts);

  // If today has less than 10, fill up with tomorrow's stars
  let stars = [...todayStars];
  if (stars.length < 10) {
    const tomorrow = new Date(now.getTime() + 86400000);
    const tomorrowMonth = tomorrow.getMonth() + 1;
    const tomorrowDay = tomorrow.getDate();
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
      const description = `${isToday ? 'Today' : 'Tomorrow'} we celebrate ${star.name} (${star.profession}) turning ${age}! Born on ${monthName} ${star.birthDay}, ${star.birthYear} in ${star.birthplace}. Zodiac Sign: ${zodiac}. Discover ${star.name}'s full biography, trivia, and family connections on Birthday Aura.`;
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
