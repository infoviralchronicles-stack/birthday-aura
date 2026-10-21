import React from 'react';
import { prisma } from '@/lib/prisma';
import { Terminal, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLogsPage() {
  const logs = await prisma.automationLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: { source: true },
    take: 50,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
            <Terminal className="w-7 h-7 text-amber-500" />
            Ingestion Logs & Telemetry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time execution log of RSS polling jobs, duplicate filtering, AI synthesis, and publication events.
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

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white text-base">Recent Feed Runs ({logs.length})</h2>
          <span className="text-xs text-slate-400 font-mono">Retained events: 50 max</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-medium">Timestamp</th>
                <th className="py-3.5 px-4 font-medium">Feed Name</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium">Found</th>
                <th className="py-3.5 px-4 font-medium">Created</th>
                <th className="py-3.5 px-4 font-medium">Details / Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No ingestion log entries yet. Run a wire ingest to generate events.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {log.source?.name || 'Manual Ingestion'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.status === 'SUCCESS' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans">
                          <CheckCircle2 className="w-3 h-3" /> SUCCESS
                        </span>
                      )}
                      {log.status === 'PARTIAL' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-sans">
                          <AlertTriangle className="w-3 h-3" /> PARTIAL
                        </span>
                      )}
                      {log.status === 'FAILED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-sans">
                          <XCircle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.articlesFound}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{log.articlesCreated}</td>
                    <td className="py-3 px-4 max-w-md truncate text-slate-400 font-sans">
                      <span>{log.message}</span>
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


