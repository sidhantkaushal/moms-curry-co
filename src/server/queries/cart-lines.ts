import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartState } from "@/lib/cart";

export type CartDisplayRow = {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPaise: number;
  lineTotal: number;
};

export async function fetchCartDisplayRows(
  supabase: SupabaseClient,
  cart: CartState,
): Promise<CartDisplayRow[]> {
  if (!cart.dailyMenuId || cart.lines.length === 0) return [];

  const { data: items } = await supabase
    .from("daily_menu_items")
    .select(
      `
      id,
      price_paise,
      product_variants ( name, products ( name ) )
    `,
    )
    .eq("daily_menu_id", cart.dailyMenuId)
    .in("id", cart.lines.map((l) => l.dailyMenuItemId));

  return cart.lines.map((line) => {
    const row = items?.find((i) => i.id === line.dailyMenuItemId);
    const variant = row?.product_variants as unknown as {
      name: string;
      products: { name: string };
    } | null;
    const unit = (row?.price_paise as number) ?? 0;
    return {
      id: line.dailyMenuItemId,
      name: variant?.products.name ?? "Item",
      variant: variant?.name ?? "",
      quantity: line.quantity,
      unitPaise: unit,
      lineTotal: unit * line.quantity,
    };
  });
}
