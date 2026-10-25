import { createDailyMenuAction } from "@/server/actions/admin-menus";
import { todayMenuDateString } from "@/lib/dates";
import Link from "next/link";

export const metadata = { title: "New daily menu" };

export default function NewMenuPage() {
  const today = todayMenuDateString();
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Link href="/admin/menus" className="text-sm text-terracotta underline">← Menus</Link>
      <h1 className="mt-4 font-serif text-2xl text-forest">New daily menu</h1>
      <form action={createDailyMenuAction} className="mt-8 space-y-4">
        <label className="block text-sm">
          Menu date
          <input name="menu_date" type="date" defaultValue={today} required className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2" />
        </label>
        <label className="block text-sm">
          Status
          <select name="status" className="mt-1 w-full rounded-lg border border-forest/20 px-3 py-2">
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="scheduled">scheduled</option>
          </select>
        </label>
        <button type="submit" className="rounded-full bg-forest px-6 py-2.5 text-sm text-ivory">Create</button>
      </form>
    </div>
  );
}
