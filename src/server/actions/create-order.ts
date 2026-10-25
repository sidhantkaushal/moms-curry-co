"use server";

import { z } from "zod";
import { calculateOrderTotals } from "@/domain/order-totals";
import { evaluateMenuOrderingEligibility } from "@/domain/menu-eligibility";
import { getServerSecrets, isServerOrderPipelineConfigured } from "@/lib/env";
import { generateOrderAccessToken, hashOrderAccessToken } from "@/lib/order-token";
import { generateOrderNumber } from "@/lib/order-number";
import { parseCartCookie, type CartState } from "@/lib/cart";
import { createSupabaseAdminClient } from "@/server/db/supabase-admin";
import { cookies } from "next/headers";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  fulfilmentType: z.enum(["pickup", "delivery"]),
  deliveryAddress: z.string().trim().max(500).optional(),
  deliveryNotes: z.string().trim().max(500).optional(),
  requestedSlot: z.string().trim().max(80).optional(),
  paymentMethod: z.enum(["pay_on_delivery", "upi_manual", "online_gateway"]),
  promotionCode: z.string().trim().max(40).optional(),
  idempotencyKey: z.string().trim().min(8).max(128),
});

export type CreateOrderResult =
  | { ok: true; orderNumber: string; accessToken: string; orderId: string }
  | { ok: false; error: string };

export async function createOrderAction(
  input: z.infer<typeof checkoutSchema>,
): Promise<CreateOrderResult> {
  if (!isServerOrderPipelineConfigured()) {
    return {
      ok: false,
      error:
        "Ordering is not configured yet. Add Supabase credentials and ORDER_TOKEN_PEPPER to enable checkout.",
    };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check your details and try again." };
  }

  const cookieStore = await cookies();
  const cart = parseCartCookie(cookieStore.get("mcc_cart")?.value);
  if (!cart.dailyMenuId || cart.lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  if (parsed.data.fulfilmentType === "delivery" && !parsed.data.deliveryAddress?.trim()) {
    return { ok: false, error: "Delivery address is required." };
  }

  const admin = createSupabaseAdminClient();

  const { data: existing } = await admin
    .from("orders")
    .select("id, order_number, access_token_hash")
    .eq("idempotency_key", parsed.data.idempotencyKey)
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      error: "This order was already submitted. Check your confirmation link or contact support.",
    };
  }

  const { data: menu } = await admin
    .from("daily_menus")
    .select("id, menu_date, status, ordering_opens_at, ordering_closes_at")
    .eq("id", cart.dailyMenuId)
    .maybeSingle();

  if (!menu) {
    return { ok: false, error: "Menu not found." };
  }

  const { data: settings } = await admin.from("business_settings").select("*").eq("id", 1).single();
  if (!settings) {
    return { ok: false, error: "Business settings are not configured." };
  }

  const eligibility = evaluateMenuOrderingEligibility({
    menuStatus: menu.status as "published",
    orderingPaused: settings.ordering_paused,
    directOrderingEnabled: settings.direct_ordering_enabled,
    now: new Date(),
    orderingOpensAt: menu.ordering_opens_at ? new Date(menu.ordering_opens_at) : null,
    orderingClosesAt: menu.ordering_closes_at ? new Date(menu.ordering_closes_at) : null,
  });
  if (!eligibility.eligible) {
    return { ok: false, error: eligibility.reason };
  }

  if (parsed.data.fulfilmentType === "delivery" && !settings.delivery_enabled) {
    return { ok: false, error: "Delivery is not available." };
  }
  if (parsed.data.fulfilmentType === "pickup" && !settings.pickup_enabled) {
    return { ok: false, error: "Pickup is not available." };
  }

  if (parsed.data.paymentMethod === "pay_on_delivery" && !settings.pay_on_delivery_enabled) {
    return { ok: false, error: "Pay on delivery is not available." };
  }
  if (parsed.data.paymentMethod === "upi_manual" && !settings.upi_manual_enabled) {
    return { ok: false, error: "UPI payment is not available." };
  }
  if (parsed.data.paymentMethod === "online_gateway" && !settings.online_payment_enabled) {
    return {
      ok: false,
      error: "Online payment is not configured yet.",
    };
  }

  const menuItemIds = cart.lines.map((l) => l.dailyMenuItemId);
  const { data: menuItems } = await admin
    .from("daily_menu_items")
    .select(
      `
      id,
      price_paise,
      is_sold_out,
      product_variant_id,
      product_variants (
        id,
        name,
        products ( id, name )
      )
    `,
    )
    .eq("daily_menu_id", cart.dailyMenuId)
    .in("id", menuItemIds);

  if (!menuItems || menuItems.length !== cart.lines.length) {
    return { ok: false, error: "Some items are no longer available." };
  }

  const lineInputs: { unitPricePaise: number; quantity: number }[] = [];
  const snapshots: {
    productId: string;
    productVariantId: string;
    productName: string;
    variantName: string;
    unitPricePaise: number;
    quantity: number;
  }[] = [];

  for (const cartLine of cart.lines) {
    const row = menuItems.find((m) => m.id === cartLine.dailyMenuItemId);
    if (!row || row.is_sold_out) {
      return { ok: false, error: "An item in your cart is sold out." };
    }
    const variant = row.product_variants as unknown as {
      id: string;
      name: string;
      products: { id: string; name: string };
    };
    const unitPrice = row.price_paise as number;
    lineInputs.push({ unitPricePaise: unitPrice, quantity: cartLine.quantity });
    snapshots.push({
      productId: variant.products.id,
      productVariantId: variant.id,
      productName: variant.products.name,
      variantName: variant.name,
      unitPricePaise: unitPrice,
      quantity: cartLine.quantity,
    });
  }

  let promotion: {
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderPaise: number;
  } | null = null;

  if (parsed.data.promotionCode) {
    const { data: promo } = await admin
      .from("promotions")
      .select("*")
      .eq("code", parsed.data.promotionCode)
      .eq("is_active", true)
      .maybeSingle();
    if (!promo) {
      return { ok: false, error: "Promotion code is not valid." };
    }
    const now = new Date();
    if (promo.valid_from && new Date(promo.valid_from) > now) {
      return { ok: false, error: "Promotion is not active yet." };
    }
    if (promo.valid_until && new Date(promo.valid_until) < now) {
      return { ok: false, error: "Promotion has expired." };
    }
    promotion = {
      discountType: promo.discount_type as "percentage" | "fixed",
      discountValue: promo.discount_value,
      minOrderPaise: promo.min_order_paise,
    };
  }

  const totals = calculateOrderTotals({
    lines: lineInputs,
    deliveryFeePaise: settings.delivery_fee_paise,
    fulfilmentType: parsed.data.fulfilmentType,
    promotion,
  });

  if (totals.totalPaise < settings.min_order_paise) {
    return { ok: false, error: "Order total is below the minimum required." };
  }

  const { data: customer, error: customerError } = await admin
    .from("customers")
    .insert({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
    })
    .select("id")
    .single();

  if (customerError || !customer) {
    return { ok: false, error: "Could not save customer details." };
  }

  const accessToken = generateOrderAccessToken();
  const { ORDER_TOKEN_PEPPER } = getServerSecrets();
  const tokenHash = hashOrderAccessToken(accessToken, ORDER_TOKEN_PEPPER!);
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      access_token_hash: tokenHash,
      daily_menu_id: cart.dailyMenuId,
      customer_id: customer.id,
      fulfilment_type: parsed.data.fulfilmentType,
      delivery_address: parsed.data.deliveryAddress ?? null,
      delivery_notes: parsed.data.deliveryNotes ?? null,
      requested_slot: parsed.data.requestedSlot ?? null,
      subtotal_paise: totals.subtotalPaise,
      discount_paise: totals.discountPaise,
      delivery_fee_paise: totals.deliveryFeePaise,
      total_paise: totals.totalPaise,
      promotion_code: parsed.data.promotionCode ?? null,
      idempotency_key: parsed.data.idempotencyKey,
      payment_status: parsed.data.paymentMethod === "pay_on_delivery" ? "pending" : "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: "Could not create order. Please try again." };
  }

  const orderItems = snapshots.map((s) => ({
    order_id: order.id,
    product_id: s.productId,
    product_variant_id: s.productVariantId,
    product_name_snapshot: s.productName,
    variant_name_snapshot: s.variantName,
    unit_price_paise: s.unitPricePaise,
    quantity: s.quantity,
    line_total_paise: s.unitPricePaise * s.quantity,
  }));

  const { error: itemsError } = await admin.from("order_items").insert(orderItems);
  if (itemsError) {
    await admin.from("orders").delete().eq("id", order.id);
    return { ok: false, error: "Could not save order items." };
  }

  await admin.from("order_status_history").insert({
    order_id: order.id,
    from_status: null,
    to_status: "pending_confirmation",
    note: "Order placed",
  });

  await admin.from("payments").insert({
    order_id: order.id,
    method: parsed.data.paymentMethod,
    amount_paise: totals.totalPaise,
    status: "pending",
  });

  cookieStore.set("mcc_cart", JSON.stringify({ dailyMenuId: null, lines: [] } satisfies CartState), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return {
    ok: true,
    orderNumber,
    accessToken,
    orderId: order.id,
  };
}
