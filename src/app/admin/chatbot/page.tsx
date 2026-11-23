'use client';
import { AdminChatbot } from '@/components/admin/AdminChatbot';
import { Bot, Sparkles, Shield, BookOpen, Settings, Users, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  {
    icon: Bot,
    title: 'Panduan Verifikasi Real-time',
    description: 'Dapatkan jawaban instan tentang SOP verifikasi, status laporan, dan prosedur standar tanpa mencari dokumen manual.',
  },
  {
    icon: Shield,
    title: 'Bantuan Konfigurasi Sistem',
    description: 'Tanya threshold spam, parameter ML, pengelolaan verifikator, dan pengaturan notifikasi langsung ke asisten.',
  },
  {
    icon: BookOpen,
    title: 'Akses Cepat Knowledge Base',
    description: 'Asisten terhubung ke knowledge base internal: FAQ, troubleshooting, best practice, dan changelog sistem.',
  },
  {
    icon: Users,
    title: 'Manajemen Tim Verifikator',
    description: 'Panduan onboarding verifikator baru, alokasi kasus, monitoring performa, dan eskalasi kompleks.',
  },
  {
    icon: Settings,
    title: 'Integrity Check Assistant',
    description: 'Bantuan langkah-demi-langkah untuk menggunakan fitur Integrity Check: input URL/teks, baca hasil, interpretasi skor.',
  },
  {
    icon: Sparkles,
    title: 'Continuous Learning',
    description: 'Feedback Anda (thumbs up/down) melatih asisten untuk jawaban lebih akurat dan kontekstual di masa depan.',
  },
];

export default function AdminChatbotPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Asisten AI Admin</h1>
          <p className="text-slate-400 mt-1">Chatbot cerdas untuk bantuan verifikasi, konfigurasi, & manajemen sistem</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800/50 border border-slate-700 text-slate-300">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Beta v1.2</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[700px]">
          <AdminChatbot defaultOpen />
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h3 className="font-semibold text-slate-100">Kemampuan Utama</h3>
            </div>
            <div className="space-y-4">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-100 text-sm">{feature.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-slate-300" />
              <h3 className="font-semibold text-slate-100">Contoh Pertanyaan</h3>
            </div>
            <div className="space-y-2 text-sm">
              {[
                '"Bagaimana SOP verifikasi laporan prioritas tinggi?"',
                '"Threshold spam score default berapa?"',
                '"Cara tambah verifikator kategori kesehatan"',
                '"Jelaskan fitur Integrity Check"',
                '"Status laporan rpt-001 sekarang apa?"',
                '"Prosedur eskalasi ke admin senior?"',
              ].map((q, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-800/30 border border-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  {q}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-slate-800/30 border border-slate-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-slate-100">Keamanan & Privasi</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Data chat tidak disimpan permanen (hanya sesi aktif)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Akses terbatas untuk role admin & verifikator
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Tidak merekam kredensial atau data sensitif
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                Audit trail terpisah untuk tindakan kritis
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}