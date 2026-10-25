# Development → production pipeline

## Environments

| Stage | Where | Database | Deploy trigger |
|-------|--------|----------|----------------|
| **Local** | `npm run dev` | Supabase project `taagmphbkztlwqtmxbce` via `.env.local` | Manual |
| **Preview** | Vercel preview URL per PR/branch | Same Supabase (shared dev/prod DB for now) | Push to any branch (when Git linked on Vercel) |
| **Production** | https://moms-curry-co.vercel.app | Same Supabase project | Push to `main` (Vercel Git integration) |

> For a separate staging database later, add a Supabase branch or second project and wire preview env vars in Vercel.

## Day-to-day development

1. Branch from `main` or use `iteration/*` (see [BRANCHING.md](./BRANCHING.md)).
2. `npm run dev` — http://localhost:3000
3. Before PR: `npm run lint && npm run typecheck && npm run test && npm run build`
4. Optional: `npm run supabase:verify` with `.env.local`
5. Open PR → **GitHub Actions CI** runs (lint, types, tests, build).
6. Merge to `main` → Vercel production deploy (when repo is connected).

## GitHub Actions

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

- Runs on `main` and `iteration/**` pushes and on PRs to `main`.
- **quality**: lint, typecheck, Vitest, Next.js build with public env placeholders.
- **supabase-smoke** (main only): runs `npm run supabase:verify` when repository secrets are set.

### Optional CI secrets

In GitHub → **Settings → Secrets and variables → Actions**, add:

| Secret | Purpose |
|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Same as production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable or anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (checkout smoke) |

Without secrets, the smoke job is skipped harmlessly (`continue-on-error`).

## Database changes

1. Add SQL under `supabase/migrations/` (snake_case timestamp prefix).
2. Apply to remote: Supabase Dashboard SQL, `supabase db push`, or Supabase MCP `apply_migration`.
3. Commit migration files with application code in the same PR.

Production fix applied: `grant execute on function public.is_admin() to anon` so public menu reads work under RLS.

## Vercel

- Project: **moms-curry-co** (`prj_bAP8HTE2fAjaOroAXpa6mqRgwIni`), region **bom1**.
- Required env vars: see [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md).
- CLI: `bash scripts/deploy-vercel.sh` with `VERCEL_TOKEN` for manual prod deploys.

## Supabase Auth (production admin)

[URL configuration](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/auth/url-configuration):

- **Site URL:** `https://moms-curry-co.vercel.app`
- **Redirect URLs:** `https://moms-curry-co.vercel.app/**`

## Go-live checklist

See [PRODUCTION.md](./PRODUCTION.md).
