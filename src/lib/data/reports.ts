// Mock data untuk admin dashboard PICKME GARUDA.
// Pada implementasi nyata, data ini berasal dari API backend.

export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'reviewing';
export type SentimentLabel = 'positive' | 'neutral' | 'negative';
export type VerdictLabel = 'valid' | 'hoaks' | 'misleading' | 'unconfirmed';
export type PriorityLevel = 'low' | 'normal' | 'high' | 'urgent';

export interface SentimentAnalysis {
  label: SentimentLabel;
  score: number; // -1.0 .. 1.0
  positive: number; // percentage
  negative: number;
  neutral: number;
}

export interface ClaimExtraction {
  id: string;
  claim: string;
  entities: string[];
  confidence: number;
  factCheckScore?: number; // 0.0 - 1.0
  matchedSources?: MatchedSource[];
}

export interface MatchedSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publishedAt: string;
  isOfficial: boolean;
  similarity: number;
  excerpt: string;
}

export interface LLMAnalysis {
  extractedClaims: ClaimExtraction[];
  overallFactCheckScore: number; // 0.0 - 1.0
  suggestedVerdict: VerdictLabel;
  reasoning: string;
  processingTimeMs: number;
  modelVersion: string;
}

export interface Report {
  id: string;
  title: string;
  url: string;
  source: string;
  category: string;
  submittedBy: string;
  submittedAt: string;
  status: ReportStatus;
  reason?: string;
  sentiment: SentimentAnalysis;
  spamScore: number;
  excerpt: string;
  llmAnalysis?: LLMAnalysis;
  priority: PriorityLevel;
  votes: number;
}

const now = new Date('2026-08-23T08:00:00Z');
function hoursAgo(h: number) {
  return new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
}

const mockMatchedSources: MatchedSource[] = [
  {
    id: 'src-1',
    title: 'Pemerintah Resmi: Tidak Ada Kenaikan Harga BBM Bulan Ini',
    url: 'https://sekretariat.kabinet.go.id/berita/bbm',
    publisher: 'Sekretariat Kabinet RI',
    publishedAt: '2026-08-20T10:00:00Z',
    isOfficial: true,
    similarity: 0.92,
    excerpt: 'Kementerian ESDM menegaskan tidak ada kebijakan kenaikan harga BBM subsidi saat ini...',
  },
  {
    id: 'src-2',
    title: 'Kementerian ESDM Bantah Isu Kenaikan BBM Subsidi',
    url: 'https://esdm.go.id/berita/bbm',
    publisher: 'Kementerian ESDM',
    publishedAt: '2026-08-21T08:30:00Z',
    isOfficial: true,
    similarity: 0.88,
    excerpt: 'Dirjen Minyak dan Gas Bumi menyatakan harga BBM subsidi tetap sesuai ketentuan...',
  },
  {
    id: 'src-3',
    title: 'Fact Check: Hoaks Kenaikan BBM September 2026',
    url: 'https://cekfakta.liputan6.com/bbm-hoaks',
    publisher: 'CekFakta Liputan6',
    publishedAt: '2026-08-22T16:00:00Z',
    isOfficial: false,
    similarity: 0.85,
    excerpt: 'Klaim kenaikan BBM 500 per liter dinyatakan hoaks oleh tim fact-check...',
  },
];

const mockVaksinSources: MatchedSource[] = [
  {
    id: 'src-4',
    title: 'WHO: Tidak Ada Vaksin 100% Aman Tanpa Efek Samping',
    url: 'https://who.int/vaccine-safety',
    publisher: 'World Health Organization',
    publishedAt: '2026-08-15T12:00:00Z',
    isOfficial: true,
    similarity: 0.91,
    excerpt: 'Semua vaksin memiliki risiko efek samping, meski sangat kecil...',
  },
  {
    id: 'src-5',
    title: 'Kemenkes: Vaksin Baru Masih Tahap Uji Klinis',
    url: 'https://kemenkes.go.id/vaksin-baru',
    publisher: 'Kementerian Kesehatan RI',
    publishedAt: '2026-08-18T09:00:00Z',
    isOfficial: true,
    similarity: 0.87,
    excerpt: 'Vaksin yang dimaksud masih dalam tahap 3 uji klinis, belum mendapat EUA...',
  },
];

export const mockReports: Report[] = [
  {
    id: 'rpt-001',
    title: 'Pemerintah resmi naikkan harga BBM subsidi mulai besok',
    url: 'https://contoh-berita.id/bbm-naik',
    source: 'Berita Nasional',
    category: 'Ekonomi',
    submittedBy: 'budi@email.com',
    submittedAt: hoursAgo(1),
    status: 'pending',
    sentiment: { label: 'negative', score: -0.72, positive: 12, negative: 71, neutral: 17 },
    spamScore: 0.08,
    excerpt: 'Rumor kenaikan harga BBM subsidi kembali ramai di media sosial...',
    priority: 'high',
    votes: 234,
    llmAnalysis: {
      extractedClaims: [
        {
          id: 'claim-1',
          claim: 'Pemerintah resmi naikkan harga BBM subsidi mulai besok',
          entities: ['Pemerintah', 'BBM subsidi', 'besok'],
          confidence: 0.94,
          factCheckScore: 0.12,
          matchedSources: mockMatchedSources,
        },
        {
          id: 'claim-2',
          claim: 'Kenaikan sebesar Rp500 per liter untuk semua jenis BBM bersubsidi',
          entities: ['Rp500', 'BBM bersubsidi'],
          confidence: 0.87,
          factCheckScore: 0.08,
          matchedSources: mockMatchedSources.slice(0, 2),
        },
      ],
      overallFactCheckScore: 0.10,
      suggestedVerdict: 'hoaks',
      reasoning: 'Klaim kenaikan BBM dikontra oleh 2 sumber resmi (Sekretariat Kabinet & Kementerian ESDM) dan 1 fact-checker terpercaya. Tidak ada regulasi terbaru yang mendukung klaim ini.',
      processingTimeMs: 1240,
      modelVersion: 'pickme-llm-v2.1',
    },
  },
  {
    id: 'rpt-002',
    title: 'Vaksin baru 100% aman klaim dokter',
    url: 'https://contoh-berita.id/vaksin-aman',
    source: 'Kesehatan.id',
    category: 'Kesehatan',
    submittedBy: 'sari@email.com',
    submittedAt: hoursAgo(3),
    status: 'reviewing',
    sentiment: { label: 'positive', score: 0.55, positive: 64, negative: 8, neutral: 28 },
    spamScore: 0.21,
    excerpt: 'Konten ini mengklaim keamanan absolut — perlu verifikasi independen.',
    priority: 'urgent',
    votes: 567,
    llmAnalysis: {
      extractedClaims: [
        {
          id: 'claim-3',
          claim: 'Vaksin baru 100% aman tanpa efek samping',
          entities: ['Vaksin baru', '100% aman', 'tanpa efek samping'],
          confidence: 0.91,
          factCheckScore: 0.15,
          matchedSources: mockVaksinSources,
        },
        {
          id: 'claim-4',
          claim: 'Dokter terkemuka menggunakannya untuk keluarga sendiri',
          entities: ['Dokter terkemuka', 'keluarga sendiri'],
          confidence: 0.72,
          factCheckScore: 0.22,
          matchedSources: [],
        },
      ],
      overallFactCheckScore: 0.18,
      suggestedVerdict: 'misleading',
      reasoning: 'Klaim "100% aman" berlawanan dengan konsensus ilmiah (WHO) dan status regulatori (Kemenkes). Vaksin dimaksud masih uji klinis. Klasifikasi misleading karena ada unsur kebenaran (vaksin baru ada) tapi disajikan menyimpang.',
      processingTimeMs: 980,
      modelVersion: 'pickme-llm-v2.1',
    },
  },
  {
    id: 'rpt-003',
    title: 'Banjir besar landa Jakarta hari ini',
    url: 'https://contoh-berita.id/banjir-jkt',
    source: 'Metro News',
    category: 'Bencana',
    submittedBy: 'eko@email.com',
    submittedAt: hoursAgo(6),
    status: 'approved',
    reason: 'Dikonfirmasi oleh BMKG dan BPBD DKI.',
    sentiment: { label: 'negative', score: -0.45, positive: 8, negative: 58, neutral: 34 },
    spamScore: 0.03,
    excerpt: 'Banjir dengan ketinggian 30-100cm melanda 12 kelurahan di Jakarta...',
    priority: 'normal',
    votes: 89,
    llmAnalysis: {
      extractedClaims: [
        {
          id: 'claim-5',
          claim: 'Banjir ketinggian 30-100cm melanda 12 kelurahan Jakarta',
          entities: ['30-100cm', '12 kelurahan', 'Jakarta'],
          confidence: 0.96,
          factCheckScore: 0.94,
          matchedSources: [
            {
              id: 'src-6',
              title: 'BPBD DKI: 12 Kelurahan Terdampak Banjir',
              url: 'https://bpbd.dki.go.id/banjir-12-kelurahan',
              publisher: 'BPBD DKI Jakarta',
              publishedAt: '2026-08-23T06:00:00Z',
              isOfficial: true,
              similarity: 0.97,
              excerpt: 'Data terbaru: 12 kelurahan di 3 kecamatan terendam banjir 30-100cm...',
            },
          ],
        },
      ],
      overallFactCheckScore: 0.94,
      suggestedVerdict: 'valid',
      reasoning: 'Klaim banjir sesuai dengan data real-time dari BPBD DKI Jakarta (sumber resmi). Detail ketinggian & lokasi cocok 97%.',
      processingTimeMs: 560,
      modelVersion: 'pickme-llm-v2.1',
    },
  },
  {
    id: 'rpt-004',
    title: 'HOAKS: Artis terkenal ditangkap polisi',
    url: 'https://contoh-berita.id/artis-ditangkap',
    source: 'Tabloid X',
    category: 'Hiburan',
    submittedBy: 'anonymous',
    submittedAt: hoursAgo(12),
    status: 'rejected',
    reason: 'Tidak ada konfirmasi dari pihak kepolisian. Sumber tidak kredibel.',
    sentiment: { label: 'neutral', score: 0.05, positive: 30, negative: 32, neutral: 38 },
    spamScore: 0.92,
    excerpt: 'Kabar penangkapan artis A viral di media sosial tanpa bukti jelas.',
    priority: 'low',
    votes: 12,
    llmAnalysis: {
      extractedClaims: [
        {
          id: 'claim-6',
          claim: 'Artis terkenal ditangkap polisi',
          entities: ['Artis terkenal', 'polisi', 'ditangkap'],
          confidence: 0.83,
          factCheckScore: 0.05,
          matchedSources: [],
        },
      ],
      overallFactCheckScore: 0.05,
      suggestedVerdict: 'hoaks',
      reasoning: 'Tidak ditemukan sumber resmi atau media kredibel yang mengonfirmasi penangkapan. Sumber asal (Tabloid X) tidak kredibel. Polisi tidak mengeluarkan pernyataan.',
      processingTimeMs: 420,
      modelVersion: 'pickme-llm-v2.1',
    },
  },
  {
    id: 'rpt-005',
    title: 'Indonesia menang telak 5-0 di kualifikasi piala dunia',
    url: 'https://contoh-berita.id/timnas-menang',
    source: 'Sport.id',
    category: 'Olahraga',
    submittedBy: 'doni@email.com',
    submittedAt: hoursAgo(18),
    status: 'pending',
    sentiment: { label: 'positive', score: 0.88, positive: 87, negative: 2, neutral: 11 },
    spamScore: 0.05,
    excerpt: 'Timnas Indonesia mengalahkan lawan dengan skor 5-0...',
    priority: 'normal',
    votes: 445,
    llmAnalysis: {
      extractedClaims: [
        {
          id: 'claim-7',
          claim: 'Timnas Indonesia menang 5-0 di kualifikasi piala dunia',
          entities: ['Timnas Indonesia', '5-0', 'kualifikasi piala dunia'],
          confidence: 0.95,
          factCheckScore: 0.88,
          matchedSources: [
            {
              id: 'src-7',
              title: 'FIFA: Indonesia 5-0 Lawan Kualifikasi Piala Dunia 2026',
              url: 'https://fifa.com/indonesia-5-0',
              publisher: 'FIFA Official',
              publishedAt: '2026-08-22T20:00:00Z',
              isOfficial: true,
              similarity: 0.96,
              excerpt: 'Indonesia mengalahkan lawan dengan skor 5-0 di Grup Kualifikasi AFC...',
            },
          ],
        },
      ],
      overallFactCheckScore: 0.88,
      suggestedVerdict: 'valid',
      reasoning: 'Skor dan konteks pertandingan sesuai dengan data resmi FIFA. Sumber olahraga terpercaya (Sport.id) konsisten dengan data resmi.',
      processingTimeMs: 610,
      modelVersion: 'pickme-llm-v2.1',
    },
  },
  {
    id: 'rpt-006',
    title: 'Gempa 7.2 magnitudo guncang Sumatera Barat',
    url: 'https://contoh-berita.id/gempa-sumbar',
    source: 'BMKG',
    category: 'Bencana',
    submittedBy: 'rilis@bmkg.go.id',
    submittedAt: hoursAgo(24),
    status: 'approved',
    reason: 'Sumber resmi BMKG.',
    sentiment: { label: 'negative', score: -0.81, positive: 5, negative: 84, neutral: 11 },
    spamScore: 0.01,
    excerpt: 'Gempa dengan magnitudo 7.2 mengguncang wilayah Sumatera Barat.',
    priority: 'urgent',
    votes: 1203,
    llmAnalysis: {
      extractedClaims: [
        {
          id: 'claim-8',
          claim: 'Gempa magnitudo 7.2 guncang Sumatera Barat',
          entities: ['7.2 magnitudo', 'Sumatera Barat', 'gempa'],
          confidence: 0.99,
          factCheckScore: 1.0,
          matchedSources: [
            {
              id: 'src-8',
              title: 'Info Gempa Mag:7.2 SR, Sumatera Barat',
              url: 'https://bmkg.go.id/gempa-7.2-sumbar',
              publisher: 'BMKG',
              publishedAt: '2026-08-22T08:00:00Z',
              isOfficial: true,
              similarity: 1.0,
              excerpt: 'Gempa dengan magnitudo 7.2 SR menggunung wilayah Sumatera Barat pada pukul 08:00 WIB...',
            },
          ],
        },
      ],
      overallFactCheckScore: 1.0,
      suggestedVerdict: 'valid',
      reasoning: 'Sumber langsung dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) - otoritas resmi gempa di Indonesia. Data 100% cocok.',
      processingTimeMs: 230,
      modelVersion: 'pickme-llm-v2.1',
    },
  },
];

export function getStatusColor(status: ReportStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-slate-800/50 text-slate-300 border-slate-700';
    case 'reviewing':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'approved':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'rejected':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
  }
}

export function getStatusIcon(status: ReportStatus) {
  switch (status) {
    case 'pending': return 'Clock';
    case 'reviewing': return 'Activity';
    case 'approved': return 'CheckCircle';
    case 'rejected': return 'XCircle';
  }
}

export function getVerdictColor(verdict: VerdictLabel): string {
  switch (verdict) {
    case 'valid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'hoaks': return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'misleading': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'unconfirmed': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
}

export function getVerdictLabel(verdict: VerdictLabel): string {
  switch (verdict) {
    case 'valid': return 'Valid';
    case 'hoaks': return 'Hoaks';
    case 'misleading': return 'Misleading';
    case 'unconfirmed': return 'Belum Terkonfirmasi';
  }
}

export function getPriorityColor(priority: Report['priority']): string {
  switch (priority) {
    case 'urgent': return 'bg-red-500/10 text-red-400 border-red-500/30';
    case 'high': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'normal': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    case 'low': return 'bg-slate-800/50 text-slate-500 border-slate-700';
  }
}

export function getPriorityLabel(priority: Report['priority']): string {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'Tinggi';
    case 'normal': return 'Normal';
    case 'low': return 'Rendah';
  }
}

export function getSentimentColor(label: SentimentLabel): string {
  switch (label) {
    case 'positive':
      return 'text-emerald-400';
    case 'neutral':
      return 'text-amber-400';
    case 'negative':
      return 'text-red-400';
  }
}

export function getSentimentBg(label: SentimentLabel): string {
  switch (label) {
    case 'positive':
      return 'bg-emerald-500/10 border border-emerald-500/20';
    case 'neutral':
      return 'bg-amber-500/10 border border-amber-500/20';
    case 'negative':
      return 'bg-red-500/10 border border-red-500/20';
  }
}

export function getFactCheckColor(score: number): string {
  if (score >= 0.8) return 'text-emerald-400';
  if (score >= 0.5) return 'text-amber-400';
  return 'text-red-400';
}