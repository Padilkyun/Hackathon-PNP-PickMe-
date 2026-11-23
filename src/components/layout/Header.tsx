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
    <header className="fixed inset-x-0 top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/50">
      <nav className="mx-auto max-w-7xl flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link
          href="/admin"
          className="text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple rounded-lg px-1 transition-transform hover:scale-[1.02]"
          aria-label="GARUDA Dashboard"
        >
          GARUDA<span className="text-neon-purple">.</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-3 py-2.5',
                    'transition-all duration-200 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
                    active
                      ? 'text-neon-purple bg-slate-800/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neon-purple/10'
                  )}
                  style={{
                    transformOrigin: 'center bottom',
                  } as React.CSSProperties}
                >
                  <Icon className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                    active ? 'text-neon-purple' : 'text-slate-400 group-hover:text-white'
                  )} aria-hidden="true" />
                  <span className={cn(
                    'font-medium tracking-wide',
                    active ? 'text-neon-purple' : ''
                  )}>
                    {item.name}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" aria-hidden="true" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
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
          className="lg:hidden fixed inset-0 top-[57px] z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm p-6 animate-slideDown"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
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
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium transition-all duration-200',
                    active
                      ? 'text-neon-purple bg-slate-800/50'
                      : 'text-slate-100 hover:bg-slate-800 hover:scale-[1.02] hover:pl-1'
                  )}
                  onClick={() => setOpen(false)}
                >
                  <Icon className={cn('w-5 h-5 transition-transform duration-200', active ? 'text-neon-purple' : 'text-slate-400')} aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
