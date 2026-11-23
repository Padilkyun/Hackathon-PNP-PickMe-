'use client';

import { ReactNode, useState, useEffect } from 'react';
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
  ChevronRight,
  User,
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setSidebarOpen(saved === 'true');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarOpen', sidebarOpen.toString());
    }
  }, [sidebarOpen, mounted]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const sidebarWidth = sidebarOpen ? '16rem' : '4.5rem';

  if (!mounted) {
    return (
      <>
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="lg:pl-64 pt-16 min-h-screen bg-slate-900 text-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      <aside
        className="fixed inset-y-0 left-0 z-40 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/50 transition-all duration-300 ease-in-out lg:translate-x-0"
        style={{ width: sidebarWidth }}
        aria-label="Sidebar navigasi"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center h-16 px-4 border-b border-slate-800/50">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple rounded-lg px-1"
            >
              <span className="text-xl font-bold tracking-tight">GARUDA<span className="text-neon-purple">.</span></span>
              {sidebarOpen && (
                <span className="text-sm font-medium text-slate-400 whitespace-nowrap">Admin</span>
              )}
            </Link>
            <button
              type="button"
              className={cn(
                'ml-auto inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50'
              )}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto" aria-label="Menu utama">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                    active
                      ? 'bg-slate-800/50 text-neon-purple'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  title={sidebarOpen ? undefined : item.name}
                >
                  <Icon className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors duration-200',
                    active ? 'text-neon-purple' : 'text-slate-400'
                  )} aria-hidden="true" />
                  {sidebarOpen && (
                    <span className={cn(
                      'truncate transition-opacity duration-200',
                      active ? 'text-neon-purple font-medium' : ''
                    )}>
                      {item.name}
                    </span>
                  )}
                  {active && sidebarOpen && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-neon-purple rounded-r-full" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800/50">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 px-2 py-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-100 truncate font-medium">Admin PNP</p>
                  <p className="text-xs text-slate-500 truncate">admin@pnp.go.id</p>
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50"
                  aria-label="Keluar"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </div>
              </div>
            )}
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
        className="fixed bottom-6 left-6 z-40 lg:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800/50 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Buka menu navigasi"
      >
        <LayoutDashboard className="h-6 w-6" />
      </button>

      <main
        className="pt-16 min-h-screen bg-slate-900 text-slate-100 transition-all duration-300 lg:transition-all"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </>
  );
}
