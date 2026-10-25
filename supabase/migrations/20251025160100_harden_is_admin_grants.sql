revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;
