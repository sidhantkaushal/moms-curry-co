export type MenuPublicationStatus = "draft" | "scheduled" | "published" | "archived";

export type MenuEligibilityInput = {
  menuStatus: MenuPublicationStatus;
  orderingPaused: boolean;
  directOrderingEnabled: boolean;
  now: Date;
  orderingOpensAt: Date | null;
  orderingClosesAt: Date | null;
};

export type MenuEligibilityResult =
  | { eligible: true }
  | { eligible: false; reason: string };

export function evaluateMenuOrderingEligibility(
  input: MenuEligibilityInput,
): MenuEligibilityResult {
  if (!input.directOrderingEnabled) {
    return { eligible: false, reason: "Direct ordering is not available right now." };
  }
  if (input.orderingPaused) {
    return { eligible: false, reason: "Ordering is temporarily paused." };
  }
  if (input.menuStatus !== "published") {
    return { eligible: false, reason: "This menu is not available for ordering." };
  }
  const now = input.now.getTime();
  if (input.orderingOpensAt && now < input.orderingOpensAt.getTime()) {
    return { eligible: false, reason: "Ordering for this menu has not opened yet." };
  }
  if (input.orderingClosesAt && now > input.orderingClosesAt.getTime()) {
    return { eligible: false, reason: "Ordering for this menu has closed." };
  }
  return { eligible: true };
}
