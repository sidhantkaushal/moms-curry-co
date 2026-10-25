# Finish setup in ~5 minutes

Project: [Supabase dashboard](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce)

## Supabase MCP (Cursor)

This repo includes `.cursor/mcp.json` for project `taagmphbkztlwqtmxbce` (`read_only=false` so the agent can run SQL).

1. Open folder `~/Desktop/moms-curry-co` in Cursor.
2. **Cursor Settings → MCP** → approve **supabase** (or run login when prompted).
3. Global config can also live in `~/.cursor/mcp.json` (you may already have `supabase` there).

Optional: `npx skills add supabase/agent-skills`

## 1. API keys → `.env.local`

Open [API settings](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/settings/api) and paste into `.env.local`:

- `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (keep secret)

## 2. Database URI → `.env.local`

[Database settings](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/settings/database) → **Connection string**.

Copy the **exact** URI shown there (often **Session pooler** on port `5432` or **Transaction pooler** on `6543`).  
Do not type `db.<ref>.supabase.co` manually if it does not resolve — use the host Supabase shows (e.g. `aws-0-<region>.pooler.supabase.com` with user `postgres.<project-ref>`).

URL-encode special characters in the password (`@` → `%40`, `%` → `%25`).

## 3. Apply schema + sample menu

```bash
cd ~/Desktop/moms-curry-co
npm install
npm run db:push
npm run supabase:verify
```

Or paste SQL manually: run `supabase/migrations/20251025000000_initial_schema.sql` then `supabase/seed-dev-menu.sql` in [SQL editor](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/sql/new).

## 4. Admin user

[Auth → Users](https://supabase.com/dashboard/project/taagmphbkztlwqtmxbce/auth/users) → Add user (your email).

Then SQL:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('YOUR-AUTH-USER-UUID', 'Owner', 'owner');
```

## 5. Run locally

```bash
npm run dev
```

Site: http://localhost:3000

## 6. Public link (Vercel)

```bash
npx vercel login
npx vercel --prod
```

Add the same env vars in Vercel project settings. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL.

**Do not commit `.env.local` or share service_role keys.**
