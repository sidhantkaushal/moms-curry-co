import { buildWhatsAppUrl, normalizeIndiaPhoneForWaMe, type BusinessContactSettings } from "@/lib/business-contact";
import { formatInrFromPaise } from "@/domain/money";

export type WhatsAppOrderLine = {
  name: string;
  variant: string;
  quantity: number;
  lineTotalPaise: number;
};

export function buildCartWhatsAppOrderMessage(params: {
  brandName: string;
  menuDate?: string | null;
  lines: WhatsAppOrderLine[];
  totalPaise: number;
}): string {
  const { brandName, menuDate, lines, totalPaise } = params;
  const header = `Hi ${brandName}! I'd like to place an order:`;
  const dateLine = menuDate ? `\nMenu date: ${menuDate}` : "";
  const itemLines = lines
    .map(
      (l) =>
        `• ${l.name} (${l.variant}) × ${l.quantity} — ${formatInrFromPaise(l.lineTotalPaise)}`,
    )
    .join("\n");
  const footer =
    `\nSubtotal: ${formatInrFromPaise(totalPaise)}` +
    "\n\nName:\nPhone:\nPickup / delivery:\nNotes:";
  return `${header}${dateLine}\n\n${itemLines}${footer}`;
}

/** Build wa.me link with order text (strips any existing ?text= on stored URL). */
export function resolveWhatsAppOrderUrl(
  settings: BusinessContactSettings & { brand_name?: string | null },
  message: string,
): string | null {
  const explicit = settings?.whatsapp_url?.trim();
  const phone = settings?.contact_phone?.trim() || process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.trim() || "";

  let waMe: string | null = null;
  if (explicit) {
    try {
      const path = new URL(explicit).pathname.replace(/^\//, "");
      waMe = path.split("?")[0] || null;
    } catch {
      waMe = null;
    }
  }
  if (!waMe && phone) waMe = normalizeIndiaPhoneForWaMe(phone);
  if (!waMe) {
    const envUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
    if (envUrl) {
      try {
        waMe = new URL(envUrl).pathname.replace(/^\//, "").split("?")[0] || null;
      } catch {
        waMe = null;
      }
    }
  }
  if (!waMe) return null;
  return buildWhatsAppUrl(waMe, message);
}
