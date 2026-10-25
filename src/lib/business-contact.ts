/** Owner-configurable contact channels (DB `business_settings` + optional public env overrides). */

export type BusinessContactSettings = {
  contact_phone?: string | null;
  contact_email?: string | null;
  whatsapp_url?: string | null;
  instagram_url?: string | null;
  zomato_url?: string | null;
  swiggy_url?: string | null;
};

/** Normalize Indian mobiles to wa.me digits (no +), e.g. 8076577033 → 918076577033 */
export function normalizeIndiaPhoneForWaMe(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return null;
}

export function buildWhatsAppUrl(waMeDigits: string, prefillMessage?: string): string {
  const base = `https://wa.me/${waMeDigits}`;
  if (prefillMessage?.trim()) {
    return `${base}?text=${encodeURIComponent(prefillMessage.trim())}`;
  }
  return base;
}

/** Prefer explicit URL in DB, then env URL, then phone (DB or env) → wa.me link. */
export function resolveWhatsAppUrl(settings: BusinessContactSettings | null): string | null {
  const fromDb = settings?.whatsapp_url?.trim();
  if (fromDb) return fromDb;

  const fromEnvUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  if (fromEnvUrl) return fromEnvUrl;

  const phone =
    settings?.contact_phone?.trim() || process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.trim() || "";
  if (!phone) return null;

  const waMe = normalizeIndiaPhoneForWaMe(phone);
  if (!waMe) return null;

  return buildWhatsAppUrl(waMe, process.env.NEXT_PUBLIC_WHATSAPP_PREFILL_MESSAGE);
}

export function formatIndiaPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone;
}
