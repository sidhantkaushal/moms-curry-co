# Deployment

## Personal accounts (required)

1. **GitHub** — repository under your user (not an organization repo unless you choose).
2. **Supabase** — free tier project for Postgres + Auth.
3. **Vercel** — import the GitHub repo (optional until you go live).

## Environment variables

Copy `.env.example` → `.env.local` (local) and set the same keys in Vercel (production).

| Variable | Where |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |
| `NEXT_PUBLIC_SITE_URL` | Public (canonical URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only |
| `ORDER_TOKEN_PEPPER` | Server only (long random string) |

## Migrations

Run SQL migration on the Supabase project before first deploy.

## Launch checklist

- [ ] Business contact fields set in `business_settings`
- [ ] Published menu for go-live date
- [ ] Legal pages updated
- [ ] Test order end-to-end on production URL
- [ ] Admin user in `admin_profiles`
- [ ] `ordering_paused` false when ready

## CI

GitHub Actions workflow runs lint, typecheck, test, and build on push/PR.
