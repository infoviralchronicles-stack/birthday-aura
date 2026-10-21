const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Birthday Aura Database ---');

  // 1. Chief Biographer / Admin User
  const adminPassword = await bcrypt.hash('admin123456', 10);
  const authorBio =
    'Pop-culture biographer & entertainment researcher at Birthday Aura, documenting verified celebrity birthdates, early lives & career stories.';
  const admin = await prisma.user.upsert({
    where: { email: 'admin@birthdayaura.com' },
    update: {
      name: 'Aria Sterling',
      bio: authorBio,
      avatar: '/celebrities/clara-vance.jpg',
      twitter: 'https://twitter.com/birthdayaura',
      linkedin: 'https://linkedin.com/company/birthdayaura',
      website: 'https://birthday-aura.vercel.app',
    },
    create: {
      email: 'admin@birthdayaura.com',
      name: 'Aria Sterling',
      passwordHash: adminPassword,
      role: 'ADMIN',
      bio: authorBio,
      avatar: '/celebrities/clara-vance.jpg',
      twitter: 'https://twitter.com/birthdayaura',
      linkedin: 'https://linkedin.com/company/birthdayaura',
      website: 'https://birthday-aura.vercel.app',
    },
  });
  await prisma.user.updateMany({
    data: {
      bio: authorBio,
      avatar: '/celebrities/clara-vance.jpg',
    },
  });

  // 2. Categories matching Header & Homepage
  const categories = [
    {
      name: "Today's Birthdays",
      slug: 'todays-birthdays',
      color: '#ff2a85',
      description: 'Daily celebrity birthday spotlights, October 18 icons, age milestones, and shared birthday twins.',
      metaTitle: "Today's Celebrity Birthdays & Daily Spotlight | Birthday Aura",
      metaDescription: 'Discover who was born today, explore October 18 celebrity birthdays, and view daily popularity rankings.',
    },
    {
      name: 'Creators & Streamers',
      slug: 'creators-streamers',
      color: '#9d4edd',
      description: 'Biographies, birthdates, Before Fame stories, and popularity rankings for YouTube, TikTok, and Twitch stars.',
      metaTitle: 'Creators, YouTubers & Streamers Birthdays | Birthday Aura',
      metaDescription: 'Explore birthdates, ages, trivia, and biographies of the world’s top digital creators and live streamers.',
    },
    {
      name: 'Actors & Cinema',
      slug: 'actors-cinema',
      color: '#06b6d4',
      description: 'Complete biographies, trivia, and family life profiles of Hollywood and television stars.',
      metaTitle: 'Movie & TV Actors Birthdays & Biographies | Birthday Aura',
      metaDescription: 'Read verified biographies, birthplaces, zodiac signs, and career milestones of leading film and TV actors.',
    },
    {
      name: 'Music Icons',
      slug: 'music-icons',
      color: '#d946ef',
      description: 'Pop superstars, hip-hop legends, and global chart-toppers: birthdates, vocal eras, and career trivia.',
      metaTitle: 'Musicians & Singers Birthdays | Birthday Aura',
      metaDescription: 'Discover the birthdays, zodiac signs, Before Fame journeys, and discography trivia of global music icons.',
    },
    {
      name: 'Zodiac & Aura',
      slug: 'zodiac-aura',
      color: '#f59e0b',
      description: 'Astrological compatibility, birthstones, elemental auras, and top celebrities grouped by zodiac sign.',
      metaTitle: 'Celebrity Zodiac Signs, Birthstones & Cosmic Aura | Birthday Aura',
      metaDescription: 'Explore how zodiac signs, birthstones, and elemental frequencies shape the world’s top personalities.',
    },
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // 3. Seed Birthday Aura Biography Articles
  const articles = [
    {
      title: 'Zac Efron Birthday Profile (October 18): Age, Libra Aura, Before Fame & Complete Biography',
      slug: 'zac-efron-birthday-aura-biography',
      excerpt: 'Born on October 18, 1987 in San Luis Obispo, California, Zac Efron evolved from Disney Channel phenomenon Troy Bolton into an Emmy-winning host and dramatic powerhouse in The Iron Claw.',
      categorySlug: 'todays-birthdays',
      isFeatured: true,
      isTrending: true,
      isEditorsPick: true,
      readTime: 6,
      viewsCount: 18420,
      featuredImage: '/celebrities/zac-efron.jpg',
      imageAlt: 'Zac Efron October 18 Birthday Aura Spotlight',
      content: `
<div class="my-6 p-6 rounded-2xl bg-purple-950/30 border border-pink-500/30">
  <h3 class="text-sm font-mono uppercase tracking-widest text-pink-400 font-bold mb-3">⚡ Birthday Aura Quick Facts — Zac Efron</h3>
  <ul class="space-y-1.5 text-sm">
    <li><strong>Birthday:</strong> October 18, 1987</li>
    <li><strong>Birthplace:</strong> San Luis Obispo, California</li>
    <li><strong>Birth Sign:</strong> ♎ Libra (Air Element • Velvet Harmony Aura)</li>
    <li><strong>Birthstone:</strong> Opal &amp; Pink Tourmaline</li>
    <li><strong>Profession:</strong> Movie &amp; Television Actor</li>
  </ul>
</div>

<h2>About Zac Efron</h2>
<p>Zachary David Alexander Efron (born October 18, 1987) is an American actor and producer who first captured global attention as Troy Bolton in the Disney Channel Original Movie <em>High School Musical</em> (2006). Over the following two decades, he demonstrated remarkable range across musical blockbusters like <em>Hairspray</em> and <em>The Greatest Showman</em>, comedies like <em>17 Again</em> and <em>Neighbors</em>, and intense dramatic roles in <em>Extremely Wicked, Shockingly Evil and Vile</em> and A24's <em>The Iron Claw</em>.</p>

<h2>Before Fame</h2>
<p>Raised in Arroyo Grande, California, Efron's father encouraged him to try acting when he was 11 years old. He soon appeared in local theater productions at The Great American Melodrama and Vaudeville, taking singing lessons and performing in shows such as <em>Gypsy</em>, <em>Peter Pan</em>, and <em>Little Shop of Horrors</em> before booking early guest appearances on <em>ER</em> and <em>Firefly</em>.</p>

<h2>Trivia &amp; Career Milestones</h2>
<p>When <em>High School Musical</em> premiered in January 2006, Efron appeared on the Billboard Hot 100 with six simultaneous tracks. Years later, he won a Daytime Emmy Award for Outstanding Daytime Program Host for his Netflix eco-travel series <em>Down to Earth with Zac Efron</em>, and received a star on the Hollywood Walk of Fame in December 2023.</p>

<h2>Family Life</h2>
<p>He was born to David Efron, an electrical engineer at a power station, and Starla Baskett, an administrative assistant. He has a younger brother named Dylan Efron, a producer and outdoor adventurer with whom he frequently travels.</p>

<h2>Associated With</h2>
<p>He shared the screen with Hugh Jackman and Zendaya in the beloved circus musical <em>The Greatest Showman</em>, and portrayed wrestling icon Kevin Von Erich alongside Jeremy Allen White and Harris Dickinson in <em>The Iron Claw</em>.</p>
      `,
    },
    {
      title: 'October 18 Birthdays Almanac: Ne-Yo, Jean-Claude Van Damme, Lindsey Vonn & Tyler Posey',
      slug: 'october-18-famous-birthdays-almanac',
      excerpt: 'Explore the complete lineup of icons born on October 18—from R&B hitmaker Ne-Yo and action legend Jean-Claude Van Damme to Olympic champion Lindsey Vonn and rock pioneer Chuck Berry.',
      categorySlug: 'todays-birthdays',
      isFeatured: true,
      isTrending: true,
      isEditorsPick: true,
      readTime: 7,
      viewsCount: 15290,
      featuredImage: '/celebrities/ne-yo.jpg',
      imageAlt: 'October 18 Birthdays Celebration',
      content: `
<h2>The Cosmic Signature of October 18</h2>
<p>Celebrities born on <strong>October 18</strong> fall under the third decan of <strong>Libra (♎)</strong>, governed by Air element dynamics and the Opal birthstone. On Birthday Aura, October 18 stands out as one of autumn's most star-studded dates across cinema, music, and championship athletics.</p>

<h2>Top Icons Born on October 18</h2>
<h3>1. Ne-Yo (Born October 18, 1979)</h3>
<p>Born Shaffer Chimere Smith in Camden, Arkansas and raised in Las Vegas, Ne-Yo wrote Mario's generational R&amp;B smash "Let Me Love You" before launching his own three-time Grammy-winning solo career with "So Sick", "Closer", and "Miss Independent".</p>

<h3>2. Jean-Claude Van Damme (Born October 18, 1960)</h3>
<p>Hailing from Brussels, Belgium, "The Muscles from Brussels" combined Shotokan karate and classical ballet training to headline martial arts classics <em>Bloodsport</em>, <em>Kickboxer</em>, and <em>Timecop</em>.</p>

<h3>3. Lindsey Vonn (Born October 18, 1984)</h3>
<p>Born in St. Paul, Minnesota, Lindsey Vonn captured 82 World Cup victories, four overall World Cup crystal globes, and Olympic downhill gold at Vancouver 2010.</p>

<h3>4. Tyler Posey (Born October 18, 1991)</h3>
<p>After debuting opposite Jennifer Lopez in <em>Maid in Manhattan</em> at age 10, Tyler Posey became a teen television staple as Scott McCall on MTV's <em>Teen Wolf</em>.</p>
      `,
    },
    {
      title: 'MrBeast (Jimmy Donaldson) Birthday Profile: How a May 7 Taurus Built YouTube’s #1 Empire',
      slug: 'mrbeast-jimmy-donaldson-birthday-aura',
      excerpt: 'Born on May 7, 1998 in Wichita, Kansas, Jimmy Donaldson—known globally as MrBeast—used relentless Taurus determination to become the #1 most-boosted creator in digital history.',
      categorySlug: 'creators-streamers',
      isFeatured: true,
      isTrending: true,
      isEditorsPick: true,
      readTime: 6,
      viewsCount: 24900,
      featuredImage: '/celebrities/mrbeast.jpg',
      imageAlt: 'MrBeast Creator Birthday Profile',
      content: `
<div class="my-6 p-6 rounded-2xl bg-purple-950/30 border border-purple-500/30">
  <h3 class="text-sm font-mono uppercase tracking-widest text-purple-400 font-bold mb-3">⚡ Creator Quick Facts — MrBeast</h3>
  <ul class="space-y-1.5 text-sm">
    <li><strong>Real Name:</strong> Jimmy Donaldson</li>
    <li><strong>Birthday:</strong> May 7, 1998</li>
    <li><strong>Birthplace:</strong> Wichita, Kansas (Raised in Greenville, NC)</li>
    <li><strong>Birth Sign:</strong> ♉ Taurus (Earth Element • Emerald Ground Aura)</li>
    <li><strong>Popularity Rank:</strong> #1 Overall Creator</li>
  </ul>
</div>

<h2>About MrBeast</h2>
<p>Jimmy Donaldson (born May 7, 1998) revolutionized online video through high-concept spectacle challenges, philanthropy, and global consumer brands like Feastables. His main YouTube channel became the most-subscribed channel on the platform in 2024.</p>

<h2>Before Fame</h2>
<p>He uploaded his earliest videos in February 2012 at age 13 under the handle <em>MrBeast6000</em>. For years, he studied viral thumbnails, retention curves, and pacing with a small group of fellow young creators on Skype calls for 12 hours a day.</p>

<h2>Trivia</h2>
<p>His 2021 real-life recreation of <em>Squid Game</em> cost over $3.5 million to produce and garnered hundreds of millions of views within days. Through Beast Philanthropy, #TeamTrees, and #TeamSeas, he has funded cataract surgeries, clean water wells, and environmental cleanups worldwide.</p>

<h2>Family Life &amp; Associations</h2>
<p>Raised in Greenville, North Carolina alongside his brother CJ Donaldson, he frequently collaborates with NASA engineer-turned-YouTuber Mark Rober, Kai Cenat, and IShowSpeed.</p>
      `,
    },
    {
      title: 'IShowSpeed & Kai Cenat: Inside the Birthdays and Before Fame Journeys of Live Streaming’s Biggest Duo',
      slug: 'ishowspeed-kai-cenat-birthday-profiles',
      excerpt: 'From Kai Cenat’s December 16 Sagittarius subathons in New York to IShowSpeed’s January 21 Aquarius global IRL tours, explore the complete biographical breakdown of streaming’s top stars.',
      categorySlug: 'creators-streamers',
      isFeatured: false,
      isTrending: true,
      isEditorsPick: false,
      readTime: 5,
      viewsCount: 16800,
      featuredImage: '/celebrities/ishowspeed.jpg',
      imageAlt: 'Live Streamers Birthday Profiles',
      content: `
<h2>IShowSpeed (Born January 21, 2005)</h2>
<p>Born Darren Watkins Jr. in Cincinnati, Ohio on the cusp of Aquarius (♒), IShowSpeed began streaming gaming sessions from his bedroom before his international football tours across Europe and Asia turned him into a global cultural phenomenon. In June 2023, he fulfilled his lifelong dream of meeting his idol Cristiano Ronaldo in Lisbon.</p>

<h2>Kai Cenat (Born December 16, 2001)</h2>
<p>Born in New York City under the fiery Sagittarius (♐) sign, Kai Cenat rose from uploading short comedy skits in the Bronx to joining the AMP collective and shattering all-time Twitch subscriber records during his cinematic <em>Mafiathon</em> broadcasts.</p>
      `,
    },
    {
      title: 'Zendaya & Tom Holland Birthday Compatibility: Why Virgo and Gemini Rule Modern Hollywood',
      slug: 'zendaya-tom-holland-birthday-compatibility',
      excerpt: 'Born on September 1, 1996 (Virgo) and June 1, 1996 (Gemini), Zendaya and Tom Holland share a Mercury-ruled astrological bond that mirrors their onscreen chemistry.',
      categorySlug: 'actors-cinema',
      isFeatured: true,
      isTrending: true,
      isEditorsPick: false,
      readTime: 6,
      viewsCount: 19300,
      featuredImage: '/celebrities/zendaya.jpg',
      imageAlt: 'Zendaya and Tom Holland Celebrity Birthday Feature',
      content: `
<h2>Zendaya (Born September 1, 1996 — Oakland, CA)</h2>
<p>Born on September 1, 1996 in Oakland, California, Zendaya Maree Stoermer Coleman embodies Virgo's precision and artistic discipline. Before winning two Primetime Emmy Awards for <em>Euphoria</em> and headlining <em>Dune</em> and <em>Challengers</em>, she trained at the California Shakespeare Theater and starred on Disney Channel's <em>Shake It Up</em>.</p>

<h2>Tom Holland (Born June 1, 1996 — London, England)</h2>
<p>Born exactly three months earlier on June 1, 1996 in Kingston upon Thames, London, Tom Holland brings classic Gemini agility and charisma. Trained as a gymnast and dancer for London's West End production of <em>Billy Elliot the Musical</em>, he became the youngest actor to play Peter Parker / Spider-Man in the Marvel Cinematic Universe.</p>
      `,
    },
    {
      title: 'Jenna Ortega & Timothée Chalamet: The Birthdays Behind Gen Z Cinema’s Defining Leads',
      slug: 'jenna-ortega-timothee-chalamet-biographies',
      excerpt: 'Discover the Before Fame origins, family life, and trivia of September 27 Libra Jenna Ortega and December 27 Capricorn Timothée Chalamet.',
      categorySlug: 'actors-cinema',
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      readTime: 5,
      viewsCount: 12400,
      featuredImage: '/celebrities/jenna-ortega.jpg',
      imageAlt: 'Jenna Ortega and Timothee Chalamet Biographies',
      content: `
<h2>Jenna Ortega (Born September 27, 2002)</h2>
<p>Born in California's Coachella Valley as the fourth of six children, Jenna Ortega began acting at age nine before her self-choreographed dance as Wednesday Addams in Netflix's <em>Wednesday</em> became a global sensation.</p>

<h2>Timothée Chalamet (Born December 27, 1995)</h2>
<p>Born in Manhattan's Hell's Kitchen and educated at Fiorello H. LaGuardia High School of Music &amp; Art, Timothée Chalamet became one of the youngest Best Actor Oscar nominees in history for <em>Call Me by Your Name</em> before leading <em>Dune</em> and <em>Wonka</em>.</p>
      `,
    },
    {
      title: 'Taylor Swift (December 13): How Her Birthday Number 13 & Sagittarius Fire Shaped Pop History',
      slug: 'taylor-swift-december-13-birthday-aura',
      excerpt: 'Born on December 13, 1989 in West Reading, Pennsylvania, Taylor Swift turned her birthdate into pop music’s signature lucky number.',
      categorySlug: 'music-icons',
      isFeatured: true,
      isTrending: true,
      isEditorsPick: false,
      readTime: 6,
      viewsCount: 22100,
      featuredImage: '/celebrities/taylor-swift.jpg',
      imageAlt: 'Taylor Swift December 13 Birthday Profile',
      content: `
<h2>Why 13 Is Taylor Swift’s Signature Number</h2>
<p>Taylor Alison Swift was born on <strong>December 13, 1989</strong> in West Reading, Pennsylvania. Throughout her career, she has celebrated the number 13 as her personal emblem: she was born on the 13th, turned 13 on Friday the 13th, her debut album went gold in 13 weeks, and she became the first artist in history to win four Album of the Year Grammys.</p>

<h2>Before Fame</h2>
<p>Swift spent her early childhood on an 11-acre Christmas tree farm in Wyomissing, Pennsylvania before convincing her family to relocate to Hendersonville, Tennessee at age 14 so she could pitch original songs along Nashville's Music Row.</p>
      `,
    },
    {
      title: 'Billie Eilish & Sabrina Carpenter: Birthday Profiles, Vocal Eras & Chart-Topping Trivia',
      slug: 'billie-eilish-sabrina-carpenter-birthday-profiles',
      excerpt: 'Compare the Before Fame stories and birthday trivia of December 18 Sagittarius Billie Eilish and May 11 Taurus Sabrina Carpenter.',
      categorySlug: 'music-icons',
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      readTime: 5,
      viewsCount: 14100,
      featuredImage: '/celebrities/billie-eilish.jpg',
      imageAlt: 'Billie Eilish and Sabrina Carpenter Biographies',
      content: `
<h2>Billie Eilish (Born December 18, 2001 — Los Angeles, CA)</h2>
<p>Homeschooled alongside her brother Finneas O'Connell in Highland Park, Los Angeles, Billie Eilish uploaded "Ocean Eyes" at age 13 and went on to become the youngest two-time Academy Award winner in history.</p>

<h2>Sabrina Carpenter (Born May 11, 1999 — Quakertown, PA)</h2>
<p>Born in Quakertown, Pennsylvania, Sabrina Carpenter recorded early YouTube covers in a purple closet studio built by her father before starring on <em>Girl Meets World</em> and dominating global charts with "Espresso" and <em>Short n' Sweet</em>.</p>
      `,
    },
    {
      title: 'The Complete Celebrity Zodiac & Birthstone Guide: Finding Your Cosmic Birthday Aura',
      slug: 'complete-celebrity-zodiac-birthstone-guide',
      excerpt: 'How Fire, Earth, Air, and Water zodiac signs align with traditional birthstones and why certain months produce record-breaking clusters of cultural icons.',
      categorySlug: 'zodiac-aura',
      isFeatured: false,
      isTrending: true,
      isEditorsPick: false,
      readTime: 6,
      viewsCount: 11850,
      featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Zodiac Signs and Birthstones Celebrity Guide',
      content: `
<h2>The Four Elemental Auras in Celebrity Culture</h2>
<p>On <strong>Birthday Aura</strong>, every birthday is mapped to its astrological sign, elemental frequency, and monthly birthstone:</p>
<ul>
  <li><strong>Fire Signs (Aries ♈, Leo ♌, Sagittarius ♐):</strong> Driven by bold stage presence and magnetic leadership—exemplified by Taylor Swift, Billie Eilish, and Kylie Jenner.</li>
  <li><strong>Earth Signs (Taurus ♉, Virgo ♍, Capricorn ♑):</strong> Renowned for relentless craft and empire-building—seen in MrBeast, Zendaya, LeBron James, and Timothée Chalamet.</li>
  <li><strong>Air Signs (Gemini ♊, Libra ♎, Aquarius ♒):</strong> Celebrated for communication, charm, and viral velocity—including Zac Efron, Cristiano Ronaldo, IShowSpeed, and Tom Holland.</li>
  <li><strong>Water Signs (Cancer ♋, Scorpio ♏, Pisces ♓):</strong> Masters of emotional depth and artistic reinvention—including Lionel Messi, Ryan Reynolds, Leonardo DiCaprio, and Rihanna.</li>
</ul>
      `,
    },
  ];

  for (const art of articles) {
    const categoryId = categoryMap[art.categorySlug];
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        imageAlt: art.imageAlt,
        readTime: art.readTime,
        viewsCount: art.viewsCount,
        isFeatured: art.isFeatured,
        isTrending: art.isTrending,
        isEditorsPick: art.isEditorsPick,
        categoryId,
        authorId: admin.id,
        status: 'PUBLISHED',
      },
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        imageAlt: art.imageAlt,
        readTime: art.readTime,
        viewsCount: art.viewsCount,
        isFeatured: art.isFeatured,
        isTrending: art.isTrending,
        isEditorsPick: art.isEditorsPick,
        categoryId,
        authorId: admin.id,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)),
      },
    });
  }

  console.log('--- Seeded Birthday Aura with Categories, Admin, and Celebrity Biographies! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
