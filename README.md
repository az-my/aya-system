# AYA - Sistem Manajemen Alih Daya

Workforce management system for outsourced workers (Tenaga Alih Daya).

**Stack:** Next.js (App Router, TypeScript, `src/`), shadcn/ui, Supabase.

**First feature:** SPPD (trip management). More features (Lembur, etc.) coming later.

## Getting Started

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy env and add your Supabase keys:
   ```bash
   cp .env.example .env.local
   # Edit .env.local: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/` — App Router pages (Dashboard, Pengemudi, Perjalanan, Laporan, Pengaturan)
- `src/components/` — UI and app sidebar
- `src/lib/` — Supabase client, PDF utils
