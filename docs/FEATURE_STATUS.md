# Feature status vs original product brief

This is an honest map of what **Mom's Curry Co. v0.1** ships today versus the full vision from the first detailed prompt.

## P0 — Core direct ordering (mostly done)

| ID | Feature | Status | Notes |
|----|---------|--------|-------|
| FR-001 | Public home, CTAs, menu teaser | **Done** | Empty state when no menu |
| FR-002 | Product catalogue in DB | **Done** | Admin CRUD UI → iteration/2 |
| FR-003 | Daily menus `/menu`, `/menu/[date]` | **Done** | IST dates |
| FR-004 | Variants, paise, order snapshots | **Done** | Domain tests |
| FR-005 | Cookie cart | **Done** | |
| FR-006 | Server checkout, idempotency | **Done** | Service role + pepper |
| FR-007 | Admin auth + profiles | **Done** | `/admin/login` |
| FR-008 | Admin menu/product UI | **Done (v1)** | `/admin/products`, `/admin/menus` |
| FR-009 | Admin orders + status | **Done** | `/admin/orders` |
| FR-010 | Pickup/delivery from settings | **Partial** | Checkout respects flags |

## P1 — Growth & trust (partial)

| ID | Feature | Status | Notes |
|----|---------|--------|-------|
| FR-011 | Operating hours enforcement | **Not started** | JSON field exists |
| FR-012 | Marketplace + social links | **Partial** | Admin settings + contact page |
| FR-013 | Promotions at checkout | **Partial** | Server validation; UI seeding TBD |
| FR-014 | Reviews + moderation | **Partial** | Public list only; submit flow TBD |
| FR-015 | Order tracking `/order/[token]` | **Done** | |
| FR-016 | Analytics events | **Not started** | |
| FR-017 | Payments (POD + gateway hook) | **Partial** | POD; Razorpay → iteration/5 |
| FR-018 | Notifications | **Not started** | Stubs planned |

## P2 — Later

| ID | Feature | Status |
|----|---------|--------|
| FR-019 | Loyalty ledger | Schema only |
| FR-020 | Membership page | Placeholder route |

## Contact & WhatsApp (owner request)

- **Phone / WhatsApp:** configurable in **`business_settings`** via **`/admin/settings`**, or optional env overrides (`NEXT_PUBLIC_WHATSAPP_PHONE`, `NEXT_PUBLIC_WHATSAPP_URL`).
- **Production default:** `8076577033` → `https://wa.me/918076577033` (applied in Supabase).
- **Cart → “Send order on WhatsApp”** pre-fills items; customer adds name/phone in WhatsApp.
- Website checkout remains available (pay on delivery).

## Recommended next iterations

1. `iteration/2-admin-catalogue` — FR-008  
2. `iteration/3-business-settings` — hours, delivery zones, richer settings  
3. `iteration/4-promotions-reviews` — FR-013, FR-014  
4. `iteration/5-payments` — Razorpay  
