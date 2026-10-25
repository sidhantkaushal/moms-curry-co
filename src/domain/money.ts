/** All monetary amounts in integer paise (1 INR = 100 paise). */

export function formatInrFromPaise(paise: number): string {
  if (!Number.isInteger(paise) || paise < 0) {
    throw new Error("Invalid paise amount");
  }
  const rupees = Math.floor(paise / 100);
  const remainder = paise % 100;
  return `₹${rupees.toLocaleString("en-IN")}${remainder ? `.${remainder.toString().padStart(2, "0")}` : ""}`;
}

export function multiplyPaise(unitPaise: number, quantity: number): number {
  if (!Number.isInteger(unitPaise) || unitPaise < 0) throw new Error("Invalid unit price");
  if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Invalid quantity");
  return unitPaise * quantity;
}

export function sumPaise(...amounts: number[]): number {
  return amounts.reduce((acc, n) => {
    if (!Number.isInteger(n) || n < 0) throw new Error("Invalid amount in sum");
    return acc + n;
  }, 0);
}

export function applyPercentageDiscount(subtotalPaise: number, percent: number): number {
  if (percent <= 0 || percent > 100) return 0;
  return Math.floor((subtotalPaise * percent) / 100);
}

export function clampDiscount(subtotalPaise: number, discountPaise: number): number {
  return Math.min(Math.max(0, discountPaise), subtotalPaise);
}
