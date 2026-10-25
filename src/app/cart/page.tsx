import { ButtonLink } from "@/components/ui/button";
import { formatInrFromPaise } from "@/domain/money";
import { buildCartWhatsAppOrderMessage, resolveWhatsAppOrderUrl } from "@/lib/whatsapp-order";
import { readCartAction } from "@/server/actions/cart-actions";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { fetchBusinessSettings } from "@/server/queries/menu";
import { fetchCartDisplayRows } from "@/server/queries/cart-lines";
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
  const rows = await fetchCartDisplayRows(supabase!, cart);
  const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);
  const settings = await fetchBusinessSettings();
  const { data: menuRow } = await supabase!
    .from("daily_menus")
    .select("menu_date")
    .eq("id", cart.dailyMenuId)
    .maybeSingle();
  const menuDate = menuRow?.menu_date ?? null;

  const whatsappMessage = buildCartWhatsAppOrderMessage({
    brandName: settings?.brand_name ?? "Mom's Curry Co.",
    menuDate,
    lines: rows.map((r) => ({
      name: r.name,
      variant: r.variant,
      quantity: r.quantity,
      lineTotalPaise: r.lineTotal,
    })),
    totalPaise: total,
  });
  const whatsappOrderUrl = resolveWhatsAppOrderUrl(settings ?? {}, whatsappMessage);

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
        Pay on delivery and final totals are confirmed on website checkout, or when you send the
        WhatsApp request below.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <ButtonLink href="/checkout">Checkout on website</ButtonLink>
        {whatsappOrderUrl ? (
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95"
          >
            Send order on WhatsApp
          </a>
        ) : (
          <span className="text-sm text-brown/60">WhatsApp ordering not configured.</span>
        )}
        <Link href="/menu" className="text-sm text-terracotta underline sm:ml-1">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
