import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-900/30 py-10">
      <div className="mx-auto max-w-7xl flex flex-col items-center space-y-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <Sparkles className="h-4 w-4 text-slate-500" />
          <span>Powered by PICKME GARUDA – Juara 1 Hackathon PNP</span>
        </div>
        <a href="https://github.com/your-org/pickme-garuda" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          © 2026 PICKME GARUDA. All rights reserved.
        </a>
      </div>
    </footer>
  );
}
