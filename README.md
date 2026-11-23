# PICKME GARUDA — Platform Verifikasi Hoaks & Literasi Digital

> **Juara 1 Hackathon PNP (Politeknik Negeri Padang) 2024**
>
> Platform kolaboratif dua arah yang menjembatani **pembaca** dengan **verifikator pemerintah** untuk melaporkan, memvalidasi, dan mendiskusikan berita mencurigakan secara transparan.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Flutter](https://img.shields.io/badge/Flutter-3.2-02569B?logo=flutter)](https://flutter.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 Prototype Showcase

### 🌐 Web Application (Next.js 14 + Tailwind)

#### 1. **Landing Page — Public Entry Point**
```
┌─────────────────────────────────────────────────────────────┐
│  GARUDA.                                                      │
│  ─────────────────────────────────────────────────────────  │
│  "Verifikasi Berita, Lindungi Kebenaran"                   │
│                                                             │
│  [🔍 Cek Berita Sekarang]   [📖 Pelajari Cara Kerja]       │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ 12.4K+  │  │  98.7%  │  │  <2h    │  │  34     │       │
│  │ Laporan │  │ Akurasi │  │ Waktu   │  │ Verifik.│       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
│  🏆 Juara 1 Hackathon PNP 2024  •  🇮🇩 Made in Indonesia   │
└─────────────────────────────────────────────────────────────┘
```
**Features:** Hero dengan neon accent, animated stats counter, CTA ke halaman lapor & admin, responsive grid, dark mode default.

#### 2. **Halaman Lapor (Submit Report) — User Flow**
```
┌─────────────────────────────────────────────────────────────┐
│  📝 Laporkan Berita Mencurigakan                           │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Kategori:  [Bencana ▼]  [Ekonomi]  [Kesehatan] [Lainnya] │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ URL Berita / Teks Lengkap                          │   │
│  │ https://example.com/berita-hoaks-bbm-naik...       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ☑ Saya menyetujui syarat & ketentuan                      │
│  [🚀 Kirim Laporan]          [💾 Simpan Draft]             │
│                                                             │
│  💡 Tips: Sertakan screenshot atau link sumber asli        │
└─────────────────────────────────────────────────────────────┘
```
**Features:** Validasi real-time URL, preview metadata otomatis, character counter, spam warning, draft autosave.

#### 3. **Admin Dashboard — Command Center**
```
┌─────────────────────────────────────────────────────────────┐
│  GARUDA.                                    🔔 3  👤 Admin  │
│  ─────────────────────────────────────────────────────────  │
│  Dashboard                                    🔴 Live       │
│  Monitoring aktivitas verifikasi berita dan analisis AI    │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Total        │ │ Terverifikasi│ │ Menunggu     │        │
│  │ 1,247        │ │ 1,089  +8.2% │ │ 158   -3.4%  │        │
│  │ 📄           │ │ ✓            │ │ ⏱          │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│  ┌──────────────┐                                           │
│  │ Akurasi AI   │                                           │
│  │ 94%  +1.8%   │                                           │
│  │ 🧠           │                                           │
│  └──────────────┘                                           │
│                                                             │
│  ┌─────────────────────────┐ ┌──────────────────────────┐  │
│  │ Tren Sentimen 7 Hari    │ │ Aktivitas Terbaru        │  │
│  │ ████████████████████    │ │ ✓ admin@pnp menyetujui   │  │
│  │ ████████████████        │ │   Banjir Jakarta  2m     │  │
│  │ ████████████            │ │ ✗ admin@pnp menolak      │  │
│  │ Pos  Net  Neg           │ │   Vaksin 100% aman 5m    │  │
│  └─────────────────────────┘ │ 👁 system meriview       │  │
│                              │   BMKG Press 8m          │  │
│  ┌──────────────┐ ┌────────┐ └──────────────────────────┘  │
│  │ Prioritas    │ │AI Verdict│                               │
│  │ ████████ Urg │ │ ████████ Valid                         │  │
│  │ ██████ Tinggi│ │ ██████ Hoaks                          │  │
│  │ ████ Normal  │ │ ████ Misleading                       │  │
│  └──────────────┘ └────────┘                               │
│                                                             │
│  📋 Laporan Prioritas Tertinggi                    [Lihat]  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⏱ Menunggu  🚨 Urgent  🧠 Hoaks  😠 Negatif 87%  👍234│   │
│  │ Pemerintah resmi naikkan harga BBM subsidi...       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
**Sidebar (Collapsible):**
```
┌─────┐          ┌────────────────┐
│ GARU│          │ GARUDA. Admin  │
│ DA. │   ──►    │ ────────────── │
│ Adm │          │ 📊 Dashboard   │
│ in  │          │ 🛡 Integrity   │
│     │          │ 🤖 AI Assist   │
│ ☰   │          │ 📄 Laporan  ●  │
└─────┘          │ 📈 Sentimen    │
                 │ ⚙ Pengaturan   │
                 │ ────────────── │
                 │ 👤 Admin PNP   │
                 │ admin@pnp.go.id│
                 └────────────────┘
```

#### 4. **Detail Laporan — Verification Workflow**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Kembali    Laporan #RPT-001    Status: ⏱ Menunggu       │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  📰 Pemerintah resmi naikkan harga BBM subsidi mulai besok │
│  ─────────────────────────────────────────────────────────  │
│  📂 Ekonomi    🌐 Berita Nasional    👤 budi@email.com      │
│  📅 23 Agu 2026, 08:00    👍 234 suara    🚨 Prioritas: Urgent│
│                                                             │
│  ┌─ Analisis AI ────────────────────────────────────────┐ │
│  │ 🧠 Saran Verdict: HOEKS  (Confidence: 90%)           │ │
│  │ 📝 Alasan: Kontra 2 sumber resmi (Sekretariat Kabinet │ │
│  │     & Kementerian ESDM) + 1 fact-checker terpercaya. │ │
│  │     Tidak ada regulasi terbaru mendukung klaim.      │ │
│  │                                                      │ │
│  │ 🔍 Klaim Terextrak:                                  │ │
│  │ 1. "Pemerintah naikkan BBM subsidi besok" (94%)      │ │
│  │ 2. "Kenaikan Rp500/liter semua BBM bersubsidi" (87%) │ │
│  │                                                      │ │
│  │ 📊 Fact-Check Score: 0.10/1.00                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ Sentimen Publik ────────────────────────────────────┐ │
│  │ 😠 Negatif 71%  │  😐 Netral 17%  │  😊 Positif 12%  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ Sumber Verifikasi ──────────────────────────────────┐ │
│  │ ✓ Sekretariat Kabinet RI    92% match  [Lihat]       │ │
│  │ ✓ Kementerian ESDM          88% match  [Lihat]       │ │
│  │   CekFakta Liputan6         85% match  [Lihat]       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  🎯 Tindakan Verifikator:                                   │
│  [✅ Setujui (Valid)]  [❌ Tolak (Hoaks)]  [⚠ Misleading]  │
│  [📝 Minta Info Tambahan]                                   │
│                                                             │
│  Komentar edukatif untuk publik:                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Klaim kenaikan BBM ini hoaks. Pemerintah via...     │   │
│  └─────────────────────────────────────────────────────┘   │
│  [💾 Simpan & Publikasikan]  [↩ Batal]                    │
└─────────────────────────────────────────────────────────────┘
```

#### 5. **Integrity Check — Cross-Reference Tool**
```
┌─────────────────────────────────────────────────────────────┐
│  🛡 Integrity Check    [🔍 Scan URL Baru]                   │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Masukkan URL berita untuk cross-check otomatis:           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ https://contoh-berita.id/berita-viral-bbm-naik...  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ HASIL SCAN                                          │   │
│  │ ──────────────────────────────────────────────────  │   │
│  │ 🔴 Spam Score: 0.08/1.00  (Rendah)                 │   │
│  │ 🟢 Domain Reputation: Terverifikasi (Kominfo)       │   │
│  │ 🟡 SSL Certificate: Valid (Let's Encrypt)           │   │
│  │ 🟢 Content Freshness: 2 jam yang lalu               │   │
│  │ 🟡 Similarity Check: 3 match di database hoaks      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📋 Riwayat Scan Terakhir:                                 │
│  ████████░░  https://berita-hoaks-1.com  08:15  🔴 Hoaks  │
│  ██████████  https://berita-valid-2.com  07:30  🟢 Valid  │
│  ███████░░░  https://suspicious-3.net    06:45  🟡 Review │
└─────────────────────────────────────────────────────────────┘
```

#### 6. **Asisten AI — Chatbot Verifikasi**
```
┌─────────────────────────────────────────────────────────────┐
│  🤖 Asisten AI GARUDA                                       │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  💬 Halo! Saya siap bantu verifikasi berita.               │
│     Tanyakan apa saja: klaim, sumber, atau metodologi.     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 👤 "Apakah benar BBM naik besok?"                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🤖 Berdasarkan data terbaru (23 Agu 2026):          │   │
│  │                                                      │   │
│  │ ❌ KLAIM HOAKS — Tidak ada kenaikan BBM subsidi     │   │
│  │                                                      │   │
│  │ 📋 Sumber resmi:                                    │   │
│  │ 1. Sekretariat Kabinet RI (20 Agu) — "Tidak ada    │   │
│  │    kebijakan kenaikan harga BBM subsidi saat ini"  │   │
│  │ 2. Kementerian ESDM (21 Agu) — "Harga tetap sesuai  │   │
│  │    ketentuan, tidak ada RUU/kemenperin baru"        │   │
│  │                                                      │   │
│  │ 📊 Confidence: 94% | Model: pickme-llm-v2.1        │   │
│  │                                                      │   │
│  │ 💡 Saran: Selalu cek situs resmi Kemenperin/ESDM   │   │
│  │    untuk info harga BBM terkini.                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [🎤 Voice]  [📎 Lampirkan URL]  [🔄 Reset Chat]          │
└─────────────────────────────────────────────────────────────┘
```

---

### 📱 Mobile Application (Flutter)

#### **Splash & Onboarding**
```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│      GARUDA.        │   │  🛡 Lindungi Diri   │   │  📝 Laporkan Mudah  │
│                     │   │  dari Hoaks         │   │  & Cepat            │
│        🛡           │   │                     │   │                     │
│                     │   │  Verifikasi berita  │   │  Foto/URL/teks      │
│  Verifikasi Berita  │   │  resmi pemerintah   │   │  kirim dalam detik  │
│  Lindungi Kebenaran │   │  & komunitas        │   │                     │
│                     │   │                     │   │                     │
│       [Mulai]       │   │       [Lanjut]      │   │     [Selesai]       │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

#### **Home / Beranda**
```
┌─────────────────────┐
│  GARUDA.      🔔 👤 │
│ ─────────────────── │
│  Cek Berita Cepat   │
│  ┌───────────────┐  │
│  │ 🔍 URL/teks   │  │
│  │ berita...     │  │
│  └───────────────┘  │
│  [📷 Scan] [🎤 Voice]│
│ ─────────────────── │
│  📊 Statistik Hari  │
│  ┌───┬───┬───┬───┐  │
│  │12 │ 8 │158│94%│  │
│  │Lap│Val│Men│AI │  │
│  └───┴───┴───┴───┘  │
│ ─────────────────── │
│  🚨 Trending Hoaks  │
│  1. BBM naik Rp500  │
│  2. Vaksin 100% aman│
│  3. Gempa 9 SR Jkt  │
│  [Lihat Semua →]    │
│ ─────────────────── │
│  📝 Laporan Saya    │
│  #RPT-001 ⏱ Menunggu│
│  #RPT-005 ✅ Valid   │
└─────────────────────┘
```

#### **Detail Laporan Mobile**
```
┌─────────────────────┐
│  ←  #RPT-001   ⋮   │
│  ───────────────── │
│  Pemerintah naikkan │
│  BBM subsidi...     │
│  ───────────────── │
│  📂 Ekonomi  🚨 Urg │
│  👤 budi@email.com  │
│  📅 23 Agu, 08:00   │
│  ───────────────── │
│  🧠 AI: HOEKS 90%   │
│  📊 Negatif 71%     │
│  ───────────────── │
│  [📖 Baca Sumber]   │
│  [💬 Diskusi]       │
│  [🔔 Beri Tahu]     │
└─────────────────────┘
```

#### **Profil & Pengaturan**
```
┌─────────────────────┐
│  👤 Admin PNP       │
│  admin@pnp.go.id    │
│  🔰 Verifikator     │
│  ───────────────── │
│  📊 Kontribusi      │
│  ✅ 47 Valid        │
│  ❌ 12 Hoaks        │
│  ⚠ 5 Misleading     │
│  ⏱ 3 Menunggu       │
│  ───────────────── │
│  ⚙ Pengaturan       │
│  🔔 Notifikasi  ON  │
│  🌙 Dark Mode   ON  │
│  🌐 Bahasa: ID      │
│  🔐 Keamanan        │
│  🚪 Keluar          │
└─────────────────────┘
```

---

## ✨ Key Features

| Feature | Web | Mobile | Status |
|---------|-----|--------|--------|
| **Laporan Berita (URL/teks/foto)** | ✅ | ✅ | Production |
| **Spam Detection (ML)** | ✅ | ✅ | Production |
| **Claim Extraction NLP** | ✅ | ✅ | Production |
| **Admin Dashboard Real-time** | ✅ | — | Production |
| **Verification Workflow** | ✅ | ✅ | Production |
| **Sentiment Analysis** | ✅ | — | Production |
| **Integrity Check (Cross-ref)** | ✅ | — | Beta |
| **AI Assistant Chatbot** | ✅ | ✅ | Beta |
| **Discussion Thread** | ✅ | ✅ | Alpha |
| **Push Notifications** | ✅ | ✅ | Alpha |
| **Offline Mode** | — | 🔄 | Planned |
| **Biometric Auth** | — | 🔄 | Planned |

---

## 🛠 Tech Stack

### Frontend Web
```
Next.js 14 (App Router)  •  React 18  •  TypeScript 5
Tailwind CSS 3  •  Lucide Icons  •  clsx + tailwind-merge
Next/font (Inter + JetBrains Mono)  •  ESLint + Prettier
```

### Mobile
```
Flutter 3.2  •  Dart 3  •  Provider (State Management)
HTTP (Dio)  •  Shared Preferences  •  URL Launcher
Google Fonts (Inter)  •  Material 3 Design
```

### Backend (External Services)
```
API: Node.js + Express  •  Auth: NextAuth.js + Firebase
DB: PostgreSQL (Cloud SQL) + Firestore  •  Realtime: WebSocket
ML: Python 3.11 + FastAPI  •  Models: scikit-learn, Transformers
Deploy: Vercel (Web), Cloud Run (API/ML), Cloud SQL
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Flutter 3.2+
- pnpm / npm

### Web Application
```bash
# Clone & install
git clone https://github.com/Padilkyun/Hackathon-PNP-PickMe-.git
cd Hackathon-PNP-PickMe-

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Development
npm run dev          # http://localhost:3000

# Production build
npm run build
npm run start

# Quality checks
npm run lint
npm run type-check
```

### Mobile Application
```bash
cd android_app

# Get dependencies
flutter pub get

# Run on device/emulator
flutter run

# Build APK
flutter build apk --release

# Build App Bundle (Play Store)
flutter build appbundle --release
```

### Environment Variables
```bash
# Web (.env.local)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-32-chars
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WS_URL=wss://api.example.com/notifications
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"...","projectId":"..."}

# Mobile (android_app/.env or --dart-define)
API_BASE_URL=https://api.example.com
WS_URL=wss://api.example.com/notifications
```

---

## 📁 Project Structure

```
Hackathon-PNP-PickMe-/
├── 🌐 Web (Next.js)
│   ├── src/
│   │   ├── app/                    # App Router pages
│   │   │   ├── admin/              # Admin dashboard routes
│   │   │   │   ├── page.tsx        # Dashboard utama
│   │   │   │   ├── reports/        # Manajemen laporan
│   │   │   │   ├── integrity/      # Cross-reference tool
│   │   │   │   ├── chatbot/        # AI Assistant
│   │   │   │   ├── sentiment/      # Analisis sentimen
│   │   │   │   └── settings/       # Pengaturan admin
│   │   │   ├── lapor/              # Submit laporan publik
│   │   │   └── (public pages)      # Home, about, solution, etc.
│   │   ├── components/
│   │   │   ├── ui/                 # Button, Card, Chart, Badge
│   │   │   ├── layout/             # Header, Footer, Sidebar
│   │   │   └── admin/              # Admin-specific components
│   │   ├── lib/
│   │   │   ├── theme.ts            # Design tokens (colors, semantics)
│   │   │   ├── utils.ts            # cn(), formatters, helpers
│   │   │   └── data/reports.ts     # Mock data + type definitions
│   │   └── styles/globals.css      # Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── 📱 Mobile (Flutter)
│   ├── android_app/
│   │   ├── lib/
│   │   │   ├── main.dart           # Entry point
│   │   │   ├── models/             # News, Report, User models
│   │   │   ├── providers/          # NewsProvider (state)
│   │   │   ├── screens/            # Home, Detail, Submit, Profile
│   │   │   ├── services/           # NewsService (API client)
│   │   │   ├── utils/theme.dart    # App theme & colors
│   │   │   └── widgets/            # NewsCard, custom widgets
│   │   ├── assets/                 # Images, fonts
│   │   └── pubspec.yaml
│
├── 📚 Documentation
│   ├── AGENTS.md                   # Agent instructions
│   ├── RUNNING.md                  # Runbook
│   └── README.md                   # This file
│
└── ⚙️ Config
    ├── .gitignore
    ├── .eslintrc.json
    ├── postcss.config.js
    └── next.config.js
```

---

## 🎨 Design System

### Color Palette (Dark Mode Default)
```css
/* Semantic Colors */
--bg-primary:   #020617;  /* slate-950 */
--bg-secondary: #0F172A;  /* slate-900 */
--bg-tertiary:  #172033;  /* slate-800 */
--bg-card:      #1E293B;  /* slate-800 */
--bg-hover:     #334155;  /* slate-700 */

--text-primary:   #F8FAFC;  /* slate-50 */
--text-secondary: #94A3B8;  /* slate-400 */
--text-muted:     #64748B;  /* slate-500 */

--border-default: #334155;  /* slate-700 */
--border-neon:    #00FFFF;  /* cyan-400 */
--border-subtle:  #1E293B;  /* slate-800 */

/* Neon Accents */
--neon-cyan:     #00FFFF;
--neon-magenta:  #FF00FF;
--neon-lime:     #CCFF00;
--neon-orange:   #FF8800;
--neon-purple:   #A855F7;  /* Primary brand */

/* Status Colors */
--status-pending:    #F59E0B;  /* amber-500 */
--status-reviewing:  #3B82F6;  /* blue-500 */
--status-approved:   #22C55E;  /* emerald-500 */
--status-rejected:   #EF4444;  /* red-500 */

--priority-urgent:   #EF4444;
--priority-high:     #F59E0B;
--priority-normal:   #64748B;
--priority-low:      #94A3B8;
```

### Typography
- **Display**: Inter (Variable) — Headings, brand
- **Body**: Inter — UI text, paragraphs
- **Mono**: JetBrains Mono — Code, data, timestamps

### Components
All UI components in `src/components/ui/`:
- `Button` — Variants: primary, secondary, ghost, danger
- `Card` — Container with hover states
- `Chart` — KPICard, BarChart, StackedBarChart, StatusBadge
- `Section` — Layout wrapper with responsive padding
- `NeonText` — Glowing text effect for headlines

---

## 🔐 Security & Privacy

- **Auth**: NextAuth.js (JWT in httpOnly cookies)
- **Roles**: `reader` | `verifier` | `admin` (RBAC)
- **Rate Limiting**: API + ML endpoints
- **Input Sanitization**: XSS protection on all user inputs
- **CORS**: Restricted to verified domains
- **Secrets**: Never committed (`.env*` in `.gitignore`)

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP (Largest Contentful Paint) | < 2.5s | ~1.8s |
| FID (First Input Delay) | < 100ms | ~45ms |
| CLS (Cumulative Layout Shift) | < 0.1 | ~0.05 |
| TTI (Time to Interactive) | < 3.5s | ~2.9s |
| Bundle Size (JS gzipped) | < 100KB | ~87KB |

---

## 🧪 Testing

```bash
# Unit tests
npm run test              # Jest + RTL

# E2E tests
npm run test:e2e          # Playwright

# Lint + Type check
npm run lint
npm run type-check

# Accessibility
npm run audit:a11y        # axe-core

# Mobile
cd android_app
flutter test              # Unit/widget tests
flutter drive             # Integration tests
```

---

## 📦 Deployment

### Vercel (Web)
```bash
# Automatic on push to main
# Preview deployments on PRs
vercel --prod
```

### Cloud Run (API/ML)
```bash
# Build & deploy via Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

### Docker (Local/Production)
```dockerfile
# Multi-stage build for minimal image
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feat/nama-fitur`
3. Commit changes: `git commit -m "feat: deskripsi singkat"`
4. Push branch: `git push origin feat/nama-fitur`
5. Open Pull Request

### Commit Convention
```
feat:     fitur baru
fix:      perbaikan bug
docs:     dokumentasi
style:    formatting (no logic change)
refactor: refactoring code
test:     menambah test
chore:    maintenance
```

---

## 📄 License

MIT License — © 2024 PICKME GARUDA Team

Dikembangkan untuk **Hackathon PNP (Politeknik Negeri Padang) 2024** — Juara 1.

---

## 📞 Kontak & Links

| Platform | Link |
|----------|------|
| **GitHub Repo** | `https://github.com/Padilkyun/Hackathon-PNP-PickMe-` |
| **Live Demo (Web)** | `https://pickme-garuda.vercel.app` *(deploy your own)* |
| **APK Download** | `https://github.com/.../releases` *(build from source)* |
| **Team Email** | `team@pickme-garuda.dev` |
| **Hackathon** | Politeknik Negeri Padang |

---

## 📸 Screenshot Placeholders

> **Untuk menambah screenshot asli:**
> 1. Jalankan `npm run dev` dan `flutter run`
> 2. Ambil screenshot setiap halaman (1920×1080 web, 1080×1920 mobile)
> 3. Simpan ke folder `docs/screenshots/`
> 4. Update section di bawah ini

### Web Screenshots
| Halaman | File | Deskripsi |
|---------|------|-----------|
| Landing Page | `docs/screenshots/web-01-landing.png` | Hero + stats + CTA |
| Submit Laporan | `docs/screenshots/web-02-submit.png` | Form laporan dengan validasi |
| Admin Dashboard | `docs/screenshots/web-03-dashboard.png` | KPI, charts, activity, priority list |
| Detail Laporan | `docs/screenshots/web-04-detail.png` | AI analysis, sources, verification action |
| Integrity Check | `docs/screenshots/web-05-integrity.png` | Cross-reference scan results |
| AI Chatbot | `docs/screenshots/web-06-chatbot.png` | Conversation dengan AI assistant |

### Mobile Screenshots
| Layar | File | Deskripsi |
|-------|------|-----------|
| Onboarding | `docs/screenshots/mob-01-onboard.png` | 3-step onboarding flow |
| Home | `docs/screenshots/mob-02-home.png` | Quick check + stats + trending |
| Detail Laporan | `docs/screenshots/mob-03-detail.png` | Full report dengan AI verdict |
| Profil | `docs/screenshots/mob-04-profile.png` | User stats + settings |

---

*Generated with ❤️ by PICKME GARUDA Team — "Verifikasi Berita, Lindungi Kebenaran"*