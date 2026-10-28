import React from 'react';
import Link from 'next/link';
import { CelebrityProfile } from '@/lib/birthdayData';

interface MatchSpan {
  start: number;
  end: number;
  star: CelebrityProfile;
  matchedText: string;
}

/**
 * Finds all celebrities from the directory mentioned in a given text string.
 */
export function findMentionedCelebrities(
  text: string,
  currentId: string,
  directory: CelebrityProfile[]
): CelebrityProfile[] {
  if (!text || !directory) return [];

  // Filter out the current celebrity
  const candidates = directory.filter((c) => c.id !== currentId && c.name && c.name.trim().length > 2);
  
  // Sort longest names first to prevent partial prefix conflicts (e.g., 'Robert Kardashian' before 'Robert')
  const sortedCandidates = [...candidates].sort((a, b) => b.name.length - a.name.length);

  const matchedStars: CelebrityProfile[] = [];
  const matchedIds = new Set<string>();

  for (const star of sortedCandidates) {
    if (matchedIds.has(star.id)) continue;
    // Word boundary check (case-insensitive)
    const escaped = star.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      matchedStars.push(star);
      matchedIds.add(star.id);
    }
  }

  return matchedStars;
}

interface SmartBiographyTextProps {
  text: string;
  currentId: string;
  directory: CelebrityProfile[];
  className?: string;
}

/**
 * Automatically converts mentioned celebrity names in text into clickable internal links.
 */
export default function SmartBiographyText({
  text,
  currentId,
  directory,
  className = 'text-base sm:text-[17px] text-gray-800 leading-relaxed',
}: SmartBiographyTextProps) {
  if (!text) return null;

  const candidates = directory.filter((c) => c.id !== currentId && c.name && c.name.trim().length > 2);
  const sortedCandidates = [...candidates].sort((a, b) => b.name.length - a.name.length);

  // Find all non-overlapping match intervals
  const spans: MatchSpan[] = [];

  for (const star of sortedCandidates) {
    const escaped = star.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Check if this interval overlaps with an already recorded span
      const overlaps = spans.some((s) => !(end <= s.start || start >= s.end));
      if (!overlaps) {
        spans.push({
          start,
          end,
          star,
          matchedText: match[0],
        });
      }
    }
  }

  if (spans.length === 0) {
    return <p className={className}>{text}</p>;
  }

  // Sort spans in chronological order by their start index
  spans.sort((a, b) => a.start - b.start);

  // Build the array of React nodes (text fragments & Link components)
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  spans.forEach((span, i) => {
    if (span.start > lastIndex) {
      elements.push(text.slice(lastIndex, span.start));
    }

    elements.push(
      <Link
        key={`${span.star.id}-${span.start}-${i}`}
        href={`/people/${span.star.id}`}
        title={`View ${span.star.name}'s Birthday Aura & Biography`}
        className="font-bold text-[#ff1f5a] hover:underline decoration-2 underline-offset-2 transition-colors inline-flex items-baseline"
      >
        {span.matchedText}
      </Link>
    );

    lastIndex = span.end;
  });

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return <p className={className}>{elements}</p>;
}
