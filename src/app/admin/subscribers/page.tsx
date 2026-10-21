import React from 'react';
import { prisma } from '@/lib/prisma';
import { Users, Mail, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-amber-500" />
            VIP Subscribers
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Institutional investors, bullion collectors, and macro analysts subscribed to Birthday Aura Dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            {subscribers.length} Registered Readers
          </span>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white text-base">Subscriber Directory</h2>
          <span className="text-xs text-slate-400 font-mono">Sync: Instant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-medium">Subscriber Email</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium">Date Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500">
                    No subscribers recorded yet. Readers can join via the site footer.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                      {sub.email}
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          UNSUBSCRIBED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


