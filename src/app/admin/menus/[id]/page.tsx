import {
  addMenuItemAction,
  toggleMenuItemSoldOutAction,
  updateDailyMenuAction,
} from "@/server/actions/admin-menus";
import { requireAdminClient } from "@/server/auth/require-admin";
import { formatInrFromPaise } from "@/domain/money";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditMenuPage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = await searchParams;
  const { supabase } = await requireAdminClient();

  const { data: menu } = await supabase
    .from("daily_menus")
    .select("id, menu_date, status, notes")
    .eq("id", id)
    .maybeSingle();
  if (!menu) notFound();

  const { data: items } = await supabase
    .from("daily_menu_items")
    .select(
      `
      id,
      price_paise,
      is_sold_out,
      product_variants ( id, name, products ( name ) )
    `,
    )
    .eq("daily_menu_id", id)
    .order("sort_order");

  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, name, price_paise, products ( name )")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin/menus" className="text-sm text-terracotta underline">← Menus</Link>
      <h1 className="mt-4 font-serif text-2xl text-forest">Menu {menu.menu_date}</h1>
      {q.saved ? <p className="mt-2 text-sm text-green-800">Saved.</p> : null}

      <form action={updateDailyMenuAction} className="mt-6 space-y-4 rounded-xl border border-forest/10 p-4">
        <input type="hidden" name="id" value={id} />
        <label className="block text-sm">
          Status
          <select name="status" defaultValue={menu.status} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2">
            <option value="draft">draft</option>
            <option value="scheduled">scheduled</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="block text-sm">
          Notes
          <textarea name="notes" defaultValue={menu.notes ?? ""} rows={2} className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <button type="submit" className="rounded-full bg-forest px-5 py-2 text-sm text-ivory">Save menu</button>
      </form>

      <h2 className="mt-10 font-medium text-forest">Items on this menu</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {(items ?? []).map((row) => {
          const v = row.product_variants as unknown as {
            id: string;
            name: string;
            products: { name: string };
          };
          return (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-forest/5 py-2">
              <span>
                {v.products.name} — {v.name} ({formatInrFromPaise(row.price_paise)})
                {row.is_sold_out ? <span className="ml-2 text-brown/60">Sold out</span> : null}
              </span>
              <form action={toggleMenuItemSoldOutAction}>
                <input type="hidden" name="item_id" value={row.id} />
                <input type="hidden" name="menu_id" value={id} />
                <input type="hidden" name="is_sold_out" value={row.is_sold_out ? "false" : "true"} />
                <button type="submit" className="text-xs text-terracotta underline">
                  {row.is_sold_out ? "Mark available" : "Mark sold out"}
                </button>
              </form>
            </li>
          );
        })}
      </ul>

      <form action={addMenuItemAction} className="mt-8 space-y-3 rounded-xl border border-forest/10 p-4">
        <input type="hidden" name="menu_id" value={id} />
        <p className="text-sm font-medium">Add item from catalogue</p>
        <select name="variant_id" required className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm">
          <option value="">Select variant</option>
          {(variants ?? []).map((v) => {
            const p = v.products as unknown as { name: string };
            return (
              <option key={v.id} value={v.id}>
                {p.name} — {v.name} (list {formatInrFromPaise(v.price_paise)})
              </option>
            );
          })}
        </select>
        <input name="price_rupees" type="number" min="1" placeholder="Menu price ₹" required className="w-full rounded-lg border border-forest/20 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-full bg-forest px-5 py-2 text-sm text-ivory">Add to menu</button>
      </form>
    </div>
  );
}
