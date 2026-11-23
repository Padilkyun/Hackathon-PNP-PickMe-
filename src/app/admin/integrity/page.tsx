'use client';
import { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, AlertCircle, FileText, RefreshCw, Loader2, Zap, Globe, Link2, ExternalLink, Eye, Copy, Download, Flag, History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface IntegrityCheckResult {
  id: string;
  url?: string;
  status: 'verified' | 'disputed' | 'pending' | 'failed';
  similarity: number;
  sources: SourceMatch[];
  checkedAt: string;
  contentHash: string;
}

interface SourceMatch {
  id: string;
  title: string;
  url: string;
  similarity: number;
  publisher: string;
  publishedAt: string;
  isOfficial: boolean;
}

interface CheckRequest {
  url?: string;
  text?: string;
  type: 'url' | 'text';
}

const MOCK_SOURCES: SourceMatch[] = [
  {
    id: 'src-1',
    title: 'Pemerintah Resmi: Tidak Ada Kenaikan Harga BBM Bulan Ini',
    url: 'https://sekretariat.kabinet.go.id/berita/bbm',
    similarity: 0.92,
    publisher: 'Sekretariat Kabinet RI',
    publishedAt: '2026-08-20T10:00:00Z',
    isOfficial: true,
  },
  {
    id: 'src-2',
    title: 'Kementerian ESDM Bantah Isu Kenaikan BBM Subsidi',
    url: 'https://esdm.go.id/berita/bbm',
    similarity: 0.88,
    publisher: 'Kementerian ESDM',
    publishedAt: '2026-08-21T08:30:00Z',
    isOfficial: true,
  },
  {
    id: 'src-3',
    title: 'Viral: BBM Naik 500 Per Liter Besok',
    url: 'https://blog-palsu.com/bbm-naik',
    similarity: 0.76,
    publisher: 'Blog Anonim',
    publishedAt: '2026-08-22T14:00:00Z',
    isOfficial: false,
  },
  {
    id: 'src-4',
    title: 'Fact Check: Hoaks Kenaikan BBM September 2026',
    url: 'https://cekfakta.liputan6.com/bbm-hoaks',
    similarity: 0.85,
    publisher: 'CekFakta Liputan6',
    publishedAt: '2026-08-22T16:00:00Z',
    isOfficial: false,
  },
];

const MOCK_HISTORY: IntegrityCheckResult[] = [
  {
    id: 'chk-001',
    url: 'https://contoh-berita.id/bbm-naik',
    status: 'disputed',
    similarity: 0.76,
    sources: MOCK_SOURCES.slice(0, 3),
    checkedAt: '2026-08-22T15:30:00Z',
    contentHash: 'sha256:a1b2c3d4e5f6...',
  },
  {
    id: 'chk-002',
    url: 'https://bmkg.go.id/gempa-terkini',
    status: 'verified',
    similarity: 0.98,
    sources: [
      {
        id: 'src-5',
        title: 'Info Gempa Mag:5.2 SR, 20-KM BaratLaut SIANGGAR',
        url: 'https://bmkg.go.id/gempa-5.2',
        similarity: 0.98,
        publisher: 'BMKG',
        publishedAt: '2026-08-23T07:00:00Z',
        isOfficial: true,
      },
    ],
    checkedAt: '2026-08-23T07:05:00Z',
    contentHash: 'sha256:f6e5d4c3b2a1...',
  },
  {
    id: 'chk-003',
    url: 'https://contoh-berita.id/vaksin-aman',
    status: 'pending',
    similarity: 0,
    sources: [],
    checkedAt: '2026-08-23T08:00:00Z',
    contentHash: 'sha256:1234567890ab...',
  },
];

function getStatusBadge(status: IntegrityCheckResult['status']) {
  const styles = {
    verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    disputed: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    pending: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    failed: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  const labels = {
    verified: 'Terverifikasi',
    disputed: 'Diragukan',
    pending: 'Memeriksa',
    failed: 'Gagal',
  };
  const icons = {
    verified: CheckCircle,
    disputed: AlertCircle,
    pending: Loader2,
    failed: XCircle,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${styles[status]}`}>
      <Icon className="h-3 w-3" />
      {labels[status]}
    </span>
  );
}

function SimilarityBar({ value, className = '' }: { value: number; className?: string }) {
  const color = value >= 0.8 ? 'bg-emerald-500' : value >= 0.6 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className={`w-full h-2 rounded-full bg-slate-800 overflow-hidden ${className}`}>
      <div
        className={`${color} h-full rounded-full transition-all duration-500`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

export default function AdminIntegrityPage() {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<IntegrityCheckResult | null>(null);
  const [history, setHistory] = useState<IntegrityCheckResult[]>(MOCK_HISTORY);
  const [activeTab, setActiveTab] = useState<'check' | 'history'>('check');

  const handleCheck = async () => {
    const input = inputType === 'url' ? url : text;
    if (!input.trim()) return;

    setIsChecking(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 2000));

    const newResult: IntegrityCheckResult = {
      id: `chk-${Date.now()}`,
      url: inputType === 'url' ? input : undefined,
      status: Math.random() > 0.3 ? 'verified' : 'disputed',
      similarity: 0.6 + Math.random() * 0.35,
      sources: MOCK_SOURCES.slice(0, 3),
      checkedAt: new Date().toISOString(),
      contentHash: `sha256:${Math.random().toString(36).substring(2, 15)}...`,
    };

    setResult(newResult);
    setHistory((prev) => [newResult, ...prev]);
    setIsChecking(false);
  };

  const handleClear = () => {
    setUrl('');
    setText('');
    setResult(null);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Integrity Check</h1>
          <p className="text-slate-400 mt-1">Verifikasi integritas konten terhadap sumber resmi</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800/50 border border-slate-700 text-slate-300">
            <Zap className="h-3 w-3 text-amber-400" />
            <span>ML-Powered</span>
          </span>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('check')}
          className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-all ${
            activeTab === 'check'
              ? 'bg-slate-800 text-slate-100 border-b-2 border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            Cek Integritas
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-all ${
            activeTab === 'history'
              ? 'bg-slate-800 text-slate-100 border-b-2 border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <History className="h-4 w-4" />
            Riwayat
          </span>
        </button>
      </div>

      {activeTab === 'check' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-slate-300" />
                <h3 className="font-semibold text-slate-100">Input Konten</h3>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setInputType('url')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    inputType === 'url'
                      ? 'bg-slate-800 text-slate-100 border border-slate-600'
                      : 'bg-slate-800/30 text-slate-300 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  URL
                </button>
                <button
                  onClick={() => setInputType('text')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    inputType === 'text'
                      ? 'bg-slate-800 text-slate-100 border border-slate-600'
                      : 'bg-slate-800/30 text-slate-300 border border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Teks
                </button>
              </div>

              {inputType === 'url' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/artikel-berita"
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Sistem akan mengekstrak konten dan membandingkannya dengan database sumber resmi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Tempelkan teks berita/artikel di sini..."
                    rows={6}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                  />
                  <p className="text-xs text-slate-500">Minimal 100 karakter untuk analisis akurat</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
<Button
                    variant="primary"
                    size="lg"
                    onClick={handleCheck}
                    disabled={isChecking || (inputType !== 'url' && text.length < 100)}
                    className="flex-1"
                  >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memeriksa...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Mulai Pengecekan
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" onClick={handleClear}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Bersihkan
                </Button>
              </div>
            </Card>

            {result && (
              <Card className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100">Hasil Pengecekan</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Dibandingkan dengan {result.sources.length} sumber referensi
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.status)}
                    <button
                      onClick={() => copyHash(result.contentHash)}
                      className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      title="Salin hash konten"
                    >
                      <Copy className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-300">Tingkat Kemiripan</span>
                        <span className="font-semibold text-slate-100">
                          {(result.similarity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <SimilarityBar value={result.similarity} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-300">Hash Konten</span>
                        <span className="font-mono text-xs text-slate-400">{result.contentHash}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-800/30 border border-slate-800/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-slate-300" />
                      <span className="font-medium text-slate-100">Status Integritas</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Waktu Cek</span>
                        <span className="text-slate-100">
                          {new Date(result.checkedAt).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Jumlah Sumber</span>
                        <span className="text-slate-100">{result.sources.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sumber Resmi</span>
                        <span className="text-slate-100">
                          {result.sources.filter((s) => s.isOfficial).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <h4 className="font-medium text-slate-100 mb-3">Sumber Referensi</h4>
                  <div className="space-y-3">
                    {result.sources.map((source) => (
                      <div
                        key={source.id}
                        className="rounded-xl border border-slate-800 bg-slate-800/30 p-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-slate-100 truncate">{source.title}</span>
                              {source.isOfficial && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <Shield className="h-3 w-3" />
                                  Resmi
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                              <span className="truncate max-w-[200px]">{source.publisher}</span>
                              <span>•</span>
                              <span>{new Date(source.publishedAt).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-slate-100"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Lihat Sumber
                              </a>
                              <div className="flex items-center gap-2">
                                <SimilarityBar value={source.similarity} className="w-32" />
                                <span className="text-xs font-mono text-slate-400 w-12 text-right">
                                  {(source.similarity * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-slate-100">Cara Kerja</h3>
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Ekstraksi Konten</p>
                    <p>Sistem mengambil teks penuh dari URL atau menggunakan teks input langsung</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Hash & Fingerprint</p>
                    <p>Membuat hash SHA-256 dan fingerprint semantik untuk identifikasi unik</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Pencocokan Sumber</p>
                    <p>Membandingkan dengan database pemerintah, media kredibel, & fact-checker</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-300">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">Skor Integritas</p>
                    <p>Menghasilkan skor kemiripan & status verifikasi (Terverifikasi/Diragukan)</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flag className="h-5 w-5 text-red-400" />
                <h3 className="font-semibold text-slate-100">Lapor Konten Mencurigakan</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Temukan konten yang tidak cocok dengan sumber resmi? Laporkan untuk investigasi lanjutan.
              </p>
              <Button variant="outline" className="w-full" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Buat Laporan Baru
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Konten</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Kemiripan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Sumber</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-slate-100 truncate">
                          {item.url ? new URL(item.url).hostname : 'Input teks manual'}
                        </p>
                        <p className="text-xs text-slate-400 truncate font-mono">{item.contentHash}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 w-32">
                        <SimilarityBar value={item.similarity} className="flex-1" />
                        <span className="text-xs font-mono text-slate-400 w-12 text-right">
                          {(item.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{item.sources.length} referensi</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {new Date(item.checkedAt).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors" title="Lihat detail">
                          <Eye className="h-4 w-4 text-slate-400" />
                        </button>
                        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors" title="Salin hash">
                          <Copy className="h-4 w-4 text-slate-400" />
                        </button>
                        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors" title="Unduh laporan">
                          <Download className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      Belum ada riwayat pengecekan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}