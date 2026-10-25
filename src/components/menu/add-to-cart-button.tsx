"use client";

import { useState, useTransition } from "react";
import { readCartAction, setCartAction } from "@/server/actions/cart-actions";
import { Button } from "@/components/ui/button";

type Props = {
  dailyMenuId: string;
  dailyMenuItemId: string;
  productVariantId: string;
  disabled?: boolean;
};

export function AddToCartButton({
  dailyMenuId,
  dailyMenuItemId,
  productVariantId,
  disabled,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function add() {
    startTransition(async () => {
      const cart = await readCartAction();
      const lines = [...cart.lines];
      const existing = lines.find((l) => l.dailyMenuItemId === dailyMenuItemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        if (cart.dailyMenuId && cart.dailyMenuId !== dailyMenuId) {
          setMessage("Cart cleared for today’s menu.");
          lines.length = 0;
        }
        lines.push({ dailyMenuItemId, productVariantId, quantity: 1 });
      }
      await setCartAction(dailyMenuId, lines);
      setMessage("Added to cart");
      setTimeout(() => setMessage(null), 2000);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button type="button" disabled={disabled || pending} onClick={add} className="w-full sm:w-auto">
        {disabled ? "Sold out" : pending ? "Adding…" : "Add to cart"}
      </Button>
      {message ? (
        <span className="text-xs text-forest/70" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}
