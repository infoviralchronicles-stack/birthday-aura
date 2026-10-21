import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import {
  LayoutDashboard,
  FileText,
  Rss,
  Activity,
  Users,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Dispatches & Articles', href: '/admin/articles', icon: FileText },
    { name: 'RSS & API Sources', href: '/admin/sources', icon: Rss },
    { name: 'Automation Logs', href: '/admin/logs', icon: Activity },
    { name: 'Newsletter Subscribers', href: '/admin/subscribers', icon: Users },
    { name: 'Site Settings & AdSense', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#070809] flex flex-col md:flex-row text-gray-900 dark:text-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-editorial-cardDark border-r border-gray-200 dark:border-editorial-cardDarkBorder flex flex-col justify-between">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-gray-100 dark:border-editorial-cardDarkBorder">
            <Link href="/" className="group flex items-center space-x-2">
              <Shield className="w-5 h-5 text-gold-500" />
              <span className="font-serif font-black tracking-wider text-sm uppercase">
                Gold<span className="gold-gradient-text">Magazines</span>
              </span>
            </Link>
            <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">
              Editorial CMS & Engine
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-mono font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick External Link */}
        <div className="p-4 border-t border-gray-100 dark:border-editorial-cardDarkBorder space-y-2">
          {user ? (
            <div className="px-3 py-2 text-xs font-mono">
              <p className="text-gray-400">Signed in as:</p>
              <p className="font-bold truncate text-gold-600 dark:text-gold-400">{user.email}</p>
            </div>
          ) : (
            <div className="px-3 py-2 text-xs font-mono text-amber-500">
              Session: Development Mode
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-editorial-subtle transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
