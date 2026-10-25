# Admin & checkout — finish in 2 minutes

## 1. Service role (required for checkout)

[API settings](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/settings/api) → **secret** key → add to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

Restart `npm run dev` after saving.

## 2. Kitchen login

1. [Create Auth user](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/auth/users) (your personal email).
2. Copy the user UUID.
3. [SQL](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/sql/new):

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('YOUR-USER-UUID', 'Owner', 'owner');
```

3. Open http://localhost:3000/admin/login

## 3. Public deploy (optional)

```bash
npx vercel login
npx vercel --prod
```

Set the same env vars in Vercel (including `NEXT_PUBLIC_SITE_URL`).
