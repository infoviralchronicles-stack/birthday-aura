import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  FileText,
  Rss,
  Users,
  Eye,
  PlusCircle,
  Play,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalArticles,
    totalSources,
    totalSubscribers,
    recentArticles,
    recentLogs,
    activeSources,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.source.count(),
    prisma.newsletterSubscriber.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.automationLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { source: true },
    }),
    prisma.source.findMany({
      where: { isActive: true },
      include: { category: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-gray-950 dark:text-white">
            Editorial Operations Dashboard
          </h1>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
            Birthday Aura Syndication & Publishing Network
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 rounded-xl bg-gold-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors flex items-center shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" /> Compose Dispatch
          </Link>
          <a
            href="/api/cron/ingest?secret=Birthday Aura_cron_token_secure"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white dark:bg-editorial-subtle border border-gray-200 dark:border-editorial-cardDarkBorder text-xs font-mono font-semibold hover:border-gold-500 transition-colors flex items-center"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 text-gold-500" /> Run All Feeds Now
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Total Dispatches</span>
            <FileText className="w-4 h-4 text-gold-500" />
          </div>
          <p className="text-3xl font-serif font-black text-gray-950 dark:text-white mt-2">
            {totalArticles}
          </p>
          <span className="text-[11px] text-emerald-500 font-mono mt-1 block">Live in circulation</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Active Wire Feeds</span>
            <Rss className="w-4 h-4 text-gold-500" />
          </div>
          <p className="text-3xl font-serif font-black text-gray-950 dark:text-white mt-2">
            {totalSources}
          </p>
          <span className="text-[11px] text-gold-500 font-mono mt-1 block">Automated syndication</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">VIP Subscribers</span>
            <Users className="w-4 h-4 text-gold-500" />
          </div>
          <p className="text-3xl font-serif font-black text-gray-950 dark:text-white mt-2">
            {totalSubscribers}
          </p>
          <span className="text-[11px] text-emerald-500 font-mono mt-1 block">Private circulation</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Syndication Pipeline</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400 mt-2">
            Online
          </p>
          <span className="text-[11px] text-gray-400 font-mono mt-1 block">Autonomous engine active</span>
        </div>
      </div>

      {/* Two Column Section: Recent Articles & Automation Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Articles (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-editorial-cardDarkBorder">
            <h3 className="text-sm font-serif font-bold text-gray-950 dark:text-white">
              Latest Editorial Dispatches
            </h3>
            <Link href="/admin/articles" className="text-xs font-mono text-gold-600 dark:text-gold-400 hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-editorial-cardDarkBorder">
            {recentArticles.map((art) => (
              <div key={art.id} className="py-3 flex items-center justify-between text-xs">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {art.title}
                  </p>
                  <span className="text-gray-400 font-mono text-[11px]">
                    {art.category.name} &bull; {formatDate(art.createdAt)}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                  art.status === 'PUBLISHED'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  {art.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Automation Logs & Trigger Desk (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-editorial-cardDark border border-gray-200 dark:border-editorial-cardDarkBorder space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-editorial-cardDarkBorder">
            <h3 className="text-sm font-serif font-bold text-gray-950 dark:text-white">
              Automation Telemetry
            </h3>
            <Link href="/admin/logs" className="text-xs font-mono text-gold-600 dark:text-gold-400 hover:underline flex items-center">
              View Full Logs <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-editorial-cardDarkBorder text-xs font-mono">
            {recentLogs.length === 0 ? (
              <p className="text-gray-400 py-4">No recent ingestion logs recorded.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-start space-x-3">
                  {log.status === 'SUCCESS' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-gray-200 truncate">{log.message}</p>
                    <span className="text-[10px] text-gray-400">
                      {log.source?.name || 'Manual sync'} &bull; {formatDate(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

