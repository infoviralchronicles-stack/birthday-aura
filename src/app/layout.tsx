import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://birthday-aura-plum.vercel.app'),
  title: {
    default: 'Birthday Aura — Today’s Celebrity Birthdays & Biographies',
    template: '%s | Birthday Aura',
  },
  description:
    "Today's celebrity birthdays, popular creator profiles, and verified star biographies. Find out who shares your birthday on Birthday Aura.",
  keywords: [
    'birthday aura',
    'todays birthdays',
    'celebrity birthdays',
    'zac efron',
    'celebrity biographies',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: 'oVti28beRpy1KJPGofwR2wk-7WUNry0VJmVYCcpWpDQ',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} min-h-screen flex flex-col bg-white text-gray-900 antialiased font-sans`}>
        <Header />
        <main className="flex-1 bg-white">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
