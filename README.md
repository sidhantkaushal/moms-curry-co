# Mom's Curry Co.

Personal direct-ordering web app for a home-style Indian cloud kitchen. **Not affiliated with any employer or organization.**

Tagline: *A little taste of home.*

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage when enabled)
- Vitest for domain/order logic tests

## Project location

Standalone repo folder (not inside LLA or any work monorepo):

`/Users/sidhantkaushal/Desktop/moms-curry-co`

Open this folder in Cursor for development.

## Local setup

1. Push to your **personal** GitHub account (optional).
2. Supabase: follow **`docs/supabase-setup.md`** (env vars, migration, admin user).
3. Copy `.env.example` → `.env.local` and fill in values from Supabase.
4. Apply migrations: see also `docs/deployment.md`.
4. Create a Supabase Auth user for yourself and insert into `admin_profiles`.
5. Run:

```bash
npm install
npm run dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run typecheck` | TypeScript |

## Documentation

See the `docs/` folder for requirements, architecture, security, testing and deployment.

**Go live:** [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md) (Vercel + Supabase Auth URLs).

## Before accepting real orders

- Configure business contact details, hours and service rules in `business_settings`.
- Publish a daily menu with real prices (INR, paise in DB).
- Replace legal placeholder pages (`privacy`, `terms`, `cancellation-refunds`).
- Confirm payment methods match what you actually support.
