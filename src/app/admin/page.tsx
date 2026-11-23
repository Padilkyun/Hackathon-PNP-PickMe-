'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  FileText, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ArrowUpRight, 
  Zap, 
  Brain, 
  Flag, 
  ThumbsUp,
  LayoutDashboard,
  ShieldCheck,
  Bot,
  BarChart2,
  AlertTriangle,
} from 'lucide-react';
import { mockReports, getStatusColor, getSentimentBg, getSentimentColor, getVerdictColor, getVerdictLabel, getPriorityColor, getPriorityLabel } from '@/lib/data/reports';
import { KPICard, BarChart, StackedBarChart, StatusBadge, PriorityBadge } from '@/components/ui/Chart';

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

const sentimentTrend = [
  { label: 'Sen', positive: 45, neutral: 30, negative: 25 },
  { label: 'Sel', positive: 52, neutral: 28, negative: 20 },
  { label: 'Rab', positive: 48, neutral: 32, negative: 20 },
  { label: 'Kam', positive: 61, neutral: 24, negative: 15 },
  { label: 'Jum', positive: 55, neutral: 28, negative: 17 },
  { label: 'Sab', positive: 67, neutral: 21, negative: 12 },
  { label: 'Min', positive: 72, neutral: 18, negative: 10 },
];

const priorityData = [
  { label: 'Urgent', value: stats.urgent, color: '#ef4444' },
  { label: 'Tinggi', value: stats.high, color: '#f59e0b' },
  { label: 'Normal', value: mockReports.filter(r => r.priority === 'normal').length, color: '#64748b' },
  { label: 'Rendah', value: mockReports.filter(r => r.priority === 'low').length, color: '#94a3b8' },
];

const verdictData = [
  { label: 'Valid', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'valid').length, color: '#22c55e' },
  { label: 'Hoaks', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'hoaks').length, color: '#ef4444' },
  { label: 'Misleading', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'misleading').length, color: '#f59e0b' },
  { label: 'Belum Konfirmasi', value: mockReports.filter(r => r.llmAnalysis?.suggestedVerdict === 'unconfirmed').length, color: '#64748b' },
];

const statusData = [
  { label: 'Disetujui', value: stats.approved, color: '#22c55e' },
  { label: 'Ditolak', value: stats.rejected, color: '#ef4444' },
  { label: 'Direview', value: stats.reviewing, color: '#f59e0b' },
  { label: 'Menunggu', value: stats.pending, color: '#64748b' },
];

const categoryData = [
  { label: 'Bencana', value: mockReports.filter(r => r.category === 'Bencana').length, color: '#ef4444' },
  { label: 'Kesehatan', value: mockReports.filter(r => r.category === 'Kesehatan').length, color: '#22c55e' },
  { label: 'Ekonomi', value: mockReports.filter(r => r.category === 'Ekonomi').length, color: '#3b82f6' },
  { label: 'Olahraga', value: mockReports.filter(r => r.category === 'Olahraga').length, color: '#a855f7' },
  { label: 'Hiburan', value: mockReports.filter(r => r.category === 'Hiburan').length, color: '#ec4899' },
];

function LiveActivity() {
  const activities = [
    { id: 1, type: 'approved', user: 'admin@pnp', target: 'Banjir Jakarta', time: '2 menit lalu' },
    { id: 2, type: 'rejected', user: 'admin@pnp', target: 'Vaksin 100% aman', time: '5 menit lalu' },
    { id: 3, type: 'review', user: 'system', target: 'BMKG Press Release', time: '8 menit lalu' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Eye className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'approved': return 'menyetujui';
      case 'rejected': return 'menolak';
      default: return 'meriview';
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, i) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
        >
          {getIcon(activity.type)}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200 truncate">
              <span className="text-slate-400">{activity.user}</span>
              {' '}
              {getLabel(activity.type)}
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

function SectionHeader({ title, description, icon, action }: { 
  title: string; 
  description?: string; 
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-300">{icon}</div>}
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 transition-colors hover:border-slate-600/50 ${className || ''}`}>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const latest = mockReports.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitoring aktivitas verifikasi berita dan analisis AI</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-400 font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Laporan"
          value={stats.total.toLocaleString()}
          icon={<FileText className="w-5 h-5 text-slate-300" />}
          trend={{ value: '+12.5%', up: true }}
        />
        <KPICard
          label="Terverifikasi"
          value={(stats.approved + stats.rejected).toLocaleString()}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          trend={{ value: '+8.2%', up: true }}
          color="text-emerald-400"
        />
        <KPICard
          label="Menunggu Review"
          value={(stats.pending + stats.reviewing).toLocaleString()}
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          trend={{ value: '-3.4%', up: false }}
          color="text-amber-400"
        />
        <KPICard
          label="Akurasi AI"
          value={`${Math.round(stats.aiAccuracy * 100)}%`}
          icon={<Brain className="w-5 h-5 text-slate-300" />}
          trend={{ value: '+1.8%', up: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SectionHeader
            title="Tren Sentimen 7 Hari"
            description="Distribusi sentimen publik terhadap berita yang dilaporkan"
            icon={<BarChart2 className="w-4 h-4" />}
          />
          <StackedBarChart data={sentimentTrend} height={180} />
        </Card>

        <Card>
          <SectionHeader
            title="Aktivitas Terbaru"
            description="Tindakan admin dan sistem real-time"
            icon={<Activity className="w-4 h-4" />}
          />
          <LiveActivity />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader
            title="Distribusi Prioritas"
            description="Laporan berdasarkan tingkat urgensi"
            icon={<Flag className="w-4 h-4" />}
          />
          <BarChart data={priorityData} height={140} />
        </Card>

        <Card>
          <SectionHeader
            title="Saran AI Verdict"
            description="Rekomendasi klasifikasi dari analisis LLM"
            icon={<Brain className="w-4 h-4" />}
          />
          <BarChart data={verdictData} height={140} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader
            title="Status Laporan"
            description="Progress verifikasi keseluruhan"
            icon={<Shield className="w-4 h-4" />}
          />
          <BarChart data={statusData} height={140} />
        </Card>

        <Card>
          <SectionHeader
            title="Kategori Laporan"
            description="Distribusi topik berita yang dilaporkan"
            icon={<LayoutDashboard className="w-4 h-4" />}
          />
          <BarChart data={categoryData} height={140} />
        </Card>
      </div>

      <Card>
        <SectionHeader
          title="Laporan Prioritas Tertinggi"
          description="5 laporan dengan prioritas dan urgensi tertinggi"
          icon={<AlertTriangle className="w-4 h-4" />}
          action={
            <a href="/admin/reports" className="text-sm text-slate-300 hover:text-slate-100 inline-flex items-center gap-1 group">
              Lihat semua
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          }
        />
        <div className="space-y-3">
          {latest.map((report, i) => {
            const sentimentStyle = getSentimentBg(report.sentiment.label);
            const sentimentText = getSentimentColor(report.sentiment.label);
            return (
              <a
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="group flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <StatusBadge variant={report.status}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </StatusBadge>
                  <PriorityBadge level={report.priority} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-100 truncate group-hover:text-white transition-colors">
                      {report.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{report.source} • {report.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {report.llmAnalysis && (
                    <StatusBadge variant={report.llmAnalysis.suggestedVerdict}>
                      <Brain className="h-3 w-3" />
                      {getVerdictLabel(report.llmAnalysis.suggestedVerdict)}
                    </StatusBadge>
                  )}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${sentimentStyle}`}>
                    <span className={`capitalize ${sentimentText}`}>
                      {report.sentiment.label}
                    </span>
                    <span className="text-slate-400">
                      {(report.sentiment.score * 100).toFixed(0)}%
                    </span>
                  </span>
                  <div className="text-xs text-slate-400 inline-flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{report.votes}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </a>
            );
          })}
        </div>
      </Card>
    </div>
  );
}