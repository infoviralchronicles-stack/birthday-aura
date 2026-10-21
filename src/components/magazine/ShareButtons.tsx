'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Facebook, Share2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-mono uppercase text-gray-400 mr-2">Share</span>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="p-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-gold-500 text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors"
      >
        <Twitter className="w-3.5 h-3.5" />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="p-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-gold-500 text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors"
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="p-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-gold-500 text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors"
      >
        <Facebook className="w-3.5 h-3.5" />
      </a>

      <button
        onClick={handleCopy}
        aria-label="Copy article link"
        className="p-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-gold-500 text-gray-600 dark:text-gray-300 hover:text-gold-500 transition-colors flex items-center"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
