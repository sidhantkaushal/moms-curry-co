import { addVariantAction, updateProductAction } from "@/server/actions/admin-products";
import { requireAdminClient } from "@/server/auth/require-admin";
import { formatInrFromPaise } from "@/domain/money";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> };

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = await searchParams;
  const { supabase } = await requireAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, is_active, category_id")
    .eq("id", id)
    .maybeSingle();
  if (!product) notFound();

  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, name, price_paise, is_active")
    .eq("product_id", id)
    .order("sort_order");

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Link href="/admin/products" className="text-sm text-terracotta underline">← Products</Link>
      <h1 className="mt-4 font-serif text-2xl text-forest">Edit product</h1>
      {q.saved ? <p className="mt-2 text-sm text-green-800">Saved.</p> : null}

      <form action={updateProductAction} className="mt-6 space-y-4">
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm">
          Name
          <input name="name" defaultValue={product.name} required className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Description
          <textarea name="description" defaultValue={product.description ?? ""} rows={3} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Category
          <select name="category_id" defaultValue={product.category_id ?? ""} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2">
            <option value="">—</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={product.is_active} />
          Active on catalogue
        </label>
        <button type="submit" className="rounded-full bg-forest px-6 py-2.5 text-sm text-ivory">Save</button>
      </form>

      <h2 className="mt-10 font-medium text-forest">Variants</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {(variants ?? []).map((v) => (
          <li key={v.id} className="flex justify-between border-b border-forest/5 py-2">
            <span>{v.name}</span>
            <span>{formatInrFromPaise(v.price_paise)}</span>
          </li>
        ))}
      </ul>

      <form action={addVariantAction} className="mt-6 space-y-3 rounded-xl border border-forest/10 p-4">
        <input type="hidden" name="product_id" value={id} />
        <p className="text-sm font-medium">Add variant</p>
        <input name="variant_name" placeholder="Name" className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        <input name="price_rupees" type="number" min="1" placeholder="Price ₹" className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        <button type="submit" className="text-sm text-terracotta underline">Add variant</button>
      </form>
    </div>
  );
}
