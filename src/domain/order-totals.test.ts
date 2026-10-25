import { describe, expect, it } from "vitest";
import { calculateOrderTotals } from "@/domain/order-totals";

describe("calculateOrderTotals", () => {
  it("sums line items and ignores delivery on pickup", () => {
    const result = calculateOrderTotals({
      lines: [{ unitPricePaise: 25000, quantity: 2 }],
      deliveryFeePaise: 5000,
      fulfilmentType: "pickup",
    });
    expect(result.subtotalPaise).toBe(50000);
    expect(result.deliveryFeePaise).toBe(0);
    expect(result.totalPaise).toBe(50000);
  });

  it("applies percentage promotion server-side", () => {
    const result = calculateOrderTotals({
      lines: [{ unitPricePaise: 10000, quantity: 1 }],
      deliveryFeePaise: 0,
      fulfilmentType: "pickup",
      promotion: {
        discountType: "percentage",
        discountValue: 10,
        minOrderPaise: 0,
      },
    });
    expect(result.discountPaise).toBe(1000);
    expect(result.totalPaise).toBe(9000);
  });

  it("rejects discount larger than subtotal via clamp", () => {
    const result = calculateOrderTotals({
      lines: [{ unitPricePaise: 5000, quantity: 1 }],
      deliveryFeePaise: 0,
      fulfilmentType: "pickup",
      promotion: {
        discountType: "fixed",
        discountValue: 99999,
        minOrderPaise: 0,
      },
    });
    expect(result.discountPaise).toBe(5000);
    expect(result.totalPaise).toBe(0);
  });
});
