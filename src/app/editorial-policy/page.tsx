import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial & Ethics Policy â€” Attribution & Independence | Birthday Aura',
  description: 'Our charter of editorial standards, sovereign reporting principles, transparent attribution, and commercial independence policies at Birthday Aura.',
  alternates: {
    canonical: 'https://Birthday Aura.com/editorial-policy',
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-10">
      <header className="text-center space-y-4 border-b border-gray-200 dark:border-editorial-cardDarkBorder pb-10">
        <span className="text-xs uppercase font-mono tracking-widest text-gold-600 dark:text-gold-400 font-bold">
          Charter of Standards
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-950 dark:text-white">
          Editorial & Ethics Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-serif italic">
          Codified principles governing sovereign financial reporting, attribution integrity, and commercial independence.
        </p>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none font-sans text-gray-700 dark:text-gray-300 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gray-950 dark:text-white">1. Attribution & Syndication Ethics</h2>
        <p>
          Birthday Aura aggregates and synthesizes market telemetry, sovereign releases, and wire dispatches using advanced automated ingestion pipelines. We maintain absolute commitment to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Never copying full texts:</strong> We synthesize concise editorial digests, extract actionable market implications, and provide original commentary.</li>
          <li><strong>Transparent Sourcing:</strong> Every automated or syndicated dispatch features prominent backlink attribution and clear source publisher identification.</li>
          <li><strong>Original Synthesis:</strong> All reports undergo structural key takeaway extraction and readability enhancement.</li>
        </ul>

        <h2 className="text-2xl font-serif font-bold text-gray-950 dark:text-white mt-8">2. Commercial Separation & AdSense</h2>
        <p>
          Advertisements, including automated Google AdSense units, are distinctly separated from editorial content. Sponsored features or partner intelligence are prominently marked with clear disclosure badges.
        </p>

        <h2 className="text-2xl font-serif font-bold text-gray-950 dark:text-white mt-8">3. Verification & Corrections</h2>
        <p>
          When factual inaccuracies or telemetry calculation errors occur, our policy is prompt, transparent correction. Corrections are marked with an updated timestamp at the foot of the affected dispatch.
        </p>

        <h2 className="text-2xl font-serif font-bold text-gray-950 dark:text-white mt-8">4. Editorial Inquiries & Corrections Desk</h2>
        <p>
          To submit editorial inquiries, news tips, or correction requests, reach our senior correspondents directly at{' '}
          <a href="mailto:contact@birthdayaura.com" className="text-gold-600 dark:text-gold-400 font-semibold underline hover:text-gold-500">
            contact@birthdayaura.com
          </a>.
        </p>
      </div>
    </div>
  );
}

