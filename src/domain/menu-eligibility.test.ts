import { describe, expect, it } from "vitest";
import { evaluateMenuOrderingEligibility } from "@/domain/menu-eligibility";

const base = {
  menuStatus: "published" as const,
  orderingPaused: false,
  directOrderingEnabled: true,
  now: new Date("2025-10-25T12:00:00+05:30"),
  orderingOpensAt: null,
  orderingClosesAt: null,
};

describe("evaluateMenuOrderingEligibility", () => {
  it("allows published menu when open", () => {
    expect(evaluateMenuOrderingEligibility(base)).toEqual({ eligible: true });
  });

  it("blocks when paused", () => {
    const result = evaluateMenuOrderingEligibility({ ...base, orderingPaused: true });
    expect(result.eligible).toBe(false);
  });

  it("blocks before ordering window", () => {
    const result = evaluateMenuOrderingEligibility({
      ...base,
      orderingOpensAt: new Date("2025-10-25T18:00:00+05:30"),
    });
    expect(result.eligible).toBe(false);
  });
});
