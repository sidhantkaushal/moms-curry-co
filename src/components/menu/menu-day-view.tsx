import { AddToCartButton } from "@/components/menu/add-to-cart-button";
import { formatInrFromPaise } from "@/domain/money";
import { evaluateMenuOrderingEligibility } from "@/domain/menu-eligibility";
import { isSupabaseConfigured } from "@/lib/env";
import { fetchBusinessSettings, fetchPublishedMenuForDate } from "@/server/queries/menu";
import Link from "next/link";

type Props = { menuDate: string; title: string };

export async function MenuDayView({ menuDate, title }: Props) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-3xl text-forest">{title}</h1>
        <p className="mt-4 text-brown/80">Connect Supabase to load the menu.</p>
      </div>
    );
  }

  const menu = await fetchPublishedMenuForDate(menuDate);
  const settings = await fetchBusinessSettings();

  const eligibility =
    menu && settings
      ? evaluateMenuOrderingEligibility({
          menuStatus: menu.status as "published",
          orderingPaused: settings.ordering_paused,
          directOrderingEnabled: settings.direct_ordering_enabled,
          now: new Date(),
          orderingOpensAt: menu.orderingOpensAt ? new Date(menu.orderingOpensAt) : null,
          orderingClosesAt: menu.orderingClosesAt ? new Date(menu.orderingClosesAt) : null,
        })
      : { eligible: false, reason: "Menu not available." };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">{title}</h1>
      {!menu ? (
        <p className="mt-6 text-brown/80">
          This date does not have a published menu.{" "}
          <Link href="/contact" className="text-terracotta underline">Contact us</Link> for availability.
        </p>
      ) : (
        <>
          {!eligibility.eligible ? (
            <p className="mt-4 rounded-lg bg-gold/15 px-4 py-3 text-sm text-brown" role="status">
              {eligibility.reason} You can still browse items below.
            </p>
          ) : null}
          <p className="mt-4 text-sm text-brown/70">
            Add items to your cart, then{" "}
            <Link href="/cart" className="text-terracotta underline">send your order on WhatsApp</Link> or
            checkout on the website.
          </p>
          <ul className="mt-8 divide-y divide-forest/10">
            {menu.items.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-forest">
                    <Link href={`/products/${item.variant.product.slug}`} className="hover:text-terracotta">
                      {item.variant.product.name}
                    </Link>
                  </h2>
                  <p className="text-sm text-brown/70">{item.variant.name}</p>
                  {item.variant.product.description ? (
                    <p className="mt-1 text-sm text-brown/60">{item.variant.product.description}</p>
                  ) : null}
                  <p className="mt-2 font-medium">{formatInrFromPaise(item.pricePaise)}</p>
                </div>
                <AddToCartButton
                  dailyMenuId={menu.id}
                  dailyMenuItemId={item.id}
                  productVariantId={item.variant.id}
                  disabled={!eligibility.eligible || item.isSoldOut}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
