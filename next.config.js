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
        source: '/pageantwinners/:slug*.html',
        destination: '/profession/model',
        permanent: true,
      },
      {
        source: '/pageantwinners/:slug*',
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
