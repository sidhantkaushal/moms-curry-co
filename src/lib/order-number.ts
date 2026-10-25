/** Human-readable order number: MCC-YYMMDD-XXXX (random segment, not sequential). */

export function generateOrderNumber(now = new Date()): string {
  const parts = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }).replace(/-/g, "");
  const yymmdd = parts.slice(2);
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `MCC-${yymmdd}-${rand}`;
}
