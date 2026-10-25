import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

export const metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  let reviews: { rating: number; body: string | null; created_at: string }[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase!
      .from("reviews")
      .select("rating, body, created_at")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);
    reviews = data ?? [];
  }

  const avg =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Customer reviews</h1>
      {avg !== null ? (
        <p className="mt-2 text-sm text-brown/70">Average rating: {avg.toFixed(1)} / 5</p>
      ) : null}
      {reviews.length === 0 ? (
        <p className="mt-8 text-brown/80">
          Approved reviews will appear here. We do not display fabricated testimonials.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((r, i) => (
            <li key={i} className="rounded-xl border border-forest/10 p-4 text-sm">
              <p className="font-medium text-gold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              {r.body ? <p className="mt-2 text-brown/80">{r.body}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
