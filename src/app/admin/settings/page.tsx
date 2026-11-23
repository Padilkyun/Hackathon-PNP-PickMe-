'use client';
import { User, Shield, Bell, Key, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Pengaturan Admin</h1>
        <p className="text-slate-400 mt-1">Kelola profil, keamanan, dan konfigurasi sistem</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-slate-300" />
            <h3 className="font-semibold text-slate-100">Profil Admin</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-slate-300 mb-1">Nama Lengkap</label>
              <input id="name" defaultValue="Admin PICKME" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-slate-300 mb-1">Email</label>
              <input id="email" type="email" defaultValue="admin@pickme-garuda.id" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
          </div>
          <Button variant="primary" size="sm"><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</Button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-slate-300" />
            <h3 className="font-semibold text-slate-100">Keamanan</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start"><Key className="h-4 w-4 mr-2" /> Ganti Password</Button>
            <Button variant="outline" size="sm" className="w-full justify-start"><Shield className="h-4 w-4 mr-2" /> Aktifkan 2FA (TOTP)</Button>
            <Button variant="outline" size="sm" className="w-full justify-start"><Bell className="h-4 w-4 mr-2" /> Kelola Sesi Aktif</Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-slate-300" />
            <h3 className="font-semibold text-slate-100">Notifikasi</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer text-slate-200">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-slate-400" />
              <span>Email saat ada laporan pending baru</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer text-slate-200">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-slate-400" />
              <span>Push notification real-time di dashboard</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer text-slate-200">
              <input type="checkbox" className="w-4 h-4 accent-slate-400" />
              <span>Laporan harian ringkasan sentimen</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-slate-300" />
            <h3 className="font-semibold text-slate-100">Konfigurasi ML / NLP</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Endpoint ML Service</label>
              <input defaultValue="https://ml.pickme-garuda.dev" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Threshold Spam Score</label>
              <input type="number" step="0.01" defaultValue="0.5" min="0" max="1" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
            <Button variant="primary" size="sm"><Save className="h-4 w-4 mr-2" /> Simpan Konfigurasi ML</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
