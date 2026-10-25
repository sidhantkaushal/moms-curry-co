# Testing

## Unit (Vitest)

- `src/domain/order-totals.test.ts`
- `src/domain/menu-eligibility.test.ts`

Run: `npm run test`

## Not yet automated

- Full checkout against Supabase (needs test project + credentials).
- Playwright mobile checkout.
- RLS unauthorised access attempts.

Document blocked tests in CI when secrets are absent; local integration uses `.env.local` on a **personal** Supabase project.

## Release checks

```bash
npm run lint && npm run typecheck && npm run test && npm run build
```
