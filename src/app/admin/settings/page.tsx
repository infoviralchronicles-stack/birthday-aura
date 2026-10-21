import React from 'react';
import { prisma } from '@/lib/prisma';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settingsRecords = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  async function saveSettingsAction(formData: FormData) {
    'use server';
    const keys = [
      'site_name',
      'site_description',
      'adsense_client_id',
      'contact_email',
      'auto_publish_articles',
    ];

    for (const key of keys) {
      const val = formData.get(key) as string;
      if (val !== undefined && val !== null) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: val },
          create: { key, value: val },
        });
      }
    }

    revalidatePath('/admin/settings');
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white flex items-center gap-3">
          <Sliders className="w-7 h-7 text-amber-500" />
          Platform Configuration
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Control editorial metadata, Google AdSense integration, automated publishing rules, and institutional contacts.
        </p>
      </div>

      <form action={saveSettingsAction} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Publication Name
          </label>
          <input
            name="site_name"
            type="text"
            defaultValue={settings['site_name'] || 'Birthday Aura'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Publication Meta Tagline / Description
          </label>
          <textarea
            name="site_description"
            rows={3}
            defaultValue={settings['site_description'] || 'The Premier Authority on Physical Gold, Macroeconomics, Mining Assets, and Sovereign Reserves.'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Google AdSense Client ID
            </label>
            <input
              name="adsense_client_id"
              type="text"
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              defaultValue={settings['adsense_client_id'] || 'ca-pub-3940256099942544'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500/60"
            />
            <p className="text-[11px] text-slate-500 mt-1">Populates the AdSense verification tags and high-yield display banners.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Editorial Contact Email
            </label>
            <input
              name="contact_email"
              type="email"
              defaultValue={settings['contact_email'] || 'editor@Birthday Aura.com'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60"
            />
            <p className="text-[11px] text-slate-500 mt-1">Displayed across masthead colophons and compliance disclosures.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Automated Ingestion Publishing Policy
          </label>
          <select
            name="auto_publish_articles"
            defaultValue={settings['auto_publish_articles'] || 'true'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60"
          >
            <option value="true">Direct to Wire (Auto-Publish as PUBLISHED)</option>
            <option value="false">Staff Review First (Save as DRAFT)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Choose whether RSS ingested stories are immediately public or held for manual editor review.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-semibold text-xs uppercase tracking-wider hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/10"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}

