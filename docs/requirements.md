# Requirements register

Personal project for **Mom's Curry Co.** — India market, INR, `Asia/Kolkata`. No fabricated business facts.

| ID | Priority | Description | Acceptance criteria (summary) | Tests | Status |
|----|----------|-------------|------------------------------|-------|--------|
| FR-001 | P0 | Public home | Brand, today menu/empty state, CTA, no fake reviews | Manual / E2E later | Partial |
| FR-002 | P0 | DB catalogue | Products, variants, archive | Migration + admin UI TBD | Partial |
| FR-003 | P0 | Daily menus | Date menus, public `/menu/[date]` | Menu eligibility tests | Partial |
| FR-004 | P0 | Variants | Paise prices, snapshots on order | Order totals tests | Partial |
| FR-005 | P0 | Cart | Add/update via cookie cart | Manual | Partial |
| FR-006 | P0 | Server orders | Transactional create, idempotency, server totals | Domain tests + integration TBD | Partial |
| FR-007 | P0 | Admin auth | Supabase Auth + `admin_profiles` | Manual | Partial |
| FR-008 | P0 | Menu admin | CRUD, duplicate, sold-out | UI not built | Not started |
| FR-009 | P0 | Order admin | List, status transitions | Admin orders page | Partial |
| FR-010 | P0 | Pickup/delivery | Settings-driven | Checkout form | Partial |
| FR-011 | P1 | Operating hours | JSON in settings | Not started | Not started |
| FR-012 | P1 | Marketplace links | `business_settings` URLs | Contact + admin settings | Partial |
| FR-013 | P1 | Promotions | Server validation on checkout | Partial | Partial |
| FR-014 | P1 | Reviews | Moderation, secure token | Not started | Not started |
| FR-015 | P1 | Order tracking | Token URL `/order/[token]` | Manual | Partial |
| FR-016 | P1 | Analytics | Events without PII | Not started | Not started |
| FR-017 | P1 | Payments interface | POD; gateway behind env | Partial | Partial |
| FR-018 | P1 | Notifications interface | Stubs | Not started | Not started |
| FR-019 | P2 | Loyalty foundation | Schema notes only | N/A | Not started |
| FR-020 | P2 | Membership | Gated page | N/A | Partial |

## Assumptions

- Supabase is created under the owner's **personal** account.
- Contact, legal text, and marketplace URLs are supplied by the business owner.
- Example dish names in marketing copy are illustrative until seeded with real data.

## Unresolved

- Exact delivery zones and slot capacity rules.
- Payment gateway choice (Razorpay suggested for INR).
- Promotion restoration on cancellation.
