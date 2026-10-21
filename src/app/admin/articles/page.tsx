import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { PlusCircle, ExternalLink, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-gray-950 dark:text-white">
            Editorial Dispatches ({articles.length})
          </h1>
          <p className="text-xs font-mono text-gray-500">
            Manage, review, edit, and audit published intelligence.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="px-4 py-2 rounded-xl bg-gold-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors flex items-center shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" /> Compose New
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-gray-50 dark:bg-editorial-subtle border-b border-gray-200 dark:border-editorial-cardDarkBorder uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Title & Slug</th>
                <th className="px-6 py-4">Dossier</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-editorial-cardDarkBorder text-gray-700 dark:text-gray-300">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-gray-50/50 dark:hover:bg-editorial-subtle/50 transition-colors">
                  <td className="px-6 py-4 font-sans max-w-sm">
                    <p className="font-bold text-gray-950 dark:text-white truncate">{art.title}</p>
                    <p className="text-[11px] font-mono text-gray-400 truncate">/{art.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white" style={{ backgroundColor: art.category.color }}>
                      {art.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {art.author.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      art.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-[11px]">
                    {formatDate(art.publishedAt || art.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/article/${art.slug}`}
                      target="_blank"
                      className="p-1.5 inline-flex text-gray-400 hover:text-gold-500 transition-colors"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
