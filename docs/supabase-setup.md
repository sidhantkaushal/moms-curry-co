# Supabase setup (personal project)

Use a Supabase project in **your personal** account — not a work organization.

## 1. Create a project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. **New project** → choose a name (e.g. `moms-curry-co`).
3. Set a **database password** (save it in your password manager).
4. Pick region close to India (e.g. Mumbai/Singapore) if available.
5. Wait until the project status is **Healthy**.

## 2. Run the database migration

**Option A — SQL Editor (simplest)**

1. In Supabase: **SQL** → **New query**.
2. Open `supabase/migrations/20251025000000_initial_schema.sql` from this repo.
3. Paste the full file → **Run**.
4. Confirm tables exist under **Table Editor** (e.g. `business_settings`, `products`, `daily_menus`).

**Option B — Supabase CLI**

```bash
npm install -g supabase
supabase login
cd /path/to/moms-curry-co
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

`YOUR_PROJECT_REF` is the short id in the project URL: `https://supabase.com/dashboard/project/<project-ref>`.

## 3. Copy API keys

1. Supabase → **Project Settings** (gear) → **API**.
2. Note:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (never expose in the browser or git)

## 4. Create `.env.local`

From the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ORDER_TOKEN_PEPPER=use-a-long-random-string-at-least-32-chars
```

Generate a pepper (terminal):

```bash
openssl rand -base64 32
```

Paste the output as `ORDER_TOKEN_PEPPER`.

## 5. Create an admin user

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Use **your personal email** and a strong password.
3. Copy the user **UUID** from the users list.

4. **SQL** → run:

```sql
insert into public.admin_profiles (user_id, display_name, role)
values ('YOUR-USER-UUID-HERE', 'Owner', 'owner');
```

## 6. Verify locally

```bash
npm install
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) — home should load without the “database not connected” banner.
- Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — sign in with the user from step 5.

## 7. Production (Vercel or similar)

Add the **same** variable names in the host’s environment settings:

| Variable | Expose to browser? |
|----------|------------------|
| `NEXT_PUBLIC_SITE_URL` | Yes (your `https://yourdomain.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** — server only |
| `ORDER_TOKEN_PEPPER` | **No** — server only |

Use a **new** pepper for production or the same one only if you accept invalidating old order links when rotating.

## 8. Seed data (minimal test)

After migration, `business_settings` row `id = 1` exists. Update contact fields when you have real details:

```sql
update public.business_settings
set contact_email = 'you@example.com',
    contact_phone = '+91XXXXXXXXXX'
where id = 1;
```

Create a category, product, variant, published menu, and menu items — or wait for the admin catalogue UI.

**Prices in paise:** ₹250.00 → `25000`.

## Security reminders

- Never commit `.env.local` or paste **service_role** in chat/screenshots.
- Do not put `SUPABASE_SERVICE_ROLE_KEY` in any `NEXT_PUBLIC_*` variable.
- Enable MFA on your personal Supabase and GitHub accounts.
