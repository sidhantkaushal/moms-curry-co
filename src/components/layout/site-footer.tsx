import { WhatsAppCta } from "@/components/contact/whatsapp-cta";
import { isSupabaseConfigured } from "@/lib/env";
import { fetchBusinessSettings } from "@/server/queries/menu";
import Link from "next/link";

export async function SiteFooter() {
  const settings = isSupabaseConfigured() ? await fetchBusinessSettings() : null;

  return (
    <footer className="mt-auto border-t border-forest/10 bg-ivory">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-brown/80 md:grid-cols-3">
        <div>
          <p className="font-semibold text-forest">Mom&apos;s Curry Co.</p>
          <p className="mt-1">Home-style Indian meals, made with care.</p>
          <div className="mt-3">
            <WhatsAppCta settings={settings} variant="button" label="WhatsApp us" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cancellation-refunds">Cancellation &amp; refunds</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/contact">Contact</Link>
          <Link href="/admin">Kitchen login</Link>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-brown/60">
        © Mom&apos;s Curry Co. Direct orders when the daily menu is published.
      </p>
    </footer>
  );
}
