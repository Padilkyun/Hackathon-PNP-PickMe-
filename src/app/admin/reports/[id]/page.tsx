'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Activity,
  Shield,
  ExternalLink,
  Clock,
  AlertCircle,
  Eye,
  Brain,
  FileText,
  ChevronDown,
  ChevronUp,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Copy,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  mockReports,
  getStatusColor,
  getStatusIcon,
  getVerdictColor,
  getVerdictLabel,
  getPriorityColor,
  getPriorityLabel,
  getSentimentColor,
  getSentimentBg,
  getFactCheckColor,
  Report,
  VerdictLabel,
  ClaimExtraction,
  MatchedSource,
} from '@/lib/data/reports';

const VERDICT_OPTIONS: { value: VerdictLabel; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'valid', label: 'Valid', icon: <CheckCircle className="h-4 w-4" />, desc: 'Konten akurat, sesuai fakta & sumber resmi' },
  { value: 'hoaks', label: 'Hoaks', icon: <XCircle className="h-4 w-4" />, desc: 'Konten palsu, tidak ada dasar fakta sama sekali' },
  { value: 'misleading', label: 'Misleading', icon: <AlertCircle className="h-4 w-4" />, desc: 'Ada unsur benar tapi disajikan menyimpang/menyesatkan' },
  { value: 'unconfirmed', label: 'Belum Terkonfirmasi', icon: <Clock className="h-4 w-4" />, desc: 'Tidak cukup bukti untuk menentukan status' },
];

function StatusIconComponent({ status }: { status: string }) {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'reviewing': return <Activity className="h-4 h-4" />;
    case 'approved': return <CheckCircle className="h-4 w-4" />;
    case 'rejected': return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
}

function ClaimCard({ claim, index }: { claim: ClaimExtraction; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-800/30 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-mono text-slate-400">
            {index + 1}
          </span>
          <div>
            <p className="font-medium text-slate-100 line-clamp-1">{claim.claim}</p>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Keyakinan: {(claim.confidence * 100).toFixed(0)}%
              </span>
              {claim.factCheckScore !== undefined && (
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Fact-check: <span className={getFactCheckColor(claim.factCheckScore)}>{(claim.factCheckScore * 100).toFixed(0)}%</span>
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {claim.matchedSources && claim.matchedSources.length > 0 && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {claim.matchedSources.length} sumber
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 p-4 space-y-4 animate-in slide-down duration-200">
          {claim.entities.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Entitas Teridentifikasi</p>
              <div className="flex flex-wrap gap-2">
                {claim.entities.map((e, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-700 text-xs text-slate-300">{e}</span>
                ))}
              </div>
            </div>
          )}

          {claim.matchedSources && claim.matchedSources.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Sumber yang Cocok</p>
              <div className="space-y-3">
                {claim.matchedSources.map((src) => (
                  <div key={src.id} className="rounded-lg border border-slate-800 bg-slate-800/50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-100 text-sm truncate">{src.title}</p>
                          {src.isOfficial && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Shield className="h-2.5 w-2.5" /> Resmi
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mb-1">{src.publisher} · {new Date(src.publishedAt).toLocaleDateString('id-ID')}</p>
                        <p className="text-sm text-slate-300 line-clamp-2">{src.excerpt}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> Buka
                          </a>
                          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                            <Activity className="h-3 w-3" /> {(src.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VerdictSelector({ selected, onChange }: { selected: VerdictLabel | null; onChange: (v: VerdictLabel) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {VERDICT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
            selected === opt.value
              ? `${getVerdictColor(opt.value)} border-current shadow-[0_0_0_1px]`
              : 'border-slate-800 hover:border-slate-600 bg-slate-800/30'
          }`}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50">
            {opt.icon}
          </div>
          <span className="font-medium text-sm text-slate-100">{opt.label}</span>
          <p className="text-xs text-slate-400 text-center px-2">{opt.desc}</p>
        </button>
      ))}
    </div>
  );
}

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const report = mockReports.find((r) => r.id === params.id);
  const [selectedVerdict, setSelectedVerdict] = useState<VerdictLabel | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) {
    return (
      <div className="space-y-4">
        <Link href="/admin/reports" className="inline-flex items-center text-slate-300 hover:text-slate-100">
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke daftar
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">Laporan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const llm = report.llmAnalysis;
  const StatusIcon = getStatusIcon(report.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerdict) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    alert(`[DEMO] ${getVerdictLabel(selectedVerdict).toUpperCase()} untuk ${report.id}\nAlasan: ${reason || '(tidak ada)'}`);
    router.push('/admin/reports');
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/reports" className="inline-flex items-center text-slate-300 hover:text-slate-100">
        <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke daftar
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${getPriorityColor(report.priority)}`}>
              <Flag className="h-3 w-3" />
              {getPriorityLabel(report.priority)}
            </span>
            <span className="text-sm text-slate-400">•</span>
            <span className="text-sm text-slate-400">{report.category}</span>
            <span className="text-sm text-slate-400">•</span>
            <span className="text-sm text-slate-400">{report.source}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-2 leading-tight">{report.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="inline-flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(report.submittedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{report.votes} vote</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <ExternalLink className="h-3 w-3" />
              <a href={report.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-200">Sumber</a>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:ml-4">
          <span className={`inline-flex items-center space-x-2 rounded-full border px-4 py-2 ${getStatusColor(report.status)}`}>
            <StatusIconComponent status={report.status} />
            <span className="capitalize text-sm font-medium">{report.status}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Konten Laporan</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{report.excerpt}</p>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-sm"
            >
              <span>Buka sumber asli</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {llm && (
            <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Analisis AI (LLM)</h3>
                    <p className="text-xs text-slate-400">Model: {llm.modelVersion} · {llm.processingTimeMs}ms</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Skor Keseluruhan</p>
                  <p className="text-2xl font-bold font-mono {getFactCheckColor(llm.overallFactCheckScore)}">
                    {(llm.overallFactCheckScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className={`rounded-xl border p-4 mb-6 ${getVerdictColor(llm.suggestedVerdict)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                      {VERDICT_OPTIONS.find(v => v.value === llm.suggestedVerdict)?.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">Saran AI: {getVerdictLabel(llm.suggestedVerdict)}</p>
                      <p className="text-sm text-slate-300">{llm.reasoning}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(llm.suggestedVerdict)} border border-current`}>
                    <Brain className="h-3 w-3" />
                    AI Suggestion
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-slate-300" />
                  Klaim yang Diekstrak ({llm.extractedClaims.length})
                </h4>
                <div className="space-y-3">
                  {llm.extractedClaims.map((claim, i) => (
                    <ClaimCard key={claim.id} claim={claim} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6">
            <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-300" />
              Analisis Sentimen
            </h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-300">Skor: <span className="font-mono text-slate-100">{report.sentiment.score.toFixed(2)}</span></p>
                <p className="text-sm text-slate-300 mt-1">Label: <span className={`capitalize ${getSentimentColor(report.sentiment.label)}`}>{report.sentiment.label}</span></p>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="text-slate-800" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className={getSentimentColor(report.sentiment.label).replace('text-', 'stroke-')}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${Math.abs(report.sentiment.score) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-100">{(Math.abs(report.sentiment.score) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Positif', value: report.sentiment.positive, color: 'emerald' },
                { label: 'Netral', value: report.sentiment.neutral, color: 'amber' },
                { label: 'Negatif', value: report.sentiment.negative, color: 'red' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-slate-400 capitalize">{s.label}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s.value}%`, backgroundColor: `var(--color-${s.color}-500)` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm font-mono text-slate-300">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6">
            <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-slate-300" />
              Spam Detector
            </h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-300">Skor: <span className="font-mono text-slate-100">{report.spamScore.toFixed(2)}</span></p>
                <p className="text-sm text-slate-300 mt-1">
                  {report.spamScore > 0.5 ? '⚠️ Kemungkinan spam' : '✅ Terlihat aman'}
                </p>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="text-slate-800" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className={report.spamScore > 0.5 ? 'stroke-red-500' : 'stroke-emerald-500'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${report.spamScore * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-100">{(report.spamScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${report.spamScore * 100}%`, backgroundColor: report.spamScore > 0.5 ? 'var(--color-red-500)' : 'var(--color-emerald-500)' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">Dilaporkan oleh: {report.submittedBy}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 sticky top-24">
            <h3 className="font-semibold text-slate-100 mb-4">Keputusan Verifikasi</h3>

            <VerdictSelector selected={selectedVerdict} onChange={setSelectedVerdict} />

            <div className="mt-4">
              <label htmlFor="reason" className="block text-sm text-slate-300 mb-1">Alasan / Komentar Edukatif</label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Tulis alasan verifikasi dan komentar edukatif untuk pelapor..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">Alasan akan dikirim ke pelapor via notifikasi</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Button variant="ghost" className="w-full mb-2" onClick={() => router.push('/admin/reports')}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                onClick={handleSubmit}
                disabled={!selectedVerdict || isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : `Konfirmasi ${selectedVerdict ? getVerdictLabel(selectedVerdict) : 'Keputusan'}`}
              </Button>
            </div>

            {report.reason && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-2">Keputusan Sebelumnya</p>
                <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg">{report.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}