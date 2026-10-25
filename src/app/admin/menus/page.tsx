import { duplicateMenuFromDateAction } from "@/server/actions/admin-menus";
import { requireAdminClient } from "@/server/auth/require-admin";
import { todayMenuDateString } from "@/lib/dates";
import Link from "next/link";

export const metadata = { title: "Daily menus" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminMenusPage({ searchParams }: Props) {
  const params = await searchParams;
  const { supabase } = await requireAdminClient();
  const { data: menus } = await supabase
    .from("daily_menus")
    .select("id, menu_date, status")
    .order("menu_date", { ascending: false })
    .limit(30);

  const today = todayMenuDateString();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-forest">Daily menus</h1>
        <Link href="/admin/menus/new" className="rounded-full bg-forest px-4 py-2 text-sm text-ivory">
          New menu
        </Link>
      </div>
      {params.error ? (
        <p className="mt-4 text-sm text-red-700">Could not duplicate menu. Check dates.</p>
      ) : null}

      <form action={duplicateMenuFromDateAction} className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-forest/10 p-4 text-sm">
        <p className="w-full font-medium text-forest">Duplicate menu to today</p>
        <label>
          Copy from date
          <input name="source_date" type="date" required className="mt-1 rounded border border-forest/20 px-2 py-1" />
        </label>
        <input type="hidden" name="target_date" value={today} />
        <button type="submit" className="rounded-full border border-forest/20 px-4 py-1.5">Duplicate</button>
      </form>

      <table className="mt-8 w-full text-left text-sm">
        <thead className="border-b border-forest/10 text-brown/70">
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {(menus ?? []).map((m) => (
            <tr key={m.id} className="border-b border-forest/5">
              <td className="py-3">
                <Link href={`/admin/menus/${m.id}`} className="text-terracotta underline">
                  {m.menu_date}
                </Link>
              </td>
              <td className="py-3">{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-sm">
        <Link href="/admin" className="text-terracotta underline">← Dashboard</Link>
      </p>
    </div>
  );
}
