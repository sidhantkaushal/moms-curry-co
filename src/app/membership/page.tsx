import { fetchBusinessSettings } from "@/server/queries/menu";
import { isSupabaseConfigured } from "@/lib/env";
import { notFound } from "next/navigation";

export const metadata = { title: "Membership" };

export default async function MembershipPage() {
  const settings = isSupabaseConfigured() ? await fetchBusinessSettings() : null;
  if (!settings?.membership_enabled) {
    notFound();
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Membership</h1>
      <p className="mt-4 text-brown/80">Membership plans will be available in a future phase.</p>
    </div>
  );
}
