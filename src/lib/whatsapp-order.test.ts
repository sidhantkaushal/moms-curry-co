import { describe, expect, it } from "vitest";
import { buildCartWhatsAppOrderMessage } from "./whatsapp-order";

describe("buildCartWhatsAppOrderMessage", () => {
  it("includes items and total", () => {
    const msg = buildCartWhatsAppOrderMessage({
      brandName: "Mom's Curry Co.",
      menuDate: "2026-10-25",
      lines: [{ name: "Paneer", variant: "Regular", quantity: 2, lineTotalPaise: 36000 }],
      totalPaise: 36000,
    });
    expect(msg).toContain("Paneer");
    expect(msg).toContain("× 2");
    expect(msg).toContain("₹360");
  });
});
