# Architecture

Modular monolith: single Next.js application.

```
src/
  app/           # Routes (RSC + client islands)
  components/    # UI
  domain/        # Pure business logic (tested)
  lib/           # Env, cart, tokens, dates
  server/
    actions/     # Server actions (orders, cart, admin)
    db/          # Supabase clients
    queries/     # Read models
  integrations/  # (future) payments, notifications
```

## Data flow (ordering)

1. Customer builds cart (cookie stores IDs + quantities only).
2. Checkout server action loads menu rows and settings with **service role**.
3. Domain module recalculates totals in paise.
4. Order + items + payment row inserted; access token returned once (hashed at rest).

## Auth

- **Customers**: no account required for v1; order access via secret URL token.
- **Admins**: Supabase Auth session; `admin_profiles` drives `is_admin()` for RLS.

## Timezone

All menu dates use `Asia/Kolkata` helpers in `src/lib/dates.ts`.

## Personal project boundary

No shared infrastructure with employer codebases. Deploy from a **personal** GitHub repo to Vercel (or similar) with personal Supabase.
