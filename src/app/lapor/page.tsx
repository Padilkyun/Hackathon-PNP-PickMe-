'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Info, Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'politik', label: '🏛️ Politik' },
  { value: 'ekonomi', label: '💰 Ekonomi' },
  { value: 'sosial', label: '👥 Sosial' },
  { value: 'teknologi', label: '💻 Teknologi' },
  { value: 'kesehatan', label: '🏥 Kesehatan' },
  { value: 'pendidikan', label: '📚 Pendidikan' },
  { value: 'hukum', label: '⚖️ Hukum' },
  { value: 'lainnya', label: '📦 Lainnya' },
];

export default function LaporPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'politik',
    source: '',
    url: '',
    excerpt: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
      else if (formData.title.trim().length < 10) newErrors.title = 'Judul minimal 10 karakter';
      if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
    }
    if (currentStep === 2) {
      if (!formData.source.trim()) newErrors.source = 'Sumber wajib diisi';
      if (formData.url.trim()) {
        try { new URL(formData.url); } catch { newErrors.url = 'Format URL tidak valid'; }
      }
    }
    if (currentStep === 3) {
      if (!formData.excerpt.trim()) newErrors.excerpt = 'Ringkasan wajib diisi';
      else if (formData.excerpt.trim().length < 20) newErrors.excerpt = 'Ringkasan minimal 20 karakter';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => router.push('/'), 3000);
  };

  const steps = [
    { num: 1, label: 'Judul & Kategori', desc: 'Informasi dasar laporan' },
    { num: 2, label: 'Sumber & Link', desc: 'Asal berita & tautan' },
    { num: 3, label: 'Ringkasan', desc: 'Kutipan isi berita' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <nav className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-300" />
              </button>
              <span className="text-lg font-semibold text-white">Lapor Berita</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {steps.map((s, i) => (
                <div key={s.num} className="hidden md:flex items-center gap-1">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                    step > s.num ? 'bg-emerald-500 text-black' :
                    step === s.num ? 'bg-slate-700 text-white' :
                    'bg-slate-800 text-slate-500'
                  )}>
                    {step > s.num ? <CheckCircle className="h-4 w-4" /> : s.num}
                  </span>
                  {i < steps.length - 1 && <div className={cn('w-12 h-0.5 rounded', step > s.num ? 'bg-emerald-500' : 'bg-slate-800')} />}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-3xl">
          {submitSuccess ? (
            <div className="text-center py-16 animate-in fade-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-50 mb-2">Laporan Terkirim!</h1>
              <p className="text-slate-400 mb-6">Terima kasih telah melaporkan. Tim verifikasi kami akan meninjau segera.</p>
              <p className="text-sm text-slate-500">Mengarahkan ke beranda dalam 3 detik...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-50">Lapor Berita Mencurigakan</h1>
                    <p className="text-sm text-slate-400">Bantu kami mengidentifikasi hoaks & misleading content di Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 md:p-8 space-y-8">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-50">
                      Langkah {step} dari 3: {steps[step - 1].label}
                    </h2>
                    <span className="text-sm text-slate-400">{steps[step - 1].desc}</span>
                  </div>

                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="title" className="block text-sm text-slate-300 mb-2">
                          Judul Berita <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          placeholder="Masukkan judul berita yang dilaporkan"
                          maxLength={120}
                          className={cn(
                            'w-full rounded-xl bg-slate-800 border px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400',
                            errors.title ? 'border-red-500' : 'border-slate-700'
                          )}
                          autoFocus
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                        <p className="mt-1 text-xs text-slate-500 text-right">{formData.title.length}/120</p>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-300 mb-2">
                          Kategori <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleChange('category', e.target.value)}
                          className={cn(
                            'w-full rounded-xl bg-slate-800 border px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 appearance-none',
                            errors.category ? 'border-red-500' : 'border-slate-700'
                          )}
                        >
                          {CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="source" className="block text-sm text-slate-300 mb-2">
                          Sumber / Media <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="source"
                          type="text"
                          value={formData.source}
                          onChange={(e) => handleChange('source', e.target.value)}
                          placeholder="Contoh: Kompas.com, Detik.com, Twitter, WhatsApp"
                          maxLength={60}
                          className={cn(
                            'w-full rounded-xl bg-slate-800 border px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400',
                            errors.source ? 'border-red-500' : 'border-slate-700'
                          )}
                        />
                        {errors.source && <p className="mt-1 text-sm text-red-400">{errors.source}</p>}
                        <p className="mt-1 text-xs text-slate-500 text-right">{formData.source.length}/60</p>
                      </div>

                      <div>
                        <label htmlFor="url" className="block text-sm text-slate-300 mb-2">
                          Link Sumber (Opsional)
                        </label>
                        <input
                          id="url"
                          type="url"
                          value={formData.url}
                          onChange={(e) => handleChange('url', e.target.value)}
                          placeholder="https://..."
                          className={cn(
                            'w-full rounded-xl bg-slate-800 border px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400',
                            errors.url ? 'border-red-500' : 'border-slate-700'
                          )}
                        />
                        {errors.url && <p className="mt-1 text-sm text-red-400">{errors.url}</p>}
                        <p className="mt-1 text-xs text-slate-500">Masukkan URL asli berita untuk memudahkan verifikasi</p>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="excerpt" className="block text-sm text-slate-300 mb-2">
                          Ringkasan / Kutipan Isi Berita <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => handleChange('excerpt', e.target.value)}
                          placeholder="Tulis ringkasan atau kutipan bagian yang mencurigakan..."
                          rows={5}
                          maxLength={500}
                          className={cn(
                            'w-full rounded-xl bg-slate-800 border px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none',
                            errors.excerpt ? 'border-red-500' : 'border-slate-700'
                          )}
                        />
                        {errors.excerpt && <p className="mt-1 text-sm text-red-400">{errors.excerpt}</p>}
                        <p className="mt-1 text-xs text-slate-500 text-right">{formData.excerpt.length}/500</p>
                      </div>

                      <div className="rounded-xl border border-slate-800/50 bg-slate-800/30 p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-slate-300 space-y-1">
                            <p className="font-medium">Sebelum mengirim, pastikan:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Judul & ringkasan mewakili isi berita sebenarnya</li>
                              <li>Sumber terpercaya atau link asli tersedia</li>
                              <li>Kategori sesuai dengan topik berita</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                    {step > 1 && (
                      <Button type="button" variant="ghost" onClick={handleBack} className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                      </Button>
                    )}
                    <div className="flex-1" />
                    {step < 3 ? (
                      <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
                        Selanjutnya <ArrowLeft className="h-4 w-4 -rotate-90 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Kirim Laporan
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              <div className="mt-6 text-center text-xs text-slate-500">
                <p>Dengan mengirim laporan, Anda menyetujui <a href="#" className="underline hover:text-slate-300">Syarat & Ketentuan</a> PICKME GARUDA.</p>
                <p className="mt-1">Data laporan akan diproses oleh tim verifikasi sesuai prosedur standar.</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}