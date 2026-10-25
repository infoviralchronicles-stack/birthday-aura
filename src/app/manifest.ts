import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Birthday Aura',
    short_name: 'Birthday Aura',
    description: "Today's celebrity birthdays, popular creator profiles, and verified star biographies.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ff1f5a',
    icons: [
      {
        src: '/favicon-48x48.png?v=2',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/favicon-96x96.png?v=2',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icon-192.png?v=2',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png?v=2',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
