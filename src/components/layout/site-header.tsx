import Link from "next/link";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "Our story" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-forest/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group">
          <p className="font-serif text-lg font-semibold text-forest">Mom&apos;s Curry Co.</p>
          <p className="text-xs text-brown/70">A little taste of home.</p>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-forest md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-terracotta focus-visible:outline-gold">
              {l.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="rounded-full border border-forest/15 px-3 py-1.5 hover:border-forest/30"
          >
            Cart
          </Link>
        </nav>
        <Link
          href="/cart"
          className="md:hidden rounded-full border border-forest/15 px-3 py-1.5 text-sm text-forest"
        >
          Cart
        </Link>
      </div>
    </header>
  );
}
