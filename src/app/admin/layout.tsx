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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
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
      
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/80 backdrop-blur-sm border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
        aria-label="Sidebar navigasi"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/50">
            <Link
              href="/admin"
              className="text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple rounded-lg px-1"
            >
              GARUDA<span className="text-neon-purple">.</span>
            </Link>
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup sidebar"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
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
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
                    isActive(item.href)
                      ? 'bg-slate-800 text-neon-purple border border-slate-700'
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
            <div className="rounded-xl bg-slate-800/30 border border-slate-800/50 p-3">
              <p className="text-xs text-slate-400 mb-2">Fitur Baru</p>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="h-3 w-3 text-amber-400 flex-shrink-0" />
                <span>Integrity Check & AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        className="lg:pl-64 pt-20 min-h-screen bg-slate-900 text-slate-100 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '16rem' : '0' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </>
  );
}
