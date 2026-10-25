import { MarketplaceLinks } from "@/components/contact/marketplace-links";
import { WhatsAppCta } from "@/components/contact/whatsapp-cta";
import { formatIndiaPhoneDisplay, resolveWhatsAppUrl } from "@/lib/business-contact";
import { fetchBusinessSettings } from "@/server/queries/menu";
import { isSupabaseConfigured } from "@/lib/env";
import Link from "next/link";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = isSupabaseConfigured() ? await fetchBusinessSettings() : null;
  const whatsappUrl = resolveWhatsAppUrl(settings);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Contact</h1>
      <p className="mt-4 text-brown/80">
        Questions about today&apos;s menu, catering, or an existing order? Reach us below. Direct ordering
        stays on this website; WhatsApp is for enquiries only.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li>
          Email:{" "}
          {settings?.contact_email ? (
            <a className="text-terracotta underline" href={`mailto:${settings.contact_email}`}>
              {settings.contact_email}
            </a>
          ) : (
            <span className="text-brown/60">Not configured yet</span>
          )}
        </li>
        <li>
          Phone:{" "}
          {settings?.contact_phone ? (
            <a className="text-terracotta underline" href={`tel:${settings.contact_phone.replace(/\s/g, "")}`}>
              {formatIndiaPhoneDisplay(settings.contact_phone)}
            </a>
          ) : (
            <span className="text-brown/60">Not configured yet</span>
          )}
        </li>
        <li className="flex flex-wrap items-center gap-3">
          <span>WhatsApp:</span>
          {whatsappUrl ? (
            <WhatsAppCta settings={settings} variant="button" />
          ) : (
            <span className="text-brown/60">Not configured yet</span>
          )}
        </li>
      </ul>
      <MarketplaceLinks settings={settings} />
      <p className="mt-10 text-xs text-brown/60">
        Kitchen team can update these details in{" "}
        <Link href="/admin/settings" className="text-terracotta underline">admin settings</Link>.
      </p>
    </div>
  );
}
