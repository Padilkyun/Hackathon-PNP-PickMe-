'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Settings, Sparkles, MessageSquare, AlertCircle, CheckCircle, Loader2, Copy, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  feedback?: 'positive' | 'negative';
  metadata?: {
    sources?: string[];
    confidence?: number;
    action?: string;
  };
}

interface QuickAction {
  label: string;
  prompt: string;
  icon: React.ReactNode;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Cek Status Laporan',
    prompt: 'Bagaimana cara memeriksa status laporan yang sudah dikirim?',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    label: 'Panduan Verifikasi',
    prompt: 'Apa prosedur standar verifikasi berita untuk verifikator?',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    label: 'Threshold Spam',
    prompt: 'Berapa threshold spam score yang digunakan sistem?',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    label: 'Kelola Akun Verifikator',
    prompt: 'Bagaimana cara menambah atau menghapus akun verifikator?',
    icon: <Bot className="h-4 w-4" />,
  },
];

const SYSTEM_PROMPT = `Anda adalah asisten AI untuk admin PICKME GARUDA - platform verifikasi hoaks Indonesia.
Tugas Anda: bantu admin/verifikator dengan panduan sistem, prosedur verifikasi, pengelolaan laporan, dan konfigurasi.
Gunakan bahasa Indonesia yang formal dan profesional. Berikan jawaban yang akurat, ringkas, dan actionable.`;

const MOCK_RESPONSES: Record<string, string> = {
  'status laporan': `Untuk memeriksa status laporan:

1. Buka menu **Kelola Laporan** di sidebar
2. Gunakan filter status (Pending/Reviewing/Approved/Rejected)
3. Klik kartu laporan untuk melihat detail lengkap termasuk:
   - Alasan verifikasi
   - Skor spam & analisis sentimen
   - Riwayat diskusi
   - Sumber referensi

Atau gunakan fitur **Integrity Check** untuk verifikasi mandiri terhadap sumber resmi.`,
  'prosedur verifikasi': `Prosedur Standar Verifikasi (SOP):

1. **Screening Otomatis**: Sistem ML menilai spam score & ekstraksi klaim
2. **Assignment**: Laporan dialokasikan ke verifikator berdasarkan kategori
3. **Review Manual**: Verifikator memeriksa:
   - Kredibilitas sumber
   - Konsistensi dengan data resmi
   - Bukti pendukung (dokumen, foto, video)
4. **Penetapan Status**: Approved/Rejected/Misleading/Unconfirmed
5. **Dokumentasi**: Wajib isi alasan verifikasi untuk audit trail
6. **Notifikasi**: Sistem kirim update ke pelapor via WebSocket

Waktu target: < 24 jam untuk laporan prioritas tinggi.`,
  'threshold spam': `Konfigurasi Threshold Spam Score (default):

- **< 0.3**: Aman (lanjut ke verifikasi)
- **0.3 - 0.5**: Perlu review manual
- **0.5 - 0.7**: Prioritas rendah, flag untuk audit
- **> 0.7**: Otomatis ditolak / masuk karantina

Bisa diubah di **Pengaturan > Konfigurasi ML**. Perubahan memerlukan konfirmasi 2FA.`,
  'kelola akun': `Manajemen Akun Verifikator:

**Menambah Verifikator:**
1. Admin > Pengaturan > Manajemen User
2. Klik "Tambah Verifikator"
3. Isi: Email, Nama, Kategori Keahlian
4. Sistem kirim undangan + setup 2FA

**Menghapus/Nonaktifkan:**
1. Pilih user > "Nonaktifkan Akses"
2. Semua laporan yg ditangani dialokasikan ulang
3. Riwayat verifikasi tetap tersimpan (audit)

**Role:** Admin | Verifikator Senior | Verifikator Junior`,
};

function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('status') || lower.includes('laporan')) return MOCK_RESPONSES['status laporan'];
  if (lower.includes('prosedur') || lower.includes('verifikasi') || lower.includes('sop')) return MOCK_RESPONSES['prosedur verifikasi'];
  if (lower.includes('spam') || lower.includes('threshold') || lower.includes('skor')) return MOCK_RESPONSES['threshold spam'];
  if (lower.includes('akun') || lower.includes('verifikator') || lower.includes('user') || lower.includes('tambah') || lower.includes('hapus')) return MOCK_RESPONSES['kelola akun'];
  
  return `Terima kasih pertanyaannya. Sebagai asisten admin PICKME GARUDA, saya bisa membantu dengan:

• **Prosedur verifikasi** & SOP standar
• **Manajemen laporan** (filter, status, detail)
• **Konfigurasi ML** (threshold spam, model)
• **Manajemen verifikator** (tambah/hapus/role)
• **Integrity check** & analisis sumber

Silakan tanyakan hal spesifik atau pilih quick action di bawah.`;
}

export function AdminChatbot({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Halo! Saya **PICKME Assistant**, siap membantu tugas admin verifikasi hari ini.

Apa yang bisa saya bantu?
• Panduan prosedur verifikasi
• Cek status laporan
• Konfigurasi sistem ML
• Manajemen akun verifikator
• Atau pertanyaan bebas seputar sistem`,
          timestamp: new Date(),
          metadata: { confidence: 1, sources: ['system'] },
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const currentInput = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShowQuickActions(false);
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = getMockResponse(currentInput);
    
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      metadata: {
        confidence: 0.85 + Math.random() * 0.1,
        sources: ['knowledge-base', 'sop-document', 'system-config'],
      },
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    sendMessage();
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, feedback } : m
      )
    );
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-2xl hover:border-slate-600 transition-all duration-300 animate-pulse"
        aria-label="Buka chatbot admin"
      >
        <Bot className="h-7 w-7 text-slate-300" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md lg:max-w-lg h-[600px] lg:h-[700px] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Bot className="h-5 w-5 text-slate-300" />
          </div>
          <div>
            <p className="font-semibold text-slate-100">PICKME Assistant</p>
            <p className="text-xs text-slate-400">Asisten Admin Verifikasi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            aria-label="Toggle quick actions"
          >
            <Sparkles className="h-4 w-4 text-slate-300" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            aria-label="Tutup chatbot"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
        {showQuickActions && messages.length <= 1 && (
          <div className="space-y-2" role="list" aria-label="Quick actions">
            <p className="text-xs text-slate-500 px-2">Mulai dengan:</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="text-left p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-all text-sm"
                  role="listitem"
                >
                  <div className="flex items-center gap-2 text-slate-300 mb-1">
                    {action.icon}
                    <span className="font-medium text-slate-100">{action.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 animate-in fade-in duration-200',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center flex-col',
                message.role === 'user'
                  ? 'bg-slate-700'
                  : 'bg-slate-800 border border-slate-700'
              )}
            >
              {message.role === 'user' ? (
                <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <Bot className="h-4 w-4 text-slate-300" />
              )}
            </div>

            <div
              className={cn(
                'flex-1 max-w-[85%] space-y-2',
                message.role === 'user' ? 'text-right' : 'text-left'
              )}
            >
              <div
                className={cn(
                  'inline-block max-w-full px-4 py-3 rounded-2xl',
                  message.role === 'user'
                    ? 'bg-slate-700 text-slate-100 rounded-tr-sm'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                )}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                
                {message.metadata?.confidence && message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/50">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Kepercayaan: {(message.metadata.confidence * 100).toFixed(0)}%
                    </span>
                    {message.metadata.sources && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        Sumber: {message.metadata.sources.join(', ')}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                  {message.role === 'assistant' && (
                    <>
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1.5 rounded hover:bg-slate-700/50 transition-colors"
                        aria-label="Salin pesan"
                      >
                        <Copy className="h-3 w-3 text-slate-400" />
                      </button>
                      {!message.feedback && (
                        <>
                          <button
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className="p-1.5 rounded hover:bg-emerald-500/10 transition-colors"
                            aria-label="Membantu"
                          >
                            <ThumbsUp className="h-3 w-3 text-slate-400 hover:text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
                            aria-label="Tidak membantu"
                          >
                            <ThumbsDown className="h-3 w-3 text-slate-400 hover:text-red-400" />
                          </button>
                        </>
                      )}
                      {message.feedback === 'positive' && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Terima kasih!
                        </span>
                      )}
                      {message.feedback === 'negative' && (
                        <span className="text-xs text-amber-400">Akan diperbaiki</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-in fade-in duration-200">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="h-4 w-4 text-slate-300" />
            </div>
            <div className="flex-1 max-w-[85%]">
              <div className="inline-block px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
                  <span className="text-sm text-slate-400">Mengetik...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-800 bg-slate-800/50 backdrop-blur-sm p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Tanyakan prosedur, status laporan, konfigurasi..."
            rows={1}
            className="flex-1 resize-none rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            aria-label="Input pesan"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="h-10"
            aria-label="Kirim pesan"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-500 text-center mt-2">
          Enter untuk kirim • Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}