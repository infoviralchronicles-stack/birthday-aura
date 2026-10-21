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
    'Discover today’s celebrity birthdays, explore star ages, professions, trivia, and complete biographies on Birthday Aura.',
  keywords: [
    'birthday aura',
    'todays birthdays',
    'celebrity birthdays',
    'zac efron',
    'celebrity biographies',
  ],
  icons: {
    icon: [{ url: '/favicon.svg?v=2', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg?v=2',
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
