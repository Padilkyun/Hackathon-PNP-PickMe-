'use client';
import { useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockReports } from '@/lib/data/reports';
import { ReportCard } from '@/components/admin/ReportCard';

export default function AdminSentimentPage() {
  const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');

  const filtered = filter === 'all'
    ? mockReports
    : mockReports.filter((r) => r.sentiment.label === filter);

  const total = mockReports.length;
  const positiveCount = mockReports.filter(r => r.sentiment.label === 'positive').length;
  const neutralCount = mockReports.filter(r => r.sentiment.label === 'neutral').length;
  const negativeCount = mockReports.filter(r => r.sentiment.label === 'negative').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Dashboard Sentimen</h1>
        <p className="text-slate-400 mt-1">Analisis sentimen publik terhadap berita</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-slate-800/30 border border-slate-800/50 p-5">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-slate-300" />
            <h3 className="text-slate-400 text-sm">Total Laporan</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50">{total}</p>
        </div>
        <div className="rounded-xl bg-slate-800/30 border border-slate-800/50 p-5">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="text-emerald-400 text-sm">Positif</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50">{positiveCount}</p>
          <p className="text-sm text-slate-400">{Math.round(positiveCount/total*100)}%</p>
        </div>
        <div className="rounded-xl bg-slate-800/30 border border-slate-800/50 p-5">
          <div className="flex items-center space-x-2 mb-2">
            <Minus className="h-5 w-5 text-yellow-400" />
            <h3 className="text-yellow-400 text-sm">Netral</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50">{neutralCount}</p>
          <p className="text-sm text-slate-400">{Math.round(neutralCount/total*100)}%</p>
        </div>
        <div className="rounded-xl bg-slate-800/30 border border-slate-800/50 p-5">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            <h3 className="text-red-400 text-sm">Negatif</h3>
          </div>
          <p className="text-3xl font-bold text-slate-50">{negativeCount}</p>
          <p className="text-sm text-slate-400">{Math.round(negativeCount/total*100)}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'positive', 'neutral', 'negative'] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-slate-800 text-slate-100 border border-slate-600'
                  : 'bg-slate-800/30 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >{f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl bg-slate-800/30 border border-slate-800/50 p-12 text-center text-slate-400">
            Tidak ada laporan untuk filter ini.
          </div>
        )}
      </div>
    </div>
  );
}
