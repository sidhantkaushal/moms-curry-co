import Link from "next/link";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const supabase = await createSupabaseServerClient();
  let profile: { role: string } | null = null;
  if (supabase) {
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      const { data } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      profile = data;
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-2xl text-forest">Kitchen dashboard</h1>
      {!profile ? (
        <p className="mt-4 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm">
          Your account is signed in but not linked to <code>admin_profiles</code>. Add your user ID in
          Supabase to enable admin actions.
        </p>
      ) : (
        <p className="mt-2 text-sm text-brown/70">Role: {profile.role}</p>
      )}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        <li className="rounded-xl border border-forest/10 p-5">
          <h2 className="font-medium">Orders</h2>
          <p className="mt-1 text-sm text-brown/70">View and update today&apos;s direct orders.</p>
          <Link href="/admin/orders" className="mt-3 inline-block text-sm text-terracotta underline">
            Open orders
          </Link>
        </li>
        <li className="rounded-xl border border-forest/10 p-5">
          <h2 className="font-medium">Contact &amp; marketplace links</h2>
          <p className="mt-1 text-sm text-brown/70">Phone, WhatsApp, Zomato, Swiggy, Instagram.</p>
          <Link href="/admin/settings" className="mt-3 inline-block text-sm text-terracotta underline">
            Business settings
          </Link>
        </li>
        <li className="rounded-xl border border-forest/10 p-5">
          <h2 className="font-medium">Products &amp; catalogue</h2>
          <p className="mt-1 text-sm text-brown/70">Add dishes, variants, and prices.</p>
          <Link href="/admin/products" className="mt-3 inline-block text-sm text-terracotta underline">
            Manage products
          </Link>
        </li>
        <li className="rounded-xl border border-forest/10 p-5">
          <h2 className="font-medium">Daily menus</h2>
          <p className="mt-1 text-sm text-brown/70">Publish today&apos;s menu, sold-out toggles, duplicate.</p>
          <Link href="/admin/menus" className="mt-3 inline-block text-sm text-terracotta underline">
            Manage menus
          </Link>
        </li>
      </ul>
    </div>
  );
}
