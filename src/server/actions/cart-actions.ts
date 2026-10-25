"use server";

import { cookies } from "next/headers";
import { parseCartCookie, serializeCart, type CartLine } from "@/lib/cart";

export async function setCartAction(dailyMenuId: string, lines: CartLine[]) {
  const cookieStore = await cookies();
  cookieStore.set(
    "mcc_cart",
    serializeCart({
      dailyMenuId,
      lines: lines.filter((l) => l.quantity > 0),
    }),
    { httpOnly: true, sameSite: "lax", path: "/" },
  );
}

export async function clearCartAction() {
  const cookieStore = await cookies();
  cookieStore.set("mcc_cart", serializeCart({ dailyMenuId: null, lines: [] }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function readCartAction() {
  const cookieStore = await cookies();
  return parseCartCookie(cookieStore.get("mcc_cart")?.value);
}
