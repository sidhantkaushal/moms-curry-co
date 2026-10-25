"use server";

import { buildWhatsAppUrl, normalizeIndiaPhoneForWaMe } from "@/lib/business-contact";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>) {
  if (!supabase) redirect("/admin/login");
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/admin/login");
  const { data: profile } = await supabase.from("admin_profiles").select("user_id").maybeSingle();
  if (!profile) redirect("/admin");
  return user.user;
}

export async function updateBusinessSettingsAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  await requireAdmin(supabase);

  const contact_phone = String(formData.get("contact_phone") ?? "").trim() || null;
  const contact_email = String(formData.get("contact_email") ?? "").trim() || null;
  let whatsapp_url = String(formData.get("whatsapp_url") ?? "").trim() || null;
  const instagram_url = String(formData.get("instagram_url") ?? "").trim() || null;
  const zomato_url = String(formData.get("zomato_url") ?? "").trim() || null;
  const swiggy_url = String(formData.get("swiggy_url") ?? "").trim() || null;

  if (!whatsapp_url && contact_phone) {
    const waMe = normalizeIndiaPhoneForWaMe(contact_phone);
    if (waMe) whatsapp_url = buildWhatsAppUrl(waMe);
  }

  const { error } = await supabase!
    .from("business_settings")
    .update({
      contact_phone,
      contact_email,
      whatsapp_url,
      instagram_url,
      zomato_url,
      swiggy_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    redirect("/admin/settings?error=save");
  }

  revalidatePath("/contact");
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}
