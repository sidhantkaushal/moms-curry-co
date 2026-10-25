# Database

PostgreSQL via **Supabase**. Money stored as **integer paise**.

## Migrations

Apply `supabase/migrations/20251025000000_initial_schema.sql` using either:

- Supabase CLI: `supabase db push` (linked project), or
- SQL Editor in Supabase Dashboard (personal project).

## Bootstrap admin

1. Create a user in Supabase Auth (your personal email).
2. Insert profile:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('<auth-users-uuid>', 'Owner', 'owner');
```

## Seed menu (example only — use your real prices)

After creating categories, products, variants, and a `daily_menus` row for today with `status = 'published'`, link variants in `daily_menu_items`.

## Backups

Use Supabase project backups (paid plan) or `pg_dump` via connection string. Document restore in `deployment.md`.
