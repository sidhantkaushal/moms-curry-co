import { ButtonLink } from "@/components/ui/button";
import { formatInrFromPaise } from "@/domain/money";
import { readCartAction } from "@/server/actions/cart-actions";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { isSupabaseConfigured } from "@/lib/env";
import Link from "next/link";

export const metadata = { title: "Cart" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await readCartAction();

  if (!cart.dailyMenuId || cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="font-serif text-3xl text-forest">Your cart</h1>
        <p className="mt-4 text-brown/80">Your cart is empty.</p>
        <ButtonLink href="/menu" className="mt-6">Browse menu</ButtonLink>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-serif text-3xl text-forest">Your cart</h1>
        <p className="mt-4">Connect the database to view cart details.</p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: items } = await supabase!
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

  const rows = cart.lines.map((line) => {
    const row = items?.find((i) => i.id === line.dailyMenuItemId);
    const variant = row?.product_variants as unknown as {
      name: string;
      products: { name: string };
    } | null;
    const unit = (row?.price_paise as number) ?? 0;
    const lineTotal = unit * line.quantity;
    return {
      id: line.dailyMenuItemId,
      name: variant?.products.name ?? "Item",
      variant: variant?.name ?? "",
      quantity: line.quantity,
      lineTotal,
    };
  });
  const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Your cart</h1>
      <ul className="mt-8 divide-y divide-forest/10">
        {rows.map((r) => (
          <li key={r.id} className="flex justify-between gap-4 py-4 text-sm">
            <div>
              <p className="font-medium text-forest">{r.name}</p>
              <p className="text-brown/70">{r.variant} × {r.quantity}</p>
            </div>
            <p>{formatInrFromPaise(r.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between border-t border-forest/10 pt-4">
        <span className="font-medium">Subtotal</span>
        <span>{formatInrFromPaise(total)}</span>
      </div>
      <p className="mt-2 text-xs text-brown/60">
        Final total including delivery and discounts is calculated at checkout.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/checkout">Checkout</ButtonLink>
        <Link href="/menu" className="text-sm text-terracotta underline">Continue shopping</Link>
      </div>
    </div>
  );
}
