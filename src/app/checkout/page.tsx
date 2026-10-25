import { CheckoutForm } from "@/components/checkout/checkout-form";
import { fetchBusinessSettings } from "@/server/queries/menu";
import { isSupabaseConfigured } from "@/lib/env";
import { readCartAction } from "@/server/actions/cart-actions";
import { ButtonLink } from "@/components/ui/button";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await readCartAction();
  if (!cart.lines.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="font-serif text-3xl text-forest">Checkout</h1>
        <p className="mt-4">Your cart is empty.</p>
        <ButtonLink href="/menu" className="mt-6">View menu</ButtonLink>
      </div>
    );
  }

  const settings = isSupabaseConfigured() ? await fetchBusinessSettings() : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl text-forest">Checkout</h1>
      <p className="mt-2 text-sm text-brown/70">
        Prices and availability are confirmed on the server when you place your order.
      </p>
      <div className="mt-8">
        <CheckoutForm
          pickupEnabled={settings?.pickup_enabled ?? true}
          deliveryEnabled={settings?.delivery_enabled ?? false}
          payOnDeliveryEnabled={settings?.pay_on_delivery_enabled ?? true}
          upiEnabled={settings?.upi_manual_enabled ?? false}
          onlineEnabled={settings?.online_payment_enabled ?? false}
        />
      </div>
    </div>
  );
}
