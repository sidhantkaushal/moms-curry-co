# Implementation plan

## Completed (foundation)

- [x] Next.js + TypeScript + Tailwind scaffold
- [x] Brand design tokens
- [x] SQL migration (`supabase/migrations/`)
- [x] Domain: money, menu eligibility, order totals, status transitions
- [x] Vitest unit tests for totals and eligibility
- [x] Public routes (home, menu, cart, checkout, order tracking, legal placeholders)
- [x] Server-side `createOrder` with idempotency and paise totals
- [x] Admin login (Supabase), orders list + status updates
- [x] `.env.example`, README, CI workflow
- [x] Remote DB schema + seed via Supabase MCP (`taagmphbkztlwqtmxbce`)
- [x] `npm run supabase:verify` passes (publishable key)

## In progress / next increments

1. **Admin menu & product UI** — FR-008, FR-002 (replace Table Editor workflow).
2. **Business settings UI** — contact, WhatsApp, marketplace links (FR-011, FR-012).
3. **RLS integration tests** — unauthorised order/admin access (FR-007, FR-015).
4. **Playwright** — mobile checkout smoke path.
5. **Reviews** — post-order token flow (FR-014).
6. **Razorpay** — behind `integrations/payments` (FR-017).

## Phase alignment

| Phase | Status |
|-------|--------|
| 1 Foundation | Done |
| 2 Public + menu | Partial (needs admin seeding tools) |
| 3 Cart + checkout | Core done |
| 4 Admin | Partial |
| 5 Promotions + reviews + links | Partial |
| 6–8 Analytics, loyalty, hardening | Not started |
