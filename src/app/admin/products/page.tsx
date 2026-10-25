import { archiveProductAction } from "@/server/actions/admin-products";
import { requireAdminClient } from "@/server/auth/require-admin";
import Link from "next/link";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const { supabase } = await requireAdminClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, is_active, archived_at, categories ( name )")
    .is("archived_at", null)
    .order("name");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-forest">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-forest px-4 py-2 text-sm text-ivory"
        >
          Add product
        </Link>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead className="border-b border-forest/10 text-brown/70">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Active</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {(products ?? []).map((p) => {
            const cat = p.categories as unknown as { name: string } | null;
            return (
              <tr key={p.id} className="border-b border-forest/5">
                <td className="py-3">
                  <Link href={`/admin/products/${p.id}`} className="text-terracotta underline">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3">{cat?.name ?? "—"}</td>
                <td className="py-3">{p.is_active ? "Yes" : "No"}</td>
                <td className="py-3 text-right">
                  <form action={archiveProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs text-brown/60 underline">
                      Archive
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-6 text-sm">
        <Link href="/admin" className="text-terracotta underline">← Dashboard</Link>
      </p>
    </div>
  );
}
