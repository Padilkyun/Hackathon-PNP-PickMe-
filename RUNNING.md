# PICKME GARUDA — Running Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | included with Node.js |
| Flutter | 3.2+ | https://flutter.dev/docs/get-started/install |
| Android Studio / VS Code | latest | for mobile development |

---

## Web (Next.js 14)

```bash
# 1. Masuk ke root project
cd D:\Project\IoTAI\Hackathon PNP Garuda

# 2. Install dependencies
npm install

# 3. Development server (hot reload)
npm run dev
# → buka http://localhost:3000

# 4. Production build
npm run build

# 5. Serve production build
npm run start
# → http://localhost:3000
```

### Useful Commands
```bash
npm run lint        # ESLint check
npm run type-check  # TypeScript check (tsc --noEmit)
```

### Environment Variables
Buat file `.env.local` di root (tidak di-commit):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_API_URL=https://api.pickme-garuda.dev
NEXT_PUBLIC_WS_URL=wss://api.pickme-garuda.dev/notifications
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"...","projectId":"..."}
```

---

## Mobile (Flutter)

```bash
# 1. Masuk ke folder android_app
cd D:\Project\IoTAI\Hackathon PNP Garuda\android_app

# 2. Install dependencies
flutter pub get

# 3. Cek device/emulator tersedia
flutter devices

# 4. Run di device/emulator
flutter run

# 5. Build APK (release)
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk

# 6. Build App Bundle (Play Store)
flutter build appbundle --release
```

### Flutter Requirements
- Android SDK: API 21+ (minSdk 3.2.0)
- iOS: Xcode 14+ (jika target iOS)

---

## Project Structure

```
pickme-garuda/
├── src/                    # Next.js Web App
│   ├── app/               # App Router pages
│   │   ├── admin/         # Admin dashboard (protected)
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── reports/           # Queue & detail
│   │   │   ├── integrity/         # Integrity Check
│   │   │   ├── chatbot/           # AI Assistant
│   │   │   ├── sentiment/         # Sentiment analytics
│   │   │   └── settings/          # Config
│   │   └── lapor/         # Public submission
│   ├── components/        # React components
│   │   ├── admin/         # Admin-specific
│   │   ├── layout/        # Header, Footer
│   │   └── ui/            # Button, Card, Section
│   ├── lib/               # Utils, theme, data
│   └── styles/            # globals.css
├── android_app/           # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart      # Entry point
│   │   ├── screens/       # submit_screen, news_list, etc.
│   │   ├── providers/     # news_provider (state)
│   │   ├── services/      # news_service (HTTP)
│   │   ├── models/        # news.dart
│   │   └── utils/         # theme.dart
│   └── pubspec.yaml
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## Key Routes (Web)

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/lapor` | Public submission form (3-step) |
| `/admin` | Dashboard (KPI, charts, live activity) |
| `/admin/reports` | Queue with filters (status, priority, search) |
| `/admin/reports/[id]` | Detail + LLM analysis + verification |
| `/admin/integrity` | URL/text verification vs official sources |
| `/admin/chatbot` | AI assistant for admin |
| `/admin/sentiment` | Sentiment analytics |
| `/admin/settings` | Profile, security, ML config |
| `/admin/login` | Admin login (demo) |

---

## Tech Stack

**Web:**
- Next.js 14 (App Router, React 18)
- TypeScript strict mode
- Tailwind CSS (dark mode: class strategy)
- lucide-react icons
- clsx + tailwind-merge

**Mobile:**
- Flutter 3.2+
- Provider state management
- HTTP package for API
- Google Fonts (Inter)

---

## Development Workflow

```bash
# 1. Start web dev server (terminal 1)
npm run dev

# 2. Start Flutter (terminal 2)
cd android_app && flutter run

# 3. Edit code → hot reload otomatis
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| `npm run dev` port 3000 busy | `npm run dev -- -p 3001` |
| Flutter doctor issues | `flutter doctor -v` → fix missing SDK/license |
| TypeScript errors | `npm run type-check` untuk detail |
| Tailwind not applying | Restart dev server, check `content` di `tailwind.config.js` |

---

## Deployment

**Web (Vercel):**
1. Push ke GitHub
2. Import di Vercel
3. Set environment variables
4. Deploy

**Mobile (Play Store):**
1. `flutter build appbundle --release`
2. Upload `.aab` ke Play Console

**Backend/API:** Terpisah (Node.js + Python ML) — lihat README.md untuk arsitektur lengkap.