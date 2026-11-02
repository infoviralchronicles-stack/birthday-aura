import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shah Rukh Khan 15s Birthday AI Reel Studio | Birthday Aura',
  description: 'Watch, preview, and download the viral 15-second Shah Rukh Khan birthday reel. High-resolution 9:16 vertical canvas with 1-click video export.',
  openGraph: {
    title: 'Shah Rukh Khan Birthday 15s AI Reel | Birthday Aura',
    description: 'Celebrate King Khan turning 61 today with this viral 15-second tribute reel.',
    images: ['/celebrities/shah-rukh-khan.jpg'],
  },
};

export default function ReelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
