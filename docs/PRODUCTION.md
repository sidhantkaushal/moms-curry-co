# Production readiness

**Production URL:** https://moms-curry-co.vercel.app  
**Supabase project:** `taagmphbkztlwqtmxbce`

## Platform

| Item | Status |
|------|--------|
| Vercel production deploy | Live on `main` |
| Env vars on Vercel (Supabase, pepper, site URL) | Configured |
| Vercel SSO / password protection | Off (public storefront) |
| GitHub repo | `sidhantkaushal/moms-curry-co` |
| CI on push/PR | `.github/workflows/ci.yml` |
| RLS + `is_admin()` for public reads | Fixed (anon can execute `is_admin()` for policy evaluation) |
| Admin user + `admin_profiles` | 1 admin |
| Sample menu (IST today) | Published with items |

## Manual dashboard steps (one-time)

- [ ] **Supabase Auth** — Site URL + redirect URLs for production (see [PIPELINE.md](./PIPELINE.md))
- [ ] **Vercel Git** — connect repo for auto-deploy on `main` (if not already)
- [ ] **GitHub Actions secrets** — optional, for `supabase-smoke` on `main`
- [ ] **Leaked password protection** — enable in Supabase Auth (recommended)
- [ ] **Rotate keys** if any were ever shared in chat
- [ ] Legal copy on `/privacy`, `/terms`, contact details in `business_settings`

## Smoke tests

1. https://moms-curry-co.vercel.app — home shows today’s menu items
2. https://moms-curry-co.vercel.app/menu — order window + add to cart
3. Checkout — test order (pay on delivery)
4. https://moms-curry-co.vercel.app/admin/login — admin sign-in
5. `/admin/orders` — list and update status

## Not in v0.1 (iteration branches)

- Admin UI for catalogue (FR-008) — use Supabase Table Editor or SQL
- Business settings UI (FR-011–012)
- Payments (Razorpay), reviews moderation UI, E2E — see [implementation-plan.md](./implementation-plan.md)
