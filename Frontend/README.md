# ATHENA — Frontend

Case-file styled media literacy platform: claim checking, bias detection,
source scoring, and a training drill, sitting on Supabase auth and a
Three.js landing hero.

## Setup

```bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# and NEXT_PUBLIC_API_URL (your FastAPI backend)
npm run dev
```

Open http://localhost:3000.

## Structure

```
src/
  app/
    globals.css          design tokens + base styles
    layout.tsx            fonts, Navbar, metadata
    page.tsx               landing page with Scene3D hero
    signup/page.tsx
    login/page.tsx
    dashboard/page.tsx     protected — redirects to /login if signed out
    claim-checker/page.tsx
    bias-detector/page.tsx
    source-scorer/page.tsx
    trainer/page.tsx
  components/
    Navbar.tsx
    Scene3D.tsx            react-three-fiber landing hero
  hooks/
    useAuth.ts             Supabase session state + sign in/up/out
  lib/
    supabase.ts            Supabase browser client
    utils.ts                cn(), verdictFromScore(), formatCaseDate()
```

## Backend wiring

The three tool pages (`claim-checker`, `bias-detector`, `source-scorer`)
POST to `${NEXT_PUBLIC_API_URL}/api/<tool-name>`. Until that FastAPI
service is running, each page falls back to a clearly-labeled sample result
so the UI is fully inspectable on its own — swap in your real backend and
those fallbacks stop firing.

## Design system

Case-file aesthetic — ink navy background, aged-paper foreground, a
verified-teal / flagged-rust accent pair for verdicts, `Fraunces` for
display type and `IBM Plex Sans` / `IBM Plex Mono` for body and data. Tokens
live in `tailwind.config.ts` and `globals.css`.

## Notes

- `npm run build` was verified locally in a sandboxed environment with
  Google Fonts blocked — everything compiles; on a normal connection
  `next/font/google` resolves Fraunces / IBM Plex without any changes.
- Auth is wired to Supabase's email/password flow. Enable email confirmations
  in your Supabase project settings if you want the signup confirmation step
  to actually gate access.
