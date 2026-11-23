'use client';

import Link from 'next/link';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
  userEmail?: string;
}

export function Header({ onMenuClick, userName = 'Admin PNP', userEmail = 'admin@pnp.go.id' }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/50">
      <nav className="mx-auto max-w-7xl flex items-center justify-between h-full px-4 sm:px-6 lg:px-8" aria-label="Header">
        <Link
          href="/admin"
          className="text-xl font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple rounded-lg px-1 transition-transform hover:scale-[1.02]"
          aria-label="GARUDA Dashboard"
        >
          GARUDA<span className="text-neon-purple">.</span>
        </Link>

        <div className="hidden lg:flex items-center gap-4">
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
              3
            </span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50"
              aria-label="Menu pengguna"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
          onClick={() => onMenuClick?.()}
          aria-expanded="false"
          aria-controls="mobile-menu"
          aria-label="Buka menu navigasi"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
