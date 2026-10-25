import {
  applyPercentageDiscount,
  clampDiscount,
  multiplyPaise,
  sumPaise,
} from "@/domain/money";

export type CartLineInput = {
  unitPricePaise: number;
  quantity: number;
};

export type PromotionInput = {
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderPaise: number;
};

export type OrderTotalsInput = {
  lines: CartLineInput[];
  deliveryFeePaise: number;
  fulfilmentType: "pickup" | "delivery";
  promotion?: PromotionInput | null;
};

export type OrderTotalsResult = {
  subtotalPaise: number;
  discountPaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
};

export function calculateOrderTotals(input: OrderTotalsInput): OrderTotalsResult {
  const subtotalPaise = sumPaise(
    ...input.lines.map((l) => multiplyPaise(l.unitPricePaise, l.quantity)),
  );

  let discountPaise = 0;
  const promo = input.promotion;
  if (promo && subtotalPaise >= promo.minOrderPaise) {
    if (promo.discountType === "fixed") {
      discountPaise = promo.discountValue;
    } else {
      discountPaise = applyPercentageDiscount(subtotalPaise, promo.discountValue);
    }
    discountPaise = clampDiscount(subtotalPaise, discountPaise);
  }

  const deliveryFeePaise =
    input.fulfilmentType === "delivery" ? Math.max(0, input.deliveryFeePaise) : 0;

  const totalPaise = subtotalPaise - discountPaise + deliveryFeePaise;

  return { subtotalPaise, discountPaise, deliveryFeePaise, totalPaise };
}
