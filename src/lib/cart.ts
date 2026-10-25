export type CartLine = {
  dailyMenuItemId: string;
  productVariantId: string;
  quantity: number;
};

export type CartState = {
  dailyMenuId: string | null;
  lines: CartLine[];
};

export const CART_COOKIE = "mcc_cart";

export function parseCartCookie(raw: string | undefined): CartState {
  if (!raw) return { dailyMenuId: null, lines: [] };
  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.lines)) {
      return { dailyMenuId: null, lines: [] };
    }
    return {
      dailyMenuId: parsed.dailyMenuId ?? null,
      lines: parsed.lines.filter(
        (l) =>
          l &&
          typeof l.dailyMenuItemId === "string" &&
          typeof l.productVariantId === "string" &&
          Number.isInteger(l.quantity) &&
          l.quantity > 0,
      ),
    };
  } catch {
    return { dailyMenuId: null, lines: [] };
  }
}

export function serializeCart(cart: CartState): string {
  return JSON.stringify(cart);
}
