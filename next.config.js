/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./prisma/**/*'],
    },
  },
  async redirects() {
    return [
      {
        source: '/january15.html',
        destination: '/birthdays/january-15',
        permanent: true,
      },
      {
        source: '/january15',
        destination: '/birthdays/january-15',
        permanent: true,
      },
      {
        source: '/july18.html',
        destination: '/birthdays/july-18',
        permanent: true,
      },
      {
        source: '/july18',
        destination: '/birthdays/july-18',
        permanent: true,
      },
      {
        source: '/july30.html',
        destination: '/birthdays/july-30',
        permanent: true,
      },
      {
        source: '/july30',
        destination: '/birthdays/july-30',
        permanent: true,
      },
      {
        source: '/names/:slug.html',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/names/:slug',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/shows/:slug.html',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/shows/:slug',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/movies/:slug.html',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/movies/:slug',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/age/:slug.html',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/age/:slug',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/city/:slug.html',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/city/:slug',
        destination: '/search?q=:slug',
        permanent: true,
      },
      {
        source: '/profession/age/youtubestar.html',
        destination: '/profession/youtube-star',
        permanent: true,
      },
      {
        source: '/profession/age/youtubestar',
        destination: '/profession/youtube-star',
        permanent: true,
      },
      {
        source: '/profession/age/:slug.html',
        destination: '/profession/:slug',
        permanent: true,
      },
      {
        source: '/profession/age/:slug',
        destination: '/profession/:slug',
        permanent: true,
      },
      {
        source: '/profession/youtubestar.html',
        destination: '/profession/youtube-star',
        permanent: true,
      },
      {
        source: '/profession/youtubestar',
        destination: '/profession/youtube-star',
        permanent: true,
      },
      {
        source: '/profession/soccerplayer.html',
        destination: '/profession/soccer-player',
        permanent: true,
      },
      {
        source: '/profession/soccerplayer',
        destination: '/profession/soccer-player',
        permanent: true,
      },
      {
        source: '/profession/:slug.html',
        destination: '/profession/:slug',
        permanent: true,
      },
      {
        source: '/people/lana-rae.html',
        destination: '/people/lana-rae',
        permanent: true,
      },
      {
        source: '/people/:slug.html',
        destination: '/people/:slug',
        permanent: true,
      },
      {
        source: '/birthdays/:slug.html',
        destination: '/birthdays/:slug',
        permanent: true,
      },
      {
        source: '/pageantwinners/:slug.html',
        destination: '/profession/model',
        permanent: true,
      },
      {
        source: '/pageantwinners/:path*',
        destination: '/profession/model',
        permanent: true,
      },
      {
        source: '/pageantwinners.html',
        destination: '/profession/model',
        permanent: true,
      },
      {
        source: '/pageantwinners',
        destination: '/profession/model',
        permanent: true,
      },
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
