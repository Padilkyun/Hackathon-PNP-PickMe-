# PICKME GARUDA — Technical Documentation

> Platform kolaboratif verifikasi hoaks dan literasi digital Indonesia.
> Juara 1 Hackathon PNP (Politeknik Negeri Padang).

---

## 1. Project Overview

PICKME GARUDA adalah platform dua arah yang menjembatani **pembaca** dengan **verifikator pemerintah** untuk:

1. Melaporkan berita yang mencurigakan.
2. Memvalidasi keaslian berita dengan label resmi (Valid / Hoaks / Misleading / Belum Terkonfirmasi).
3. Mendiskusikan klaim secara terbuka melalui thread tanya‑jawab.
4. Menyaring spam & bot lewat modul ML.

### Latar Belakang
- Kepercayaan publik Indonesia terhadap berita daring hanya **38%** (Reuters Institute 2024).
- Penetrasi media sosial mencapai **75%** populasi.
- Platform cek fakta eksisting masih satu arah (verifikator → publik) tanpa ruang diskusi terbuka.

---

## 2. System Architecture

```
┌──────────────────┐       ┌──────────────────┐
│  Web (Next.js)   │       │  Mobile (Flutter)│
└────────┬─────────┘       └────────┬─────────┘
         │                          │
         ▼                          ▼
      ┌──────────────────────────────┐
      │      API Gateway (REST/WS)    │
      └────────┬─────────────┬────────┘
               │             │
               ▼             ▼
   ┌──────────────────┐  ┌──────────────────┐
   │  Auth Service    │  │  Backend Services│
   │  (NextAuth/      │  │  (Node.js)       │
   │   Firebase Auth) │  │  - Reports       │
   └──────────────────┘  │  - Verifications │
                         │  - Discussions   │
                         └────┬─────────┬───┘
                              │         │
                              ▼         ▼
                ┌──────────────────┐ ┌──────────────────┐
                │  PostgreSQL /    │ │  ML Service      │
                │  Firestore       │ │  (Python)        │
                └──────────────────┘ └──────────────────┘
```

### Komponen

| Komponen | Deskripsi |
|---|---|
| **Frontend Web** | Next.js (React) + Tailwind CSS |
| **Mobile** | Flutter |
| **API Gateway** | REST + WebSocket (real‑time notification) |
| **Auth** | NextAuth + Firebase Auth |
| **Database** | PostgreSQL (relasional) + Firestore (real‑time) |
| **ML Service** | Python (FastAPI) untuk spam detection & claim extraction |
| **Deployment** | Vercel (web), Cloud Run (backend & ML) |

---

## 3. Data Flow

1. **Onboarding** — User login (NextAuth) → pilih peran: pembaca atau verifikator pemerintah.
2. **Pelaporan** — Pembaca submit URL/teks berita + kategori.
3. **Preprocessing NLP** — Tokenisasi, stopword removal, ekstraksi claim utama.
4. **Spam Detection** — Modul ML mengklasifikasikan input spam/bot berdasarkan fitur:
   - Frekuensi submit
   - Kemiripan teks
   - Pola URL
   - Perilaku user
5. **Verifikasi** — Verifikator menerima antrean laporan → review → set label status + komentar edukatif.
6. **Diskusi** — Pembaca bertanya di kolom komentar per berita; verifikator menjawab di thread.
7. **Notifikasi** — Update status dikirim ke pelapor awal via push notification real‑time (WebSocket).

---

## 4. ML / NLP Pipeline

### Bahasa & Library
- **Bahasa**: Python 3.11+
- **Library**: scikit‑learn, transformers (Hugging Face), spaCy, NLTK

### Modul 1 — Spam Detection
**Fitur:**
- `submit_freq`: jumlah submit user per jam
- `text_similarity`: cosine similarity terhadap corpus laporan sebelumnya
- `url_pattern`: regex untuk menandai URL pendek (bit.ly, t.co) atau domain tidak dikenal
- `user_behavior`: rasio submit dibanding interval akun

**Model:** Random Forest / XGBoost (binary classification: spam vs legitimate)

### Modul 2 — Claim Extraction
**Pipeline:**
1. NER (Named Entity Recognition) → identifikasi entitas (orang, tempat, tanggal)
2. Keyphrase extraction (YAKE atau KeyBERT)
3. Output: daftar claim utama dari teks/URL

### Modul 3 — Fact‑Check Scoring (Rencana Lanjutan)
- Embedding kalimat dengan model multilingual (IndoBERT atau XLM‑R)
- Cosine similarity terhadap database klaim terverifikasi
- Skor 0.0–1.0 → mapped ke label status

### Deployment Model
- Offline training → ekspor ke **ONNX** atau pickle
- Served via **FastAPI** di Cloud Run
- Endpoint: `POST /ml/spam`, `POST /ml/extract-claims`

---

## 5. API Specification (REST + WebSocket)

### REST Endpoints

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | NextAuth handler (login, session) | — |
| `POST` | `/api/reports` | Submit laporan berita | User |
| `GET` | `/api/reports` | List laporan (filter status) | Optional |
| `GET` | `/api/reports/:id` | Detail laporan | User |
| `POST` | `/api/reports/:id/verify` | Set label status + komentar | Verifier |
| `GET` | `/api/reports/:id/discussions` | List diskusi per laporan | Public |
| `POST` | `/api/reports/:id/discussions` | Tambah pertanyaan/komentar | User |
| `POST` | `/api/ml/spam` | Prediksi spam (proxy ke ML service) | Server‑side |

### WebSocket Endpoint

| Endpoint | Event | Payload |
|---|---|---|
| `WS /api/notifications` | `report.updated` | `{ reportId, status, updatedAt }` |
| `WS /api/notifications` | `discussion.new` | `{ reportId, commentId, author }` |

### Response Format
```json
{
  "ok": true,
  "data": { /* ... */ },
  "error": null
}
```

### Auth
- **NextAuth** dengan provider credentials (email/password) + OAuth (Google).
- JWT disimpan di httpOnly cookie.
- Role-based access: `reader`, `verifier`, `admin`.

---

## 6. Database Schema (PostgreSQL)

### Tabel `users`
```sql
id UUID PK
email VARCHAR UNIQUE NOT NULL
name VARCHAR
role ENUM('reader', 'verifier', 'admin')
created_at TIMESTAMP
```

### Tabel `reports`
```sql
id UUID PK
user_id UUID FK → users
url TEXT
text TEXT
category VARCHAR
status ENUM('pending', 'valid', 'hoaks', 'misleading', 'unconfirmed')
spam_score FLOAT
verifier_id UUID FK → users (nullable)
verified_at TIMESTAMP
created_at TIMESTAMP
```

### Tabel `discussions`
```sql
id UUID PK
report_id UUID FK → reports
user_id UUID FK → users
parent_id UUID FK → discussions (nullable, untuk threading)
content TEXT
is_verifier_response BOOLEAN
created_at TIMESTAMP
```

### Tabel `verifications`
```sql
id UUID PK
report_id UUID FK → reports
verifier_id UUID FK → users
status ENUM
comment TEXT
created_at TIMESTAMP
```

---

## 7. Deployment

### Frontend Web
- **Platform**: Vercel
- **Build**: `next build` → static + SSR
- **Env**: Production, Preview, Development branches

### Backend API
- **Platform**: Google Cloud Run
- **Runtime**: Node.js 20 (containerized)
- **Build**: `Dockerfile` di root backend
- **Trigger**: GitHub Actions push ke `main` → build → deploy

### ML Service
- **Platform**: Google Cloud Run
- **Runtime**: Python 3.11 + FastAPI
- **Model**: ONNX bundle di Cloud Storage, di‑mount saat container start

### Database
- **Production**: Cloud SQL (PostgreSQL 15)
- **Dev / Prototype**: Firestore

### CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml (contoh ringkas)
name: Deploy
on: { push: { branches: [main] } }
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: pickme-backend
          source: ./backend
```

---

## 8. Environment Variables

### Frontend (`apps/web/.env.local`)
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-openssl-rand-base64-32
NEXT_PUBLIC_API_URL=https://api.pickme-garuda.dev
NEXT_PUBLIC_WS_URL=wss://api.pickme-garuda.dev/notifications
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"...","projectId":"..."}
```

### Backend (`apps/api/.env`)
```bash
DATABASE_URL=postgres://user:pass@host:5432/pickme
JWT_SECRET=replace-with-strong-secret
ML_SERVICE_URL=https://ml.pickme-garuda.dev
PORT=8080
```

### ML Service (`apps/ml/.env`)
```bash
MODEL_BUCKET=gs://pickme-models
ONNX_MODEL_NAME=spam-classifier-v1.onnx
LOG_LEVEL=INFO
```

---

## 9. Testing & Verification

### Unit Testing
- **Framework**: Jest + React Testing Library
- **Scope**: Component logic, utility functions, hooks
- **Command**: `npm run test`

### End‑to‑End Testing
- **Framework**: Playwright
- **Critical paths**:
  1. Login → Submit laporan → Spam check → Receive verification
  2. Verifier login → Review laporan → Set status → Notifikasi ke reporter
- **Command**: `npm run test:e2e`

### Lint & Type Check
```bash
npm run lint
npm run type-check
```

### Production Build
```bash
npm run build
npm run start  # serve built output
```

### Accessibility Audit
```bash
npm run audit:a11y  # using @axe-core/cli
```

---

## 10. Future Improvements

| Area | Rencana |
|---|---|
| **Multi‑language** | Mendukung bahasa daerah (Jawa, Sunda, Minang) |
| **Advanced ML** | LLM‑based fact‑checking (GPT/Gemini) untuk cross‑check klaim |
| **Mobile** | Flutter deep‑linking, offline mode, biometric login |
| **Realtime** | Notifikasi suara & prioritas berdasarkan urgensi |
| **Analytics** | Dashboard MTTR (Mean Time To Review), trending hoaks |
| **Gamification** | Poin literasi untuk pembaca aktif |
| **Federated Auth** | Login via KYC pemerintah untuk verifikator |

---

## 11. Repository Structure (Frontend)

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home
│   ├── about/            # About page
│   ├── solution/         # Solution page
│   ├── flow/             # Flow page
│   ├── tech/             # Tech page
│   ├── impact/           # Impact page
│   └── contact/          # Contact page
├── components/
│   ├── ui/               # Button, Card, Section, NeonText
│   ├── layout/           # Header, Footer, Navigation
│   ├── home/             # Hero, StatsBar, CTA
│   ├── about/            # ProblemStatement
│   ├── solution/         # FeatureGrid, LoginMockup
│   ├── flow/             # FlowSteps
│   ├── tech/             # TechStackGrid
│   ├── impact/           # ImpactMetrics
│   └── contact/          # ContactForm
├── lib/
│   ├── theme.ts          # Color palette constants
│   └── utils.ts          # cn(), formatters
└── styles/
    └── globals.css       # Tailwind + dark mode
```

---

## 12. License

© 2026 PICKME GARUDA Team. Project ini dikembangkan sebagai bagian dari Hackathon PNP 2024.

---

## 13. Kontak

- **GitHub**: `https://github.com/your-org/pickme-garuda`
- **Email**: `team@pickme-garuda.dev`
- **Hackathon**: Politeknik Negeri Padang (PNP)

---
