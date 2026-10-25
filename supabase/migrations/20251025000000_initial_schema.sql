-- Mom's Curry Co. — initial schema (personal project; configure business data via admin)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums (as check constraints on text for portability)
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  dietary_labels text[] not null default '{}',
  is_active boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  name text not null,
  price_paise bigint not null check (price_paise >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, name)
);

create table public.daily_menus (
  id uuid primary key default gen_random_uuid(),
  menu_date date not null unique,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published', 'archived')),
  ordering_opens_at timestamptz,
  ordering_closes_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_menu_items (
  id uuid primary key default gen_random_uuid(),
  daily_menu_id uuid not null references public.daily_menus (id) on delete cascade,
  product_variant_id uuid not null references public.product_variants (id) on delete restrict,
  price_paise bigint not null check (price_paise >= 0),
  is_sold_out boolean not null default false,
  sort_order int not null default 0,
  unique (daily_menu_id, product_variant_id)
);

create table public.business_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Mom''s Curry Co.',
  tagline text not null default 'A little taste of home.',
  timezone text not null default 'Asia/Kolkata',
  currency_code text not null default 'INR',
  ordering_paused boolean not null default false,
  direct_ordering_enabled boolean not null default true,
  pickup_enabled boolean not null default true,
  delivery_enabled boolean not null default false,
  delivery_fee_paise bigint not null default 0 check (delivery_fee_paise >= 0),
  min_order_paise bigint not null default 0 check (min_order_paise >= 0),
  contact_email text,
  contact_phone text,
  whatsapp_url text,
  instagram_url text,
  zomato_url text,
  swiggy_url text,
  other_marketplace_links jsonb not null default '[]'::jsonb,
  operating_hours jsonb not null default '{}'::jsonb,
  membership_enabled boolean not null default false,
  pay_on_delivery_enabled boolean not null default true,
  upi_manual_enabled boolean not null default false,
  online_payment_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.business_settings (id) values (1) on conflict do nothing;

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now()
);

create index customers_phone_idx on public.customers (phone);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  access_token_hash text not null,
  daily_menu_id uuid not null references public.daily_menus (id) on delete restrict,
  customer_id uuid not null references public.customers (id) on delete restrict,
  fulfilment_type text not null check (fulfilment_type in ('pickup', 'delivery')),
  delivery_address text,
  delivery_notes text,
  requested_slot text,
  status text not null default 'pending_confirmation'
    check (status in (
      'pending_confirmation', 'accepted', 'preparing',
      'ready', 'out_for_delivery', 'completed', 'cancelled'
    )),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'awaiting_verification', 'paid', 'failed', 'refunded')),
  subtotal_paise bigint not null check (subtotal_paise >= 0),
  discount_paise bigint not null default 0 check (discount_paise >= 0),
  delivery_fee_paise bigint not null default 0 check (delivery_fee_paise >= 0),
  total_paise bigint not null check (total_paise >= 0),
  promotion_code text,
  idempotency_key text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_menu_date_idx on public.orders (daily_menu_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null,
  product_variant_id uuid not null,
  product_name_snapshot text not null,
  variant_name_snapshot text not null,
  unit_price_paise bigint not null check (unit_price_paise >= 0),
  quantity int not null check (quantity > 0),
  line_total_paise bigint not null check (line_total_paise >= 0)
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid,
  note text,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  method text not null check (method in ('pay_on_delivery', 'upi_manual', 'online_gateway')),
  provider text,
  provider_reference text,
  amount_paise bigint not null check (amount_paise >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value bigint not null check (discount_value > 0),
  min_order_paise bigint not null default 0,
  auto_apply boolean not null default false,
  valid_from timestamptz,
  valid_until timestamptz,
  max_redemptions int,
  max_per_customer int,
  is_active boolean not null default true,
  combinable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.promotion_redemptions (
  id uuid primary key default gen_random_uuid(),
  promotion_id uuid not null references public.promotions (id) on delete restrict,
  order_id uuid not null references public.orders (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  discount_paise bigint not null check (discount_paise >= 0),
  created_at timestamptz not null default now(),
  unique (promotion_id, order_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  moderation_status text not null default 'pending'
    check (moderation_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'admin' check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.daily_menus enable row level security;
alter table public.daily_menu_items enable row level security;
alter table public.business_settings enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.payments enable row level security;
alter table public.promotions enable row level security;
alter table public.promotion_redemptions enable row level security;
alter table public.reviews enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.admin_audit_log enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid()
  );
$$;

-- Public read: catalogue + published menus + approved reviews + business settings (non-secret fields)
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read active products" on public.products for select using (is_active and archived_at is null);
create policy "Public read active variants" on public.product_variants for select using (is_active);
create policy "Public read published menus" on public.daily_menus for select using (status = 'published');
create policy "Public read published menu items" on public.daily_menu_items for select
  using (exists (
    select 1 from public.daily_menus dm
    where dm.id = daily_menu_id and dm.status = 'published'
  ));
create policy "Public read business settings" on public.business_settings for select using (true);
create policy "Public read approved reviews" on public.reviews for select using (moderation_status = 'approved');
create policy "Public read active promotions meta" on public.promotions for select using (is_active);

-- Admin all on operational tables
create policy "Admin manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage menus" on public.daily_menus for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage menu items" on public.daily_menu_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage settings" on public.business_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin read customers" on public.customers for select using (public.is_admin());
create policy "Admin manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage order history" on public.order_status_history for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage promotions" on public.promotions for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin read redemptions" on public.promotion_redemptions for select using (public.is_admin());
create policy "Admin manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin read profiles" on public.admin_profiles for select using (public.is_admin());
create policy "Admin insert audit" on public.admin_audit_log for insert with check (public.is_admin());
create policy "Admin read audit" on public.admin_audit_log for select using (public.is_admin());

-- Orders are created via service role / server only (no public insert policy on orders)
