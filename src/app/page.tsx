import { ButtonLink } from "@/components/ui/button";
import { formatInrFromPaise } from "@/domain/money";
import { todayMenuDateString, formatMenuDateLabel } from "@/lib/dates";
import { isSupabaseConfigured } from "@/lib/env";
import { fetchBusinessSettings, fetchPublishedMenuForDate } from "@/server/queries/menu";
import Link from "next/link";

export default async function HomePage() {
  const today = todayMenuDateString();
  const menu = isSupabaseConfigured() ? await fetchPublishedMenuForDate(today) : null;
  const settings = isSupabaseConfigured() ? await fetchBusinessSettings() : null;

  const featured = menu?.items.slice(0, 3) ?? [];

  return (
    <div>
      <section className="border-b border-forest/10 bg-gradient-to-b from-ivory to-ivory">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-wide text-gold">Home-style Indian kitchen</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-forest md:text-5xl">
              {settings?.brand_name ?? "Mom's Curry Co."}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-brown/80">
              {settings?.tagline ?? "A little taste of home."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/menu">View today&apos;s menu</ButtonLink>
              <ButtonLink href="/cart" variant="secondary">Go to cart</ButtonLink>
            </div>
            {!isSupabaseConfigured() ? (
              <p className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-brown">
                Database not connected yet. Add Supabase environment variables to load menus and accept
                orders. See <code className="text-forest">docs/deployment.md</code> in the project.
              </p>
            ) : null}
          </div>
          <div className="flex-1 rounded-2xl border border-forest/10 bg-white/60 p-6 shadow-sm">
            <h2 className="font-serif text-xl text-forest">How ordering works</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-brown/80">
              <li>Check today&apos;s published menu.</li>
              <li>Add dishes and portions to your cart.</li>
              <li>Checkout with your contact details.</li>
              <li>Track your order with your private confirmation link.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-forest">Today&apos;s menu</h2>
            <p className="text-sm text-brown/70">{formatMenuDateLabel(today)}</p>
          </div>
          <Link href={`/menu/${today}`} className="text-sm text-terracotta hover:underline">
            Shareable link
          </Link>
        </div>
        {!menu || menu.items.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-forest/20 p-8 text-center text-brown/70">
            No menu is published for today yet. Please check back soon or{" "}
            <Link href="/contact" className="text-terracotta underline">get in touch</Link>.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-forest/10 bg-white/70 p-5 shadow-sm"
              >
                <h3 className="font-medium text-forest">{item.variant.product.name}</h3>
                <p className="text-sm text-brown/70">{item.variant.name}</p>
                <p className="mt-2 font-medium">{formatInrFromPaise(item.pricePaise)}</p>
              </li>
            ))}
          </ul>
        )}
        {menu && menu.items.length > 3 ? (
          <div className="mt-6 text-center">
            <ButtonLink href="/menu" variant="ghost">See full menu</ButtonLink>
          </div>
        ) : null}
      </section>

      <section className="border-t border-forest/10 bg-forest/5">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-serif text-2xl text-forest">Our story</h2>
          <p className="mt-4 max-w-2xl text-brown/80">
            Mom&apos;s Curry Co. is a home-style Indian cloud kitchen focused on comforting, familiar
            flavours. Full story and photos can be configured in the admin when you are ready to publish
            them.
          </p>
          <ButtonLink href="/about" className="mt-6" variant="ghost">
            Read more
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
