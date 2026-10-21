'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    featuredImage: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    isFeatured: false,
    isTrending: false,
    isEditorsPick: false,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    // Default categories fetch or fallback
    fetch('/api/sources')
      .then((res) => res.json())
      .then((data) => {
        if (data.sources && data.sources.length > 0) {
          const cats = data.sources.map((s: any) => s.category).filter(Boolean);
          const uniqueCats = Array.from(new Map(cats.map((c: any) => [c.id, c])).values());
          setCategories(uniqueCats);
          if (uniqueCats[0]) {
            setFormData((prev) => ({ ...prev, categoryId: (uniqueCats[0] as any).id }));
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.article) {
        router.push(`/article/${data.article.slug}`);
      } else {
        alert(data.error || 'Failed to save article');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="text-xs font-mono text-gray-500 hover:text-gold-500 flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dispatches
        </Link>
        <span className="text-xs font-mono text-gold-600 dark:text-gold-400 font-bold uppercase">
          New Editorial Dispatch
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Editor Card */}
        <div className="p-8 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
              Article Headline
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sovereign Vault Dynamics: Central Bank Bullion Reallocation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
              Lead Synopsis / Excerpt
            </label>
            <textarea
              rows={2}
              required
              placeholder="A concise 1-2 sentence lead briefing for front-page feeds..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                Dossier Category
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-editorial-subtle text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 font-sans"
              >
                {categories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
                Publishing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-editorial-subtle text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 font-sans"
              >
                <option value="PUBLISHED">Published (Live to readership)</option>
                <option value="DRAFT">Draft (Save privately)</option>
                <option value="PENDING_REVIEW">Pending Editorial Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
              Featured Image URL
            </label>
            <input
              type="url"
              required
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
              Article Content (HTML / Rich Format)
            </label>
            <textarea
              rows={12}
              required
              placeholder="<p class='lead'>Your article lead paragraph...</p><h2>Subheading</h2><p>Analysis details...</p>"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>

          {/* Curation Flags */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 dark:border-editorial-cardDarkBorder text-xs font-mono">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span>Feature on Front Lead</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span>Trending Stream</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isEditorsPick}
                onChange={(e) => setFormData({ ...formData, isEditorsPick: e.target.checked })}
                className="rounded border-gray-300 text-gold-500 focus:ring-gold-500"
              />
              <span>Editor&apos;s Pick Badge</span>
            </label>
          </div>
        </div>

        {/* SEO Meta Box */}
        <div className="p-8 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-editorial-cardDarkBorder pb-3">
            <h3 className="text-sm font-serif font-bold text-gray-950 dark:text-white">
              SEO Engine & SERP Simulation
            </h3>
            <span className="text-[10px] font-mono uppercase text-gray-400">Google Preview</span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
              Meta Title Tag
            </label>
            <input
              type="text"
              placeholder={formData.title ? `${formData.title} | Birthday Aura` : ''}
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">
              Meta Description Tag
            </label>
            <textarea
              rows={2}
              placeholder={formData.excerpt || 'Meta summary for search engines...'}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gold-500 font-sans"
            />
          </div>

          {/* SERP Preview Box */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-editorial-subtle border border-gray-200 dark:border-gray-800">
            <p className="text-[11px] text-gray-500 font-mono">https://Birthday Aura.com &gt; article &gt; {formData.title ? 'slug' : 'preview'}</p>
            <h4 className="text-base text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium mt-0.5 truncate">
              {formData.metaTitle || formData.title || 'Birthday Aura Article Title'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {formData.metaDescription || formData.excerpt || 'Article summary description snippet in Google search results.'}
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/articles"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-gray-100 dark:hover:bg-editorial-subtle transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-gold-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors flex items-center space-x-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{loading ? 'Transmitting...' : 'Save & Distribute'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

