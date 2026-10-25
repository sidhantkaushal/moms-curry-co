import { hashOrderAccessToken } from "@/lib/order-token";
import { getServerSecrets, isServerOrderPipelineConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/server/db/supabase-admin";
import type { OrderStatus } from "@/domain/order-status";
import { orderStatusLabel } from "@/domain/order-status";

export type PublicOrderView = {
  orderNumber: string;
  status: OrderStatus;
  statusLabel: string;
  fulfilmentType: string;
  totalPaise: number;
  createdAt: string;
  items: {
    productName: string;
    variantName: string;
    quantity: number;
    lineTotalPaise: number;
  }[];
};

export async function fetchOrderByAccessToken(
  accessToken: string,
): Promise<PublicOrderView | null> {
  if (!isServerOrderPipelineConfigured() || !accessToken) return null;
  const { ORDER_TOKEN_PEPPER } = getServerSecrets();
  const hash = hashOrderAccessToken(accessToken, ORDER_TOKEN_PEPPER!);
  const admin = createSupabaseAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, order_number, status, fulfilment_type, total_paise, created_at")
    .eq("access_token_hash", hash)
    .maybeSingle();

  if (!order) return null;

  const { data: items } = await admin
    .from("order_items")
    .select("product_name_snapshot, variant_name_snapshot, quantity, line_total_paise")
    .eq("order_id", order.id);

  return {
    orderNumber: order.order_number,
    status: order.status as OrderStatus,
    statusLabel: orderStatusLabel(order.status as OrderStatus),
    fulfilmentType: order.fulfilment_type,
    totalPaise: order.total_paise,
    createdAt: order.created_at,
    items: (items ?? []).map((i) => ({
      productName: i.product_name_snapshot,
      variantName: i.variant_name_snapshot,
      quantity: i.quantity,
      lineTotalPaise: i.line_total_paise,
    })),
  };
}
