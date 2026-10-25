import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

export const metadata = { title: "Offers" };

export default async function OffersPage() {
  let promos: { name: string; description: string | null; code: string | null }[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase!
      .from("promotions")
      .select("name, description, code")
      .eq("is_active", true);
    promos = data ?? [];
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Direct-order offers</h1>
      <p className="mt-2 text-sm text-brown/70">Discounts are applied at checkout after server validation.</p>
      {promos.length === 0 ? (
        <p className="mt-8 text-brown/80">No active promotions right now.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {promos.map((p) => (
            <li key={p.name} className="rounded-xl border border-forest/10 p-4">
              <h2 className="font-medium text-forest">{p.name}</h2>
              {p.description ? <p className="mt-1 text-sm text-brown/80">{p.description}</p> : null}
              {p.code ? <p className="mt-2 text-sm">Code: <code>{p.code}</code></p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
