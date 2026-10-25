"use server";

import { canTransitionOrderStatus, ORDER_STATUSES, type OrderStatus } from "@/domain/order-status";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;

  if (!ORDER_STATUSES.includes(status)) {
    redirect("/admin/orders");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/orders");

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/admin/login");

  const { data: profile } = await supabase.from("admin_profiles").select("user_id").maybeSingle();
  if (!profile) redirect("/admin/orders");

  const { data: order } = await supabase.from("orders").select("status").eq("id", orderId).single();
  if (!order) redirect("/admin/orders");

  const from = order.status as OrderStatus;
  if (!canTransitionOrderStatus(from, status)) {
    redirect("/admin/orders");
  }

  await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  await supabase.from("order_status_history").insert({
    order_id: orderId,
    from_status: from,
    to_status: status,
    changed_by: user.user.id,
  });

  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}
