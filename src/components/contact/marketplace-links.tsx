import type { BusinessContactSettings } from "@/lib/business-contact";
import Link from "next/link";

type Props = { settings: BusinessContactSettings | null };

export function MarketplaceLinks({ settings }: Props) {
  const links = [
    { href: settings?.zomato_url, label: "Order on Zomato" },
    { href: settings?.swiggy_url, label: "Order on Swiggy" },
    { href: settings?.instagram_url, label: "Instagram" },
  ].filter((l) => Boolean(l.href?.trim()));

  if (links.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="font-medium text-forest">Also find us</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-forest/15 px-4 py-2 text-sm hover:border-forest/30"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
