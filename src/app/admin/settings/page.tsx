import { resolveWhatsAppUrl } from "@/lib/business-contact";
import { updateBusinessSettingsAction } from "@/server/actions/admin-settings";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import Link from "next/link";

export const metadata = { title: "Business settings" };

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function AdminSettingsPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <p className="p-8">Supabase not configured.</p>;
  }

  const { data: settings } = await supabase.from("business_settings").select("*").eq("id", 1).single();
  const previewWa = resolveWhatsAppUrl(settings);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-terracotta underline">← Dashboard</Link>
      <h1 className="mt-4 font-serif text-2xl text-forest">Business contact &amp; links</h1>
      <p className="mt-2 text-sm text-brown/70">
        Shown on the contact page and footer. Leave WhatsApp URL empty to auto-build from phone (
        <code className="text-xs">wa.me</code>).
      </p>

      {params.saved ? (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-900" role="status">
          Saved.
        </p>
      ) : null}
      {params.error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          Could not save. Check your admin permissions.
        </p>
      ) : null}

      <form action={updateBusinessSettingsAction} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-forest">Phone</span>
          <input
            name="contact_phone"
            defaultValue={settings?.contact_phone ?? ""}
            placeholder="8076577033"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-forest">Email</span>
          <input
            name="contact_email"
            type="email"
            defaultValue={settings?.contact_email ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-forest">WhatsApp URL (optional override)</span>
          <input
            name="whatsapp_url"
            defaultValue={settings?.whatsapp_url ?? ""}
            placeholder="https://wa.me/918076577033"
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2"
          />
        </label>
        {previewWa ? (
          <p className="text-xs text-brown/60">
            Live link preview:{" "}
            <a href={previewWa} target="_blank" rel="noopener noreferrer" className="text-terracotta underline">
              {previewWa}
            </a>
          </p>
        ) : null}
        <label className="block text-sm">
          <span className="font-medium text-forest">Instagram URL</span>
          <input
            name="instagram_url"
            defaultValue={settings?.instagram_url ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-forest">Zomato URL</span>
          <input
            name="zomato_url"
            defaultValue={settings?.zomato_url ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-forest">Swiggy URL</span>
          <input
            name="swiggy_url"
            defaultValue={settings?.swiggy_url ?? ""}
            className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-ivory"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
