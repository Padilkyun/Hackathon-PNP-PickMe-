'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, FileText, Activity, Settings, Shield, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Integrity Check', href: '/admin/integrity', icon: Shield },
  { name: 'Asisten AI', href: '/admin/chatbot', icon: Bot },
  { name: 'Laporan', href: '/admin/reports', icon: FileText },
  { name: 'Sentimen', href: '/admin/sentiment', icon: Activity },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link
          href="/admin"
          className="text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple rounded-lg px-1"
        >
          GARUDA<span className="text-neon-purple">.</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 block rounded-lg px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
                    isActive(item.href)
                      ? 'text-neon-purple'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          onClick={() => onMenuClick?.()}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Buka menu utama"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-[57px] z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              onClick={() => setOpen(false)}
              autoFocus
              aria-label="Tutup menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-neon-purple'
                      : 'text-slate-100 hover:bg-slate-800'
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
