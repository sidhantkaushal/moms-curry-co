import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { redirect } from "next/navigation";

export async function requireAdminClient() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login");

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", user.user.id)
    .maybeSingle();
  if (!profile) redirect("/admin");

  return { supabase, userId: user.user.id };
}
