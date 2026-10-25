import { orderStatusLabel, type OrderStatus } from "@/domain/order-status";
import { formatInrFromPaise } from "@/domain/money";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { updateOrderStatusAction } from "@/server/actions/admin-orders";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <p className="p-8">Supabase not configured.</p>;
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total_paise, created_at, customers ( full_name, phone )")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-2xl text-forest">Orders</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-forest/10 text-brown/70">
            <tr>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => {
              const customer = o.customers as unknown as { full_name: string; phone: string } | null;
              return (
                <tr key={o.id} className="border-b border-forest/5">
                  <td className="py-3 pr-4 font-medium">{o.order_number}</td>
                  <td className="py-3 pr-4">
                    {customer?.full_name}
                    <br />
                    <span className="text-brown/60">{customer?.phone}</span>
                  </td>
                  <td className="py-3 pr-4">{formatInrFromPaise(o.total_paise)}</td>
                  <td className="py-3 pr-4">{orderStatusLabel(o.status as OrderStatus)}</td>
                  <td className="py-3">
                    <form action={updateOrderStatusAction} className="flex flex-wrap gap-2">
                      <input type="hidden" name="orderId" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="rounded border border-forest/20 px-2 py-1"
                        aria-label={`Status for ${o.order_number}`}
                      >
                        {[
                          "pending_confirmation",
                          "accepted",
                          "preparing",
                          "ready",
                          "out_for_delivery",
                          "completed",
                          "cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>{orderStatusLabel(s as OrderStatus)}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-full bg-forest px-3 py-1 text-xs text-ivory"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!orders?.length ? <p className="mt-6 text-brown/70">No orders yet.</p> : null}
      </div>
    </div>
  );
}
