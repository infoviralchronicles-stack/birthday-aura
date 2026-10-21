import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Data Protection & Cookies | Birthday Aura',
  description: 'Read the official Privacy Policy of Birthday Aura outlining data collection, cookies, Google AdSense compliance, and reader rights.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 space-y-10">
      <header className="border-b border-gray-200 dark:border-editorial-cardDarkBorder pb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-gray-950 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-gray-500">Effective Date: September 2026</p>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 text-sm leading-relaxed">
        <p>
          At <strong>Birthday Aura</strong>, accessible from Birthday Aura.com, the privacy of our readership is of paramount importance. This Privacy Policy document outlines the types of personal data that is received and collected by Birthday Aura and how it is utilized.
        </p>

        <h2 className="text-xl font-serif font-bold text-gray-950 dark:text-white">1. Information We Collect</h2>
        <p>
          When you subscribe to our private intelligence memo or submit an inquiry through our communications desk, we collect your submitted email address and name. We do not sell, lease, or monetize private subscriber identities.
        </p>

        <h2 className="text-xl font-serif font-bold text-gray-950 dark:text-white">2. Log Files & Analytics</h2>
        <p>
          Like many professional digital publications, Birthday Aura utilizes standard server logs and performance telemetry. The information inside the log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and number of clicks.
        </p>

        <h2 className="text-xl font-serif font-bold text-gray-950 dark:text-white">3. Cookies and Web Beacons</h2>
        <p>
          Birthday Aura uses cookies to store information about visitors&apos; preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors&apos; browser type or other information.
        </p>

        <h2 className="text-xl font-serif font-bold text-gray-950 dark:text-white">4. Google AdSense & DoubleClick DART Cookie</h2>
        <p>
          Google, as a third-party vendor, uses cookies to serve ads on Birthday Aura. Google&apos;s use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
        </p>

        <h2 className="text-xl font-serif font-bold text-gray-950 dark:text-white">5. Contact & Data Privacy Requests</h2>
        <p>
          If you have questions regarding this Privacy Policy or wish to request data deletion, please contact our data privacy desk at{' '}
          <a href="mailto:contact@birthdayaura.com" className="text-gold-600 dark:text-gold-400 font-semibold underline hover:text-gold-500">
            contact@birthdayaura.com
          </a>.
        </p>
      </div>
    </div>
  );
}

