'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Users, FileText, Shield, CheckCircle, XCircle, Clock, Eye, ArrowUpRight, Zap, Brain, Flag, ThumbsUp } from 'lucide-react';
import { mockReports, getStatusColor, getSentimentBg, getSentimentColor, getVerdictColor, getVerdictLabel, getPriorityColor, getPriorityLabel } from '@/lib/data/reports';

const stats = {
  total: mockReports.length,
  pending: mockReports.filter(r => r.status === 'pending').length,
  reviewing: mockReports.filter(r => r.status === 'reviewing').length,
  approved: mockReports.filter(r => r.status === 'approved').length,
  rejected: mockReports.filter(r => r.status === 'rejected').length,
  urgent: mockReports.filter(r => r.priority === 'urgent').length,
  high: mockReports.filter(r => r.priority === 'high').length,
  totalVotes: mockReports.reduce((sum, r) => sum + r.votes, 0),
  aiAccuracy: mockReports.filter(r => r.llmAnalysis).length / mockReports.length,
};

const kpiCards = [
  { label: 'Total Laporan', value: stats.total.toLocaleString(), change: '+12.5%', trend: 'up', icon: FileText, color: 'text-slate-300' },
  { label: 'Terverifikasi', value: (stats.approved + stats.rejected).toLocaleString(), change: '+8.2%', trend: 'up', icon: CheckCircle, color: 'text-emerald-400' },
  { label: 'Menunggu Review', value: (stats.pending + stats.reviewing).toLocaleString(), change: '-3.4%', trend: 'down', icon: Clock, color: 'text-amber-400' },
  { label: 'Akurasi AI', value: `${Math.round(stats.aiAccuracy * 100)}%`, change: '+1.8%', trend: 'up', icon: Brain, color: 'text-slate-300' },
];

const sentimentTrend = [
  { day: 'Sen', positive: 45, neutral: 30, negative: 25 },
  { day: 'Sel', positive: 52, neutral: 28, negative: 20 },
  { day: 'Rab', positive: 48, neutral: 32, negative: 20 },
  { day: 'Kam', positive: 61, neutral: 24, negative: 15 },
  { day: 'Jum', positive: 55, neutral: 28, negative: 17 },
  { day: 'Sab', positive: 67, neutral: 21, negative: 12 },
  { day: 'Min', positive: 72, neutral: 18, negative: 10 },
];

const priorityData = [
  { label: 'Urgent', value: stats.urgent, color: 'red' },
  { label: 'Tinggi', value: stats.high, color: 'amber' },
  { label: 'Normal', value: mockReports.filter(r => r.priority === 'normal').length, color: 'slate' },
  { label: 'Rendah', value: mockReports.filter(r => r.priority === 'low').length, color: 'slate' },
];

const verdictData = [
  { label: 'Valid', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'valid').length, color: 'emerald' },
  { label: 'Hoaks', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'hoaks').length, color: 'red' },
  { label: 'Misleading', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'misleading').length, color: 'amber' },
  { label: 'Belum Konfirmasi', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'unconfirmed').length, color: 'slate' },
];

function AnimatedNumber({ value, duration = 1000 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue)) {
      setDisplay(value);
      return;
    }

    const startTime = Date.now();
    const suffix = value.replace(/[\d.,]/g, '');

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = numericValue * progress;

      if (value.includes('%')) {
        setDisplay(`${current.toFixed(1)}%`);
      } else if (value.includes(',')) {
        setDisplay(`${Math.floor(current).toLocaleString()}`);
      } else {
        setDisplay(`${Math.floor(current)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };

    animate();
  }, [value, duration]);

  return <span>{display}</span>;
}

function SentimentChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxValue = Math.max(...sentimentTrend.flatMap(d => [d.positive, d.neutral, d.negative]));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-48 gap-2">
        {sentimentTrend.map((data, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 group"
            onMouseEnter={() => setHoveredBar(i)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <div className="w-full flex flex-col items-stretch h-full justify-end gap-0.5">
              <div
                className="bg-emerald-500 rounded-t-sm transition-all duration-500 ease-out"
                style={{
                  height: hoveredBar === i ? `${(data.positive / maxValue) * 100}%` : `${(data.positive / maxValue) * 80}%`,
                  opacity: hoveredBar === i ? 1 : 0.7,
                }}
              />
              <div
                className="bg-amber-500 transition-all duration-500 ease-out"
                style={{
                  height: hoveredBar === i ? `${(data.neutral / maxValue) * 100}%` : `${(data.neutral / maxValue) * 80}%`,
                  opacity: hoveredBar === i ? 1 : 0.5,
                }}
              />
              <div
                className="bg-red-500 rounded-b-sm transition-all duration-500 ease-out"
                style={{
                  height: hoveredBar === i ? `${(data.negative / maxValue) * 100}%` : `${(data.negative / maxValue) * 80}%`,
                  opacity: hoveredBar === i ? 1 : 0.7,
                }}
              />
            </div>
            <span className="text-xs text-slate-500 mt-2">{data.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-slate-400">Positif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-slate-400">Netral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-slate-400">Negatif</span>
        </div>
      </div>
    </div>
  );
}

function PriorityChart() {
  const maxValue = Math.max(...priorityData.map(d => d.value));
  return (
    <div className="space-y-3">
      {priorityData.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-20 text-sm text-slate-300">{item.label}</span>
          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%', backgroundColor: `var(--color-${item.color}-500)` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-slate-300">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function VerdictChart() {
  const maxValue = Math.max(...verdictData.map(d => d.value));
  return (
    <div className="space-y-3">
      {verdictData.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-28 text-sm text-slate-300 capitalize">{item.label.toLowerCase()}</span>
          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%', backgroundColor: `var(--color-${item.color}-500)` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-slate-300">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function LiveActivity() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'approved', user: 'admin@pnp', target: 'Banjir Jakarta', time: '2 menit lalu' },
    { id: 2, type: 'rejected', user: 'admin@pnp', target: 'Vaksin 100% aman', time: '5 menit lalu' },
    { id: 3, type: 'review', user: 'system', target: 'BMKG Press Release', time: '8 menit lalu' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['approved', 'rejected', 'review'][Math.floor(Math.random() * 3)],
        user: 'admin@pnp',
        target: ['Berita Politik', 'Ekonomi', 'Kesehatan', 'Olahraga'][Math.floor(Math.random() * 4)],
        time: 'Baru saja',
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Eye className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, i) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 transition-all duration-300"
          style={{
            animation: i === 0 ? 'slideIn 0.5s ease-out' : undefined,
            opacity: 1 - i * 0.15,
          }}
        >
          {getIcon(activity.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200 truncate">
              <span className="text-slate-400">{activity.user}</span>
              {' '}
              {activity.type === 'approved' ? 'menyetujui' : activity.type === 'rejected' ? 'menolak' : 'meriview'}
              {' '}
              <span className="font-medium">{activity.target}</span>
            </p>
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const latest = mockReports.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitoring real-time aktivitas verifikasi berita</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <div
            key={i}
            className="group relative bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-700/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs ${kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-50 mb-1">
                <AnimatedNumber value={kpi.value} />
              </div>
              <div className="text-sm text-slate-400">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/30 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-50">Tren Sentimen 7 Hari</h2>
              <p className="text-sm text-slate-400 mt-0.5">Distribusi sentimen publik terhadap berita</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Real-time</span>
            </div>
          </div>
          <SentimentChart />
        </div>

        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-50">Aktivitas Live</h2>
            <Activity className="w-4 h-4 text-slate-400 animate-pulse" />
          </div>
          <LiveActivity />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-50">Distribusi Prioritas</h2>
            <Flag className="w-4 h-4 text-slate-400" />
          </div>
          <PriorityChart />
        </div>

        <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 hover:border-slate-600/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-50">Saran AI Verdict</h2>
            <Brain className="w-4 h-4 text-slate-400" />
          </div>
          <VerdictChart />
        </div>
      </div>

      <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-50">Laporan Prioritas Tertinggi</h2>
          <a href="/admin/reports" className="text-sm text-slate-300 hover:text-slate-100 inline-flex items-center gap-1 group">
            Lihat semua
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
        <div className="space-y-3">
          {latest.map((report, i) => {
            const statusBadge = getStatusColor(report.status);
            const sentimentStyle = getSentimentBg(report.sentiment.label);
            const sentimentText = getSentimentColor(report.sentiment.label);
            return (
              <a
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${statusBadge}`}>
                    {report.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                    {report.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {report.status === 'pending' && <Clock className="w-3 h-3" />}
                    {report.status === 'reviewing' && <Eye className="w-3 h-3" />}
                    <span className="capitalize">{report.status}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(report.priority)}`}>
                    <Flag className="h-2.5 w-2.5" />
                    {getPriorityLabel(report.priority)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100 truncate group-hover:text-white transition-colors">
                      {report.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{report.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {report.llmAnalysis && (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getVerdictColor(report.llmAnalysis.suggestedVerdict)}`}>
                      <Brain className="h-3 w-3" />
                      <span className="capitalize">{getVerdictLabel(report.llmAnalysis.suggestedVerdict)}</span>
                    </span>
                  )}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${sentimentStyle}`}>
                    <span className={`capitalize ${sentimentText}`}>
                      {report.sentiment.label}
                    </span>
                    <span className="text-slate-400">
                      {(report.sentiment.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 inline-flex items-center space-x-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{report.votes}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}