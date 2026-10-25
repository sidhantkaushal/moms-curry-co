import { resolveWhatsAppUrl, type BusinessContactSettings } from "@/lib/business-contact";
import Link from "next/link";

type Props = {
  settings: BusinessContactSettings | null;
  className?: string;
  variant?: "link" | "button";
  label?: string;
};

export function WhatsAppCta({
  settings,
  className = "",
  variant = "link",
  label = "Chat on WhatsApp",
}: Props) {
  const href = resolveWhatsAppUrl(settings);
  if (!href) return null;

  const base =
    variant === "button"
      ? "inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-95"
      : "text-terracotta underline";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`}
    >
      {label}
    </Link>
  );
}
