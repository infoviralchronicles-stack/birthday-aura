import React from 'react';
import { prisma } from '@/lib/prisma';
import { Radio, Plus, RefreshCw, CheckCircle2, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminSourcesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany();

  async function addSourceAction(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    let categoryId = formData.get('categoryId') as string;
    const intervalMinutes = parseInt((formData.get('intervalMinutes') as string) || '60', 10);

    if (name && url) {
      if (!categoryId) {
        const defaultCat = await prisma.category.findFirst();
        categoryId = defaultCat ? defaultCat.id : '';
      }

      await prisma.source.create({
        data: {
          name,
          url,
          categoryId,
          fetchIntervalMinutes: intervalMinutes,
          isActive: true,
        },
      });
      revalidatePath('/admin/sources');
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
            <Radio className="w-7 h-7 text-amber-500" />
            RSS & Wire Feeds
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure automated ingestion streams from precious metals wires, central banks, and market research feeds.
          </p>
        </div>

        <Link
          href="/api/cron/ingest?secret=Birthday Aura_cron_token_secure"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Trigger Wire Ingest Now
        </Link>
      </div>

      {/* Grid: Add Source + Current Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to add source */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Add Wire Stream
            </h2>

            <form action={addSourceAction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Feed Title
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. World Gold Council Dispatches"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  RSS/XML Feed URL
                </label>
                <input
                  name="url"
                  type="url"
                  required
                  placeholder="https://example.com/rss.xml"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Default Target Category
                </label>
                <select
                  name="categoryId"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/60"
                >
                  <option value="">Auto-Detect / General</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                  Poll Frequency (Minutes)
                </label>
                <input
                  name="intervalMinutes"
                  type="number"
                  defaultValue={60}
                  min={15}
                  max={1440}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold rounded-xl text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/10 mt-2"
              >
                Register RSS Source
              </button>
            </form>
          </div>
        </div>

        {/* Existing sources table */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold text-white text-base">Configured Feeds ({sources.length})</h2>
              <span className="text-xs text-slate-400 font-mono">Status: Automated</span>
            </div>

            <div className="divide-y divide-slate-800">
              {sources.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No wire feeds registered yet. Add one to activate automatic publishing.
                </div>
              ) : (
                sources.map((source) => (
                  <div key={source.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{source.name}</span>
                        {source.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                            Paused
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 font-mono break-all">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Globe className="w-3 h-3 shrink-0" />
                          {source.url}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Every {source.fetchIntervalMinutes}m
                        </span>
                        {source.lastFetchedAt ? (
                          <span>Last polled: {new Date(source.lastFetchedAt).toLocaleTimeString()}</span>
                        ) : (
                          <span>Never polled yet</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        href={`/api/cron/ingest?secret=Birthday Aura_cron_token_secure`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      >
                        Poll Now
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

