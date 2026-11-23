# AGENTS.md — PICKME GARUDA

## Project Overview
- **Web**: Next.js 14 (App Router) + React 18 + Tailwind CSS — `src/`
- **Mobile**: Flutter — `android_app/`
- **Package**: `pickme-garuda` (private, monorepo-like structure)

## Commands
```bash
# Web (root)
npm run dev        # Next.js dev server
npm run build      # Production build
npm run start      # Serve built output
npm run lint       # ESLint (next lint)
npm run type-check # tsc --noEmit

# Mobile (android_app/)
flutter pub get
flutter run
flutter build apk
```

## Architecture Notes
- **App Router** in `src/app/` — pages under route segments
- **Path alias**: `@/*` → `src/*` (tsconfig.json)
- **Dark mode**: Tailwind `class` strategy (see `tailwind.config.js:3`)
- **Theme system**: `src/lib/theme.ts` — neon color palette + semantic colors
- **Utilities**: `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge), formatters
- **Admin routes**: `src/app/admin/**` — protected admin pages
- **Data layer**: `src/lib/data/reports.ts` — mock/typed report data

## Code Conventions
- TypeScript `strict: true`, no emit
- Component files: PascalCase `.tsx`
- Utility functions: camelCase, exported named
- Tailwind via `cn()` for class merging
- Fonts: Inter (sans), JetBrains Mono (mono) — configured in tailwind

## Environment
- No `.env` files committed (check `.gitignore`)
- Required vars (from README): `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`, `NEXT_PUBLIC_FIREBASE_CONFIG`

## Testing & Quality
- No test scripts configured yet (README mentions Jest + Playwright but not in package.json)
- Run `npm run lint` and `npm run type-check` before commits

## Mobile (Flutter)
- Entry: `android_app/lib/main.dart`
- State: Provider pattern (`news_provider.dart`)
- Services: `news_service.dart` (HTTP)
- Models: `news.dart`
- Assets: `android_app/assets/images/` + Inter fonts
- Min SDK: 3.2.0

## Key Files to Know
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, providers, fonts |
| `src/app/page.tsx` | Home page |
| `src/lib/theme.ts` | Design tokens (colors, semantics) |
| `src/lib/utils.ts` | `cn()`, formatters |
| `tailwind.config.js` | Tailwind config (darkMode, colors, fonts) |
| `next.config.js` | Next.js config (image formats) |
| `android_app/pubspec.yaml` | Flutter deps & assets |
| `android_app/lib/main.dart` | Flutter app entry |

## Gotchas
- **No backend/API code in this repo** — README describes external services (Node.js API, Python ML, PostgreSQL, Firestore)
- **Admin auth not implemented** — admin routes exist but no auth guard visible
- **Images**: Avif/WebP formats enabled in `next.config.js`
- **Strict TS**: `noEmit: true` — type-check only, no `.js` output