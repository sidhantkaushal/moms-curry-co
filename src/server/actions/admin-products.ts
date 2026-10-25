"use server";

import { slugify } from "@/lib/slug";
import { requireAdminClient } from "@/server/auth/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function rupeesToPaise(input: string): number {
  const n = Number.parseFloat(input.replace(/,/g, "").trim());
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export async function createProductAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const variantName = String(formData.get("variant_name") ?? "Regular portion").trim();
  const pricePaise = rupeesToPaise(String(formData.get("price_rupees") ?? "0"));

  if (!name || pricePaise <= 0) redirect("/admin/products/new?error=1");

  const slug = slugify(name);
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      category_id: categoryId || null,
      is_active: true,
    })
    .select("id")
    .single();

  if (error || !product) redirect("/admin/products/new?error=1");

  await supabase.from("product_variants").insert({
    product_id: product.id,
    name: variantName,
    price_paise: pricePaise,
    sort_order: 1,
    is_active: true,
  });

  revalidatePath("/admin/products");
  revalidatePath("/menu");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProductAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const categoryId = String(formData.get("category_id") ?? "").trim() || null;
  const isActive = formData.get("is_active") === "on";

  if (!id || !name) redirect(`/admin/products/${id}?error=1`);

  await supabase
    .from("products")
    .update({
      name,
      description,
      category_id: categoryId || null,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/menu");
  redirect(`/admin/products/${id}?saved=1`);
}

export async function addVariantAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const productId = String(formData.get("product_id") ?? "");
  const name = String(formData.get("variant_name") ?? "").trim();
  const pricePaise = rupeesToPaise(String(formData.get("price_rupees") ?? "0"));
  if (!productId || !name || pricePaise <= 0) redirect(`/admin/products/${productId}?error=variant`);

  await supabase.from("product_variants").insert({
    product_id: productId,
    name,
    price_paise: pricePaise,
    sort_order: 99,
    is_active: true,
  });

  revalidatePath(`/admin/products/${productId}`);
  redirect(`/admin/products/${productId}`);
}

export async function archiveProductAction(formData: FormData) {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");
  await supabase
    .from("products")
    .update({ archived_at: new Date().toISOString(), is_active: false })
    .eq("id", id);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
