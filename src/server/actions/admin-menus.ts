"use server";

import { todayMenuDateString } from "@/lib/dates";
import { requireAdminClient } from "@/server/auth/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function rupeesToPaise(input: string): number {
  const n = Number.parseFloat(input.replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export async function createDailyMenuAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const menuDate = String(formData.get("menu_date") ?? "").trim() || todayMenuDateString();
  const status = String(formData.get("status") ?? "draft");

  const { data, error } = await supabase
    .from("daily_menus")
    .insert({
      menu_date: menuDate,
      status,
      ordering_opens_at: new Date().toISOString(),
      ordering_closes_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();

  if (error || !data) redirect("/admin/menus/new?error=1");
  revalidatePath("/admin/menus");
  revalidatePath("/menu");
  redirect(`/admin/menus/${data.id}`);
}

export async function updateDailyMenuAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "draft");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  await supabase
    .from("daily_menus")
    .update({ status, notes, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin/menus");
  revalidatePath(`/admin/menus/${id}`);
  revalidatePath("/menu");
  revalidatePath("/");
  redirect(`/admin/menus/${id}?saved=1`);
}

export async function addMenuItemAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const menuId = String(formData.get("menu_id") ?? "");
  const variantId = String(formData.get("variant_id") ?? "");
  const pricePaise = rupeesToPaise(String(formData.get("price_rupees") ?? "0"));

  if (!menuId || !variantId || pricePaise <= 0) redirect(`/admin/menus/${menuId}?error=item`);

  await supabase.from("daily_menu_items").upsert(
    {
      daily_menu_id: menuId,
      product_variant_id: variantId,
      price_paise: pricePaise,
      sort_order: 99,
      is_sold_out: false,
    },
    { onConflict: "daily_menu_id,product_variant_id" },
  );

  revalidatePath(`/admin/menus/${menuId}`);
  revalidatePath("/menu");
  redirect(`/admin/menus/${menuId}`);
}

export async function toggleMenuItemSoldOutAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const itemId = String(formData.get("item_id") ?? "");
  const menuId = String(formData.get("menu_id") ?? "");
  const soldOut = formData.get("is_sold_out") === "true";

  await supabase.from("daily_menu_items").update({ is_sold_out: soldOut }).eq("id", itemId);

  revalidatePath(`/admin/menus/${menuId}`);
  revalidatePath("/menu");
  redirect(`/admin/menus/${menuId}`);
}

export async function duplicateMenuFromDateAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const sourceDate = String(formData.get("source_date") ?? "").trim();
  const targetDate = String(formData.get("target_date") ?? "").trim() || todayMenuDateString();

  const { data: source } = await supabase
    .from("daily_menus")
    .select("id, status")
    .eq("menu_date", sourceDate)
    .maybeSingle();
  if (!source) redirect("/admin/menus?error=source");

  const { data: target, error: tErr } = await supabase
    .from("daily_menus")
    .upsert(
      {
        menu_date: targetDate,
        status: "draft",
        ordering_opens_at: new Date().toISOString(),
        ordering_closes_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "menu_date" },
    )
    .select("id")
    .single();
  if (tErr || !target) redirect("/admin/menus?error=target");

  const { data: items } = await supabase
    .from("daily_menu_items")
    .select("product_variant_id, price_paise, sort_order, is_sold_out")
    .eq("daily_menu_id", source.id);

  if (items?.length) {
    await supabase.from("daily_menu_items").upsert(
      items.map((i) => ({
        daily_menu_id: target.id,
        product_variant_id: i.product_variant_id,
        price_paise: i.price_paise,
        sort_order: i.sort_order,
        is_sold_out: false,
      })),
      { onConflict: "daily_menu_id,product_variant_id" },
    );
  }

  revalidatePath("/admin/menus");
  redirect(`/admin/menus/${target.id}`);
}
