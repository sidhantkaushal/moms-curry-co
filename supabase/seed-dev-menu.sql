-- Run AFTER initial migration on a fresh project.
-- Prices are examples in paise — change before taking real orders.

insert into public.categories (name, slug, sort_order)
values ('Mains', 'mains', 1)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, is_active)
select c.id, 'Royal Shahi Paneer', 'royal-shahi-paneer', 'Creamy home-style shahi paneer.', true
from public.categories c where c.slug = 'mains'
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, description, is_active)
select c.id, 'Jeera Rice', 'jeera-rice', 'Fragrant cumin rice.', true
from public.categories c where c.slug = 'mains'
on conflict (slug) do nothing;

insert into public.product_variants (product_id, name, price_paise, sort_order)
select p.id, 'Regular portion', 18000, 1 from public.products p where p.slug = 'royal-shahi-paneer'
on conflict (product_id, name) do nothing;

insert into public.product_variants (product_id, name, price_paise, sort_order)
select p.id, 'Regular portion', 8000, 1 from public.products p where p.slug = 'jeera-rice'
on conflict (product_id, name) do nothing;

insert into public.daily_menus (menu_date, status, ordering_opens_at, ordering_closes_at)
values (
  (timezone('Asia/Kolkata', now()))::date,
  'published',
  timezone('Asia/Kolkata', now()) - interval '1 hour',
  timezone('Asia/Kolkata', now()) + interval '7 days'
)
on conflict (menu_date) do update set status = excluded.status;

insert into public.daily_menu_items (daily_menu_id, product_variant_id, price_paise, sort_order)
select dm.id, v.id, 18000, 1
from public.daily_menus dm
cross join public.product_variants v
join public.products p on p.id = v.product_id and p.slug = 'royal-shahi-paneer'
where dm.menu_date = (timezone('Asia/Kolkata', now()))::date
on conflict (daily_menu_id, product_variant_id) do nothing;

insert into public.daily_menu_items (daily_menu_id, product_variant_id, price_paise, sort_order)
select dm.id, v.id, 8000, 2
from public.daily_menus dm
cross join public.product_variants v
join public.products p on p.id = v.product_id and p.slug = 'jeera-rice'
where dm.menu_date = (timezone('Asia/Kolkata', now()))::date
on conflict (daily_menu_id, product_variant_id) do nothing;

update public.business_settings
set direct_ordering_enabled = true,
    pickup_enabled = true,
    pay_on_delivery_enabled = true,
    ordering_paused = false
where id = 1;
