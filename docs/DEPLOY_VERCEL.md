# Deploy to the web (Vercel — recommended)

Best practice for this Next.js app: **Vercel** + **Supabase** (already set up), env vars only in the Vercel dashboard, **`main` deploys on git push** after GitHub is connected.

## Production status

| Item | Status |
|------|--------|
| URL | https://moms-curry-co.vercel.app |
| Project | `moms-curry-co` (`prj_bAP8HTE2fAjaOroAXpa6mqRgwIni`), Node 24.x, `bom1` |
| GitHub | `sidhantkaushal/moms-curry-co` — push `main` to deploy (when Git linked) |
| Pipeline | [PIPELINE.md](./PIPELINE.md) · [PRODUCTION.md](./PRODUCTION.md) |

## Prerequisites

- Code on GitHub (`bash scripts/push-to-github.sh` after `gh auth login`)
- Supabase schema applied (done for `taagmphbkztlwqtmxbce`)
- `.env.local` working locally

## Option A — Vercel + GitHub (recommended)

1. **Log in:** [vercel.com](https://vercel.com) with your **personal** GitHub account.
2. **Add New Project** → Import `moms-curry-co` repository.
3. **Framework:** Next.js (auto-detected). Root directory: `.`
4. **Environment variables** (Production + Preview):

| Name | Value | Sensitive |
|------|--------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://taagmphbkztlwqtmxbce.supabase.co` | No |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | from `.env.local` | No |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` from `.env.local` | **Yes** |
| `ORDER_TOKEN_PEPPER` | same as `.env.local` | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | leave empty on first deploy; set after step 6 | No |

5. **Deploy** → wait for build to finish.
6. Copy the production URL (e.g. `https://moms-curry-co.vercel.app`).
7. Set **`NEXT_PUBLIC_SITE_URL`** to that URL → **Redeploy** (Deployments → … → Redeploy).

### Supabase Auth (admin login on production)

[Authentication → URL configuration](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/auth/url-configuration)

- **Site URL:** `https://YOUR-VERCEL-URL.vercel.app`
- **Redirect URLs:** add  
  `https://YOUR-VERCEL-URL.vercel.app/**`

Save, then test `/admin/login` on production.

## Option B — Vercel CLI (from your Mac)

```bash
cd "/Users/sidhantkaushal/Desktop/Sid's Section/moms-curry-co"
npx vercel login
npx vercel link          # create/link project
bash scripts/vercel-env-sync.sh
npx vercel --prod
```

Then set `NEXT_PUBLIC_SITE_URL` to the printed URL and redeploy:

```bash
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel --prod
```

### Non-interactive (CI / token)

Create a token at [vercel.com/account/tokens](https://vercel.com/account/tokens):

```bash
export VERCEL_TOKEN=your_token
bash scripts/deploy-vercel.sh
```

## Region

`vercel.json` sets **`bom1`** (Mumbai) for lower latency in India.

## After go-live

- [ ] Place a test order on production
- [ ] Confirm admin login
- [ ] Update legal pages (`/privacy`, `/terms`)
- [ ] Rotate any API keys that were ever pasted in chat
- [ ] Optional: custom domain in Vercel → update `NEXT_PUBLIC_SITE_URL` + Supabase Auth URLs

## What not to do

- Do not commit `.env.local` or secrets to GitHub.
- Do not put `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` variables.
