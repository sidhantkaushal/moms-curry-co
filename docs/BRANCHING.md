# Git workflow — iterations and pull requests

**`main`** is the stable starting point (foundation + core ordering). Each iteration is a long-lived branch opened against `main`; ship work via **pull requests**, one iteration at a time.

## Branches

| Branch | Scope | Requirements (examples) |
|--------|--------|-------------------------|
| `main` | Released baseline | Phases 1–4 core (current starting point) |
| `iteration/2-admin-catalogue` | Admin products, variants, daily menus | FR-002, FR-008 |
| `iteration/3-business-settings` | Hours, delivery, marketplace links, contact | FR-010, FR-011, FR-012 |
| `iteration/4-promotions-reviews` | Promotions UI, moderated reviews | FR-013, FR-014 |
| `iteration/5-payments` | Razorpay / gateway, webhooks | FR-017 |
| `iteration/6-notifications-analytics` | Email/SMS interfaces, analytics events | FR-016, FR-018 |
| `iteration/7-loyalty-membership` | Ledger foundation, membership gating | FR-019, FR-020 |
| `iteration/8-hardening` | Playwright, RLS tests, performance, deploy docs | NFRs, §21–22 |

## How to work

```bash
git checkout iteration/2-admin-catalogue
# implement, commit, push
git push -u origin iteration/2-admin-catalogue
gh pr create --base main --head iteration/2-admin-catalogue --title "Iteration 2: Admin catalogue"
```

After merge, update `docs/implementation-plan.md` and `docs/requirements.md` on `main`.

## Rules

- Never commit `.env.local` or API secrets.
- Keep PRs focused on one iteration where possible.
- Run `npm run lint && npm run typecheck && npm run test && npm run build` before opening a PR.
