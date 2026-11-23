'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Activity,
  Settings,
  Shield,
  Bot,
  ChevronLeft,
  LogOut,
  User,
  Bell,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Integrity Check', href: '/admin/integrity', icon: Shield },
  { name: 'Asisten AI', href: '/admin/chatbot', icon: Bot },
  { name: 'Laporan', href: '/admin/reports', icon: FileText },
  { name: 'Sentimen', href: '/admin/sentiment', icon: Activity },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      <aside
        className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        aria-label="Sidebar navigasi"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center h-16 px-4 border-b border-slate-800/50">
            <Link
              href="/admin"
              className="text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple rounded-lg px-1"
            >
              GARUDA<span className="text-neon-purple">.</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Menu utama">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
                    isActive(item.href)
                      ? 'bg-slate-800 text-neon-purple'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800/50">
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 truncate font-medium">Admin PNP</p>
                <p className="text-xs text-slate-500 truncate">admin@pnp.go.id</p>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        className="fixed bottom-6 left-6 z-40 lg:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/50 shadow-lg"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Buka menu navigasi"
      >
        <LayoutDashboard className="h-6 w-6" />
      </button>

      <main
        className="lg:pl-64 pt-20 min-h-screen bg-slate-900 text-slate-100"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </>
  );
}
