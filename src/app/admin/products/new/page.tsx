import { createProductAction } from "@/server/actions/admin-products";
import { requireAdminClient } from "@/server/auth/require-admin";
import Link from "next/link";

export const metadata = { title: "New product" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NewProductPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase } = await requireAdminClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/admin/products" className="text-sm text-terracotta underline">← Products</Link>
      <h1 className="mt-4 font-serif text-2xl text-forest">New product</h1>
      {params.error ? (
        <p className="mt-4 text-sm text-red-700">Could not save. Check name and price.</p>
      ) : null}
      <form action={createProductAction} className="mt-8 space-y-4">
        <label className="block text-sm">
          Name
          <input name="name" required className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Description
          <textarea name="description" rows={3} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Category
          <select name="category_id" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2">
            <option value="">—</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          First variant name
          <input name="variant_name" defaultValue="Regular portion" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Price (₹)
          <input name="price_rupees" type="number" min="1" step="1" required className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <button type="submit" className="rounded-full bg-forest px-6 py-2.5 text-sm text-ivory">Create</button>
      </form>
    </div>
  );
}
