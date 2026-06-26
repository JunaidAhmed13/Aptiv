# Aptiv — Frontend Context

> **Living document.** Update at the end of every major build step.
> Last updated: 2026-06-27 — **Sample Output relocated.** The "Sample Output" card (`LiveExamplePanel`) moved off the results page (`app/dashboard/results/[id]/page.tsx`, now single-column `max-w-5xl`) onto the landing page. New `landing/live-example.tsx` section places the ranked shortlist on the LEFT and the Sample Output write-up on the RIGHT, side by side, between Hero and Features. The hero's floating preview card was folded into that section so the ranking list isn't duplicated.
> Prior (2026-06-26): **pass 3 (pre-deploy polish).** Navbar shows the full Aptiv logo (mark + wordmark) again; favicon restored to the brand mark; tab title shortened to "Aptiv". Pricing: the $20 Agency tier now also says "Talk to us" and opens a per-plan mailto (billing not wired, so paid plans go via email); only the free Starter tier self-serves to sign-up. Auth sign-in testimonial reworked into a professional named attribution (no build-status note). Results LiveExamplePanel + hero preview now use UFC-fighter demo names (clearly fictional hook). Dashboard: both "New screening" buttons removed (sidebar already has it); topbar now has a theme toggle next to the account button. Features: added "Reaches out for you" card (Aptiv auto-emails ranked candidates).
> Prior pass (pass 2): hero rotating line clip/overlap fix; strictly-neutral dark mode (`--cta` token keeps only the solid CTA tinted); dashboard "View results" cursor fix; **liquid background is a real WebGL2 fluid simulation** (advection + vorticity + Jacobi pressure solve; vibrant in light, disabled in dark); results page two-column with the auto-cycling LiveExamplePanel.

---

## 1. What Is This Project?

Aptiv is an AI-powered **bulk resume screening SaaS**. Recruiters upload multiple CVs plus one Job Description; the backend (an n8n workflow exposed via webhook) returns AI-scored, ranked candidate evaluations. This repo is the **frontend only** — a Next.js (App Router) application providing the marketing landing page, authentication, screening job submission, and results visualization.

### Branding

| Item | Value |
|------|-------|
| Product name | **Aptiv** |
| Old/legacy names (do NOT use) | TalentFlow AI, TalentStore |
| Logo mark | Geometric "A" drawn as an ascending peak (apex doubles as a rank/ascent cue) in a rounded violet tile with a top sheen + soft shadow. Inline SVG in `components/logo.tsx`. Subtle Framer hover float + 3D tilt. |
| Logo text | "Aptiv" in Geist (display), weight 600, tight tracking. Navbar shows mark + wordmark (`<Logo />`); `showMark={false}` available for text-only. |
| Favicon | Brand mark (violet tile + white ascending-A peak), generated at build via `app/icon.tsx` (Next.js `ImageResponse`/Satori — no `<g>`, attrs inlined per element). Tab title is just "Aptiv". |
| Palette | **Purple + white + near-black ink only**, light and dark. No coral/orange/pink/mint. See §2 Palette. |

---

## 2. Project Rules & Conventions

### In Scope (v1) — all built
- Landing page (cursor-reactive **liquid metaball background**, rotating hero headline, pill badges, dual CTA; left-aligned navbar with theme toggle)
- **Dark/light mode** across the whole app (class strategy, FOUC-safe, OS-aware)
- Clerk authentication (Google + email/password, standard Clerk hosted components)
- Dashboard with screening history + stats
- New Screening flow (JD + CV upload → webhook POST → results)
- Results view (ranked table, candidate detail slide-over, search/filter/sort)
- Responsive (desktop-first; verified down to small screens)

### Out of Scope (v1)
- About / Contact pages (footer links are placeholders → `#`)
- Multi-tenancy / per-recruiter data isolation (backend limitation — see §8)
- Security audit (deliberate separate step, later)
- Automated testing
- Billing (pricing is placeholder UI only)
- Production deployment / CI-CD

### Code Conventions
- **Framework**: Next.js 15 (App Router), React 19, TypeScript strict
- **Styling**: Tailwind CSS v3 with semantic CSS-variable tokens (`tailwind.config.ts` + `app/globals.css`)
- **Animations**: Framer Motion; all motion respects `prefers-reduced-motion` (global CSS override + JS guard in the aurora)
- **Auth**: Clerk (`@clerk/nextjs` v6)
- **Server state**: React Query (`@tanstack/react-query`) — `useMutation` for the screening call
- **Icons**: `lucide-react` only (no emoji as icons)
- **No-slop rule**: no mock data in production paths; no swallowed errors; stubs are explicitly commented. See §9.
- **Env vars**: all secrets via `process.env`; `.env.local` gitignored (matched by `.env*.local`); `.env.example` committed.
- **File naming**: kebab-case files, PascalCase components. Path alias `@/*` → project root.

### Palette & Theming
- **Strict palette**: purple (indigo `#6366F1` → violet `#8B5CF6` → lavender `#A78BFA`) + white + near-black ink. No coral/orange/pink/mint/rainbow anywhere user-facing.
- **Tokens**: semantic CSS variables in `app/globals.css` (`:root` light, `.dark` overrides). `--accent` is violet; `--primary` is indigo. Tailwind colors are var-driven.
- **Legacy `coral` key**: the old `coral` Tailwind scale (`tailwind.config.ts`) is **remapped to a violet ramp** so existing `coral-*` classes across out-of-scope files (dashboard/results/auth) render purple without rewriting them. Treat `coral-*` as "violet/accent". Safe to rename in a future pass.
- **Dark/light mode**: `darkMode: "class"`. `ThemeProvider` (`components/theme-provider.tsx`) mirrors the `.dark` class into React + persists choice to `localStorage["aptiv-theme"]`; follows OS preference until an explicit choice is made. A tiny inline script in `app/layout.tsx` `<head>` sets the class before first paint (no FOUC; `<html suppressHydrationWarning>`). Toggle: `components/ui/theme-toggle.tsx` (in navbar).
- **Dark mode is strictly neutral (no color accents).** In `.dark`, `--primary`/`--accent` are set to light-neutral greys, so every `text-primary`/`text-accent`/`coral-*` usage renders neutral automatically. `globals.css` also overrides the brand gradient and the few literal `text-indigo-*`/`text-violet-*` + decorative `from-indigo… to-violet…` classes to neutral in dark mode. The **only** surviving tint in dark mode is the solid primary CTA button, via the `--cta` token (`--cta` follows `--primary` in light mode; a muted violet in dark). `Button` primary variant uses `dark:from-cta dark:to-cta dark:text-cta-foreground`.
- **Liquid background** (`components/liquid-blob.tsx`): now a real-time **WebGL2 fluid simulation** (velocity/dye advection, curl + vorticity confinement, Jacobi pressure projection, ping-pong FBOs). Cursor injects dye + velocity scaled by speed (fast = bigger/brighter trails; slow = gentle). **Light mode = vibrant multi-color** (the one place richer color is allowed); **dark mode disables the sim** (transparent + faint dotted texture only) so dark stays neutral. Needs `EXT_color_buffer_float`; falls back to the static `.liquid-fallback` field when unavailable or for reduced-motion.

---

## 3. Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Server only | Clerk backend verification |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` | Client | Clerk route config |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` / `AFTER_SIGN_UP_URL` | Client | Post-auth redirect → `/dashboard` |
| `WEBHOOK_URL` | **Server only** | n8n webhook endpoint. **No `NEXT_PUBLIC_` prefix** — never shipped to the browser. Called only from `app/api/screen/route.ts`. |

**Webhook URL decision (implemented):** kept server-only and proxied through `/api/screen`. The client never sees the n8n URL — it cannot be scraped from the network tab or bundle. The proxy also enforces Clerk auth, validates the payload, and normalizes errors/timeouts.

---

## 4. Route Structure (as built)

```
app/
├── layout.tsx                       # Root: ClerkProvider, fonts (Inter/Geist/Fraunces), React Query + Toast providers, metadata
├── globals.css                      # Tailwind + design tokens + aurora/pill/glass utilities
├── icon.tsx                         # Aptiv mark favicon (ImageResponse)
├── page.tsx                         # Landing page (assembles landing sections)
│
├── (auth)/                          # Route group — shared split-screen branded auth layout
│   ├── layout.tsx
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
│
├── dashboard/
│   ├── layout.tsx                   # Sidebar + Topbar shell
│   ├── page.tsx                     # Overview: stats + screening history (localStorage)
│   ├── new/page.tsx                 # New Screening (renders UploadForm)
│   └── results/[id]/page.tsx        # Results for one screening job
│
└── api/
    └── screen/route.ts              # Server-side proxy → n8n webhook (auth-gated, validated, timeout-guarded)

middleware.ts                        # Clerk middleware: protects /dashboard(.*) and /api/screen(.*)
```

---

## 5. Architecture & Data Flow

### Upload → Webhook → Results

```
/dashboard/new (client)
  │  build FormData: job_description=<JD pdf>, CV_1..CV_n=<cv pdfs>
  ▼
useScreening() useMutation  ──POST multipart──▶  /api/screen (server)
                                                   │ auth.protect() (Clerk)
                                                   │ validate (>=1 CV, 1 JD)
                                                   │ fetch(WEBHOOK_URL, {body: formData}) w/ 4-min AbortController
                                                   ▼
                                                 n8n webhook → { candidates: [...] }
  ◀────── normalized { candidates } ────────────────┘
  │  persist ScreeningJob to localStorage (per Clerk user id)
  ▼
router.push(/dashboard/results/[id])  → ResultsTable renders ranked candidates
```

- **Field naming contract**: JD sent as `job_description`; CVs sent as `CV_1`, `CV_2`, … (backend filters binary keys with `.startsWith("CV")`). See `lib/use-screening.ts`.
- **Normalization**: `/api/screen` coerces upstream into `{ candidates: [] }` even if n8n returns a bare array or `{ json: [...] }` shape.

### State Management (as built)
| Concern | Solution | Where |
|---------|----------|-------|
| Screening webhook call | React Query `useMutation` | `lib/use-screening.ts` |
| Screening history | **localStorage**, namespaced `aptiv:jobs:<clerkUserId>` | `lib/screening-store.ts` |
| Toasts | React Context provider | `components/ui/toast.tsx` |
| Upload form / filters | component-local `useState` | `components/screening/*`, `components/results/*` |

### Auth Flow
- Clerk middleware protects `/dashboard/*` and `/api/screen/*`. Landing + auth routes are public.
- After sign-in/up → `/dashboard` (via env redirect URLs). Sign-out → `/`.

---

## 6. Component Tree (as built)

```
components/
├── logo.tsx                    # AptivMark (violet tile + ascending-A peak SVG) + Logo lockup (Framer hover float + 3D tilt)
├── liquid-blob.tsx             # Cursor-reactive WebGL2 metaball background (purple-only). Velocity → stretch/trailing. CSS fallback for reduced-motion / no-WebGL. Theme-aware via useTheme.
├── theme-provider.tsx          # Dark/light context; mirrors .dark class, persists choice, follows OS pref. No external dep.
├── providers.tsx               # React Query client provider
├── ui/
│   ├── button.tsx              # variants: primary(violet→indigo gradient)/outline/ghost/subtle/danger; loading state
│   ├── theme-toggle.tsx        # Sun/Moon toggle (AnimatePresence), mounts client-side to avoid SSR flicker
│   ├── badge.tsx               # neutral/success/warning/danger/brand
│   ├── card.tsx
│   └── toast.tsx               # ToastProvider + useToast (aria-live, auto-dismiss)
├── landing/
│   ├── navbar.tsx              # logo + links clustered LEFT; theme toggle + auth RIGHT; scroll-aware; mobile menu
│   ├── hero.tsx                # fixed line + rotating value line (Framer, ~2.2s), pills, dual CTA (floating preview card moved into live-example.tsx)
│   ├── live-example.tsx        # side-by-side section: ranked shortlist (left) + Sample Output write-up (right); reuses results/live-example-panel.tsx
│   ├── features.tsx            # 6-card grid (purple token tints, no em dashes)
│   ├── how-it-works.tsx        # 3-step
│   ├── features.tsx            # 6 cards incl. "Reaches out for you" (auto-emails ranked candidates)
│   ├── pricing.tsx             # 3 tiers; Starter self-serves to sign-up, Agency+Scale CTAs open a per-plan mailto (no billing yet)
│   └── footer.tsx              # NOTE: cta-banner.tsx REMOVED (no closing gradient banner)
├── dashboard/
│   ├── sidebar.tsx             # desktop nav + "history is local" note
│   ├── topbar.tsx              # ThemeToggle + UserButton (New Screening buttons removed; sidebar has it)
│   └── screening-card.tsx      # history card (delete, qualified count; full-card link above content)
├── screening/
│   ├── upload-zone.tsx         # drag-and-drop + click, keyboard accessible
│   ├── file-list.tsx           # selected-files preview w/ remove
│   ├── processing-state.tsx    # reassuring multi-stage loader (estimated, honestly labeled)
│   └── upload-form.tsx         # orchestrator: validation → mutation → persist → navigate
└── results/
    ├── results-table.tsx       # filter/sort/search orchestrator + detail wiring
    ├── candidate-row.tsx       # ranked row w/ score bar + qualified highlight
    ├── candidate-detail.tsx    # slide-over: strengths/concerns/notes/contact (copy buttons)
    ├── score-badge.tsx         # color-toned fit-score chip (handles missing score → "—")
    ├── filter-bar.tsx          # search + qualified-only toggle + sort direction
    ├── live-example-panel.tsx  # auto-cycling "Sample output" showcase (fictional UFC-fighter demo candidates, full evaluation); rendered by landing/live-example.tsx (no longer on the results page)
    └── empty-state.tsx         # NoCandidates (empty result) + NoMatches (filtered out)

lib/
├── utils.ts                    # cn()
├── types.ts                    # Candidate, ScreenResponse, ScreeningJob, QUALIFIED_THRESHOLD=8
├── score.ts                    # normalizeScore, scoreTone, isQualified, splitPhrases, parseSubmittedDate
├── file-validation.ts          # PDF/size/count validation (10MB/file, 30 CVs max)
├── screening-store.ts          # localStorage history CRUD
└── use-screening.ts            # React Query mutation + ScreenError
```

---

## 7. API Contract (Backend — Do Not Modify)

**Endpoint**: POST `{WEBHOOK_URL}` · **Content-Type**: `multipart/form-data`

| Field | Type | Notes |
|-------|------|-------|
| `job_description` | Binary (PDF) | Exactly one |
| `CV_1`..`CV_n` | Binary (PDF) | One or more; field names start with `CV` |

**Response** (`200`): `{ "candidates": [ { full_name, email, phone, position, overall_fit_score (number), recommendation, strengths (comma-sep), concerns_or_gaps (comma-sep), final_notes, submitted_date (yyyyMMdd-HHmmss) } ] }`

**Handled edge cases**: empty `candidates`, partial/missing fields per candidate (UI shows "Not provided"/"—"), timeouts (4-min abort → 504 w/ retry messaging), upstream non-200 (→ 502), non-JSON upstream body (→ 502), network failure (→ surfaced toast).

---

## 8. Known Limitations & Flags

| Area | Limitation | Impact |
|------|-----------|--------|
| **Multi-tenancy** | Backend writes all results to one shared Google Sheet; no per-user isolation. | A recruiter's results could be visible to anyone with Sheet access. **UI deliberately makes no data-privacy claims.** Frontend can't fix this — backend concern. |
| **Screening history** | Backend has **no read API** for past screenings (Sheet is write-only). | History is **localStorage, per browser/device**, namespaced by Clerk user id. Lost on storage clear / different device. Results page shows an explicit "not found on this device" state. This is a flagged v1 tradeoff, not a hidden stub. |
| **Cross-account visibility** | localStorage is keyed by Clerk user id, so two recruiters on the *same browser* won't see each other's history. But this is **not** real isolation — it's client-side only. | Acceptable for single-user MVP testing; needs a real per-user DB for production. |
| **Rate limits** | Groq free tier (30 RPM / 1000 RPD). | Large/frequent batches may fail upstream → surfaced as a clear error toast. CV batch capped at 30 client-side to stay sane. |
| **File validation** | Backend expects PDF only. | Frontend enforces PDF-only, ≤10 MB/file, ≤30 CVs, non-empty; rejects with per-file toasts. Server route re-validates (defense in depth). |
| **Processing progress** | Webhook is a single blocking request with no progress stream. | `ProcessingState` shows an **estimated** stage + "candidate ~N of M" based on elapsed time, clearly framed as an estimate — never a faked server count. |
| **Pricing/billing** | No billing integration. | Starter (free) CTA routes to sign-up; Agency + Scale CTAs say "Talk to us" and open a per-plan `mailto:` to vynix.automate@gmail.com (CC same) so paid plans are handled over email. No build-status text shown to users. |
| **Slack** | Backend Slack node broken/unconfigured. | No frontend impact. |

### Input-failure guards (upload flow)
- **Wrong file type** → rejected client-side + toast; server re-checks.
- **Oversized file** (>10 MB) → rejected + toast.
- **Zero CVs / missing JD** → submit disabled + inline hint; server returns 400 if bypassed.
- **Duplicate CVs** → de-duped by name+size.
- **>30 CVs** → extras dropped + info toast.

---

## 9. No-Slop Audit (explicit)

- **No mock data in production paths.** The only illustrative content is clearly decorative: the landing hero preview card (`hero.tsx`, static sample rows, labeled as a preview), placeholder pricing (labeled), and the auth testimonial (labeled "Illustrative"). None of it sits in a code path that looks like a live API call.
- **No swallowed errors.** Every catch surfaces a real error (toast with cause) or logs with context (`console.error` in `screening-store`, `api/screen`, `candidate-detail` clipboard). The webhook proxy returns typed, specific status codes + messages.
- **Honest progress UI.** `processing-state.tsx` documents in a comment that per-candidate progress is estimated (no stream available) and never claims real counts.
- **Stubs called out.** localStorage history is documented as a deliberate stand-in for a missing backend read API, in code and here.

---

## 10. Verification Status

- `npx tsc --noEmit` — **clean**.
- `npm run build` — **succeeds**; 8 routes, middleware compiled.
- `npm run dev` smoke test — landing `200`, sign-in `200`, `/icon` `200`, `/dashboard` correctly gated by Clerk (`protect-rewrite`, signed-out).

## 11. Build Progress

| Phase | Status |
|-------|--------|
| Planning & context.md | ✅ |
| Project scaffold (Next.js 15 + deps) | ✅ |
| Design system & globals | ✅ |
| Logo component + favicon | ✅ |
| Landing page | ✅ |
| Frontend correction pass (palette, dark mode, liquid blob, rotating headline, navbar, logo, copy, CTA removal) | ✅ |
| Auth (Clerk + middleware) | ✅ |
| Dashboard | ✅ |
| Upload flow | ✅ |
| API route (proxy) | ✅ |
| Results view | ✅ |
| Build/typecheck verification | ✅ |
| Security audit | ⬜ deliberately deferred (manual, later) |
| Deployment | ⬜ out of scope v1 |

---

## 12. How to Run

```bash
npm install
# .env.local must contain the Clerk keys + WEBHOOK_URL (see .env.example)
npm run dev      # http://localhost:3000
npm run build    # production build
```
