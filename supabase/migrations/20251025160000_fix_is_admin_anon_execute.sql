-- Public reads use the anon role. Admin RLS policies call is_admin(); without
-- EXECUTE for anon, Postgres errors (42501) instead of treating admin policies as false.
grant execute on function public.is_admin() to anon;
