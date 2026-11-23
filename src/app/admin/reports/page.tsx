'use client';
import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { mockReports, ReportStatus, PriorityLevel, getStatusColor, getPriorityColor, getPriorityLabel, getVerdictColor, getVerdictLabel } from '@/lib/data/reports';
import { ReportCard } from '@/components/admin/ReportCard';

const STATUS_TABS: { label: string; value: ReportStatus | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const PRIORITY_TABS: { label: string; value: PriorityLevel | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'Tinggi', value: 'high' },
  { label: 'Normal', value: 'normal' },
  { label: 'Rendah', value: 'low' },
];

export default function AdminReportsPage() {
  const [statusTab, setStatusTab] = useState<ReportStatus | 'all'>('all');
  const [priorityTab, setPriorityTab] = useState<PriorityLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'votes' | 'priority'>('newest');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockReports.filter((r) => {
    const matchStatus = statusTab === 'all' || r.status === statusTab;
    const matchPriority = priorityTab === 'all' || r.priority === priorityTab;
    const matchSearch = search === '' || r.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case 'oldest': return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case 'votes': return b.votes - a.votes;
      case 'priority': {
        const p = { urgent: 4, high: 3, normal: 2, low: 1 };
        return p[b.priority] - p[a.priority];
      }
    }
  });

  const stats = {
    pending: mockReports.filter(r => r.status === 'pending').length,
    reviewing: mockReports.filter(r => r.status === 'reviewing').length,
    approved: mockReports.filter(r => r.status === 'approved').length,
    rejected: mockReports.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Kelola Laporan</h1>
          <p className="text-slate-400 mt-1">{sorted.length} laporan ditemukan</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari judul berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-10 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/30 border border-slate-700 text-sm text-slate-300 hover:border-slate-600 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="votes">Voting Terbanyak</option>
              <option value="priority">Prioritas</option>
            </select>
            <div className="flex items-center gap-1 border border-slate-700 rounded-xl bg-slate-800/30">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-xl transition-colors ${viewMode === 'card' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4 animate-in slide-down duration-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider px-3 py-1">Status</span>
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setStatusTab(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusTab === t.value
                    ? 'bg-slate-800 text-slate-100 border border-slate-600'
                    : 'bg-slate-800/30 text-slate-300 border border-slate-800 hover:border-slate-600'
                }`}
              >
                {t.label} ({stats[t.value as keyof typeof stats] ?? 0})
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider px-3 py-1">Prioritas</span>
            {PRIORITY_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setPriorityTab(t.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  priorityTab === t.value
                    ? `${getPriorityColor(t.value as PriorityLevel)} border border-current`
                    : 'bg-slate-800/30 text-slate-300 border border-slate-800 hover:border-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
        <div className="flex items-center gap-4 text-sm">
          {[
            { key: 'pending', label: 'Pending', color: 'text-slate-400' },
            { key: 'reviewing', label: 'Review', color: 'text-amber-400' },
            { key: 'approved', label: 'Valid', color: 'text-emerald-400' },
            { key: 'rejected', label: 'Hoaks', color: 'text-red-400' },
          ].map((s) => (
            <span key={s.key} className={`flex items-center gap-1 ${s.color}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {stats[s.key as keyof typeof stats]}
            </span>
          ))}
        </div>
        <div className="text-sm text-slate-500">
          {sorted.length === 0 ? 'Tidak ada laporan' : `Menampilkan ${sorted.length} dari ${mockReports.length} laporan`}
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
          {sorted.length === 0 && (
            <div className="col-span-full rounded-xl bg-slate-800/30 border border-slate-800/50 p-12 text-center text-slate-400">
              Tidak ada laporan untuk filter ini.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Laporan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Prioritas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">AI Verdict</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Waktu</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sorted.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-100 truncate max-w-xs">{r.title}</p>
                    <p className="text-xs text-slate-400 truncate max-w-xs">{r.source}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getPriorityColor(r.priority)}`}>
                      {getPriorityLabel(r.priority)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-slate-400">{r.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${getStatusColor(r.status)}`}>
                      <span className="capitalize">{r.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {r.llmAnalysis && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getVerdictColor(r.llmAnalysis.suggestedVerdict)}`}>
                        <span className="capitalize">{getVerdictLabel(r.llmAnalysis.suggestedVerdict)}</span>
                      </span>
                    )}
                    {!r.llmAnalysis && <span className="text-slate-500 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {new Date(r.submittedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a href={`/admin/reports/${r.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-colors">
                      <span>Detail</span>
                    </a>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada laporan untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}