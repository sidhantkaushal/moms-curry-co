# Security

- **Secrets**: `SUPABASE_SERVICE_ROLE_KEY`, `ORDER_TOKEN_PEPPER`, payment keys — server only, never in git.
- **Order privacy**: `access_token_hash` stored; raw token only shown once after checkout.
- **RLS**: enabled on public tables; admin via `is_admin()`; order inserts via service role in server actions.
- **Validation**: Zod on checkout; prices from DB not client.
- **Idempotency**: `idempotency_key` unique on `orders`.
- **Admin**: middleware redirects unauthenticated users from `/admin/*` (except login).

## Before production

- Review RLS policies with Supabase advisor.
- Rate-limit order creation (Vercel middleware or Supabase edge).
- Replace legal placeholder pages.
- Enable MFA on your personal Supabase and GitHub accounts.
