export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]+/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function estimateReadingTime(content: string): number {
  const words = (content || '').replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncateText(text: string, maxChars: number = 160): string {
  if (!text) return '';
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).trim() + '...';
}
