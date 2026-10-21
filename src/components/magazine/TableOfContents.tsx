'use client';

import { useState, useEffect } from 'react';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract H2 and H3 tags from content or from the DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = Array.from(doc.querySelectorAll('h2, h3'));

    const items: TOCItem[] = elements.map((el, i) => {
      const text = el.textContent || '';
      const id = el.id || `heading-${i}`;
      const level = el.tagName === 'H2' ? 2 : 3;
      return { id, text, level };
    });

    setHeadings(items);

    // Synchronize document elements with IDs
    const domHeadings = document.querySelectorAll('article h2, article h3');
    domHeadings.forEach((el, i) => {
      if (!el.id) el.id = `heading-${i}`;
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headingElements = Array.from(document.querySelectorAll('article h2, article h3'));

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i] as HTMLElement;
        if (el.offsetTop - 120 <= scrollY) {
          setActiveId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="p-5 rounded-xl border border-gray-200 dark:border-editorial-cardDarkBorder bg-gray-50/70 dark:bg-editorial-cardDark/50 my-6">
      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-gold-600 dark:text-gold-400 font-bold mb-3 pb-2 border-b border-gray-200 dark:border-editorial-cardDarkBorder">
        <List className="w-4 h-4" />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-2 text-xs font-sans">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              className={`${h.level === 3 ? 'ml-4' : ''} transition-all`}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(h.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`block leading-snug py-0.5 ${
                  isActive
                    ? 'text-gold-600 dark:text-gold-400 font-semibold pl-2 border-l-2 border-gold-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
