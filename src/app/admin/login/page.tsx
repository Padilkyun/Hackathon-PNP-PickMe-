'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@pickme-garuda.id');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`[DEMO] Login admin dengan ${email}`);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-800/50 backdrop-blur-sm p-8 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-slate-800/30 border border-slate-800 mb-4">
            <Shield className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-50 mb-2">Admin Login</h2>
          <p className="text-sm text-slate-400 mt-2">Masuk untuk mengelola laporan berita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm text-slate-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-10 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-10 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Masuk ke Dashboard
          </Button>
        </form>

        <p className="text-xs text-slate-500 text-center">
          Hanya admin berwenang. Aktivitas login dicatat untuk audit.
        </p>
      </div>
    </div>
  );
}
