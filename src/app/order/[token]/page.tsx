import { formatInrFromPaise } from "@/domain/money";
import { fetchOrderByAccessToken } from "@/server/queries/orders";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

export const metadata = { title: "Your order" };

export default async function OrderTrackingPage({ params }: Props) {
  const { token } = await params;
  const order = await fetchOrderByAccessToken(token);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Order {order.orderNumber}</h1>
      <p className="mt-2 text-sm text-brown/70">
        Placed {new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
      </p>
      <p className="mt-6 rounded-xl border border-forest/15 bg-white/70 p-4">
        Status: <strong>{order.statusLabel}</strong>
      </p>
      <ul className="mt-8 divide-y divide-forest/10">
        {order.items.map((item, idx) => (
          <li key={idx} className="flex justify-between py-3 text-sm">
            <span>
              {item.productName} ({item.variantName}) × {item.quantity}
            </span>
            <span>{formatInrFromPaise(item.lineTotalPaise)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right font-medium">Total {formatInrFromPaise(order.totalPaise)}</p>
      <p className="mt-8 text-xs text-brown/60">
        Save this page link to track your order. It is private — do not share it publicly.
      </p>
    </div>
  );
}
