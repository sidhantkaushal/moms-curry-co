"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/server/actions/create-order";
import { Button } from "@/components/ui/button";

type Props = {
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  payOnDeliveryEnabled: boolean;
  upiEnabled: boolean;
  onlineEnabled: boolean;
};

export function CheckoutForm({
  pickupEnabled,
  deliveryEnabled,
  payOnDeliveryEnabled,
  upiEnabled,
  onlineEnabled,
}: Props) {
  const router = useRouter();
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createOrderAction({
        fullName: String(form.get("fullName") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        fulfilmentType: String(form.get("fulfilmentType")) as "pickup" | "delivery",
        deliveryAddress: String(form.get("deliveryAddress") ?? ""),
        deliveryNotes: String(form.get("deliveryNotes") ?? ""),
        requestedSlot: String(form.get("requestedSlot") ?? ""),
        paymentMethod: String(form.get("paymentMethod")) as
          | "pay_on_delivery"
          | "upi_manual"
          | "online_gateway",
        promotionCode: String(form.get("promotionCode") ?? ""),
        idempotencyKey,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/order/${result.accessToken}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-brown/80">Full name</span>
          <input
            name="fullName"
            required
            className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="text-brown/80">Phone</span>
          <input
            name="phone"
            type="tel"
            required
            className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-brown/80">Email (optional)</span>
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-forest">Fulfilment</legend>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {pickupEnabled ? (
            <label className="flex items-center gap-2">
              <input type="radio" name="fulfilmentType" value="pickup" defaultChecked />
              Pickup
            </label>
          ) : null}
          {deliveryEnabled ? (
            <label className="flex items-center gap-2">
              <input type="radio" name="fulfilmentType" value="delivery" />
              Delivery
            </label>
          ) : null}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="text-brown/80">Delivery address (if delivery)</span>
        <textarea
          name="deliveryAddress"
          rows={3}
          className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
        />
      </label>

      <label className="block text-sm">
        <span className="text-brown/80">Notes</span>
        <input
          name="deliveryNotes"
          className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
        />
      </label>

      <label className="block text-sm">
        <span className="text-brown/80">Preferred time slot (if offered)</span>
        <input
          name="requestedSlot"
          className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
        />
      </label>

      <label className="block text-sm">
        <span className="text-brown/80">Promotion code</span>
        <input
          name="promotionCode"
          className="mt-1 w-full rounded-lg border border-forest/20 bg-white px-3 py-2 focus-visible:outline-gold"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-forest">Payment</legend>
        <div className="mt-2 space-y-2 text-sm">
          {payOnDeliveryEnabled ? (
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="pay_on_delivery" defaultChecked />
              Pay on delivery / pickup
            </label>
          ) : null}
          {upiEnabled ? (
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="upi_manual" />
              UPI (manual verification)
            </label>
          ) : null}
          {onlineEnabled ? (
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="online_gateway" />
              Pay online
            </label>
          ) : null}
          {!payOnDeliveryEnabled && !upiEnabled && !onlineEnabled ? (
            <p className="text-brown/70">No payment methods enabled. Configure them in admin.</p>
          ) : null}
        </div>
      </fieldset>

      {error ? (
        <p className="rounded-lg bg-terracotta/15 px-4 py-3 text-sm text-brown" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
