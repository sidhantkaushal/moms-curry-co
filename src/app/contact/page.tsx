import { fetchBusinessSettings } from "@/server/queries/menu";
import { isSupabaseConfigured } from "@/lib/env";
import Link from "next/link";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = isSupabaseConfigured() ? await fetchBusinessSettings() : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Contact</h1>
      <p className="mt-4 text-brown/80">
        Reach out for menu questions, catering enquiries or support. Configure your contact details in
        admin when ready.
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
            <a className="text-terracotta underline" href={`tel:${settings.contact_phone}`}>
              {settings.contact_phone}
            </a>
          ) : (
            <span className="text-brown/60">Not configured yet</span>
          )}
        </li>
        <li>
          WhatsApp:{" "}
          {settings?.whatsapp_url ? (
            <Link className="text-terracotta underline" href={settings.whatsapp_url} target="_blank">
              Chat on WhatsApp
            </Link>
          ) : (
            <span className="text-brown/60">Not configured yet</span>
          )}
        </li>
      </ul>
    </div>
  );
}
