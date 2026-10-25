const TZ = "Asia/Kolkata";

export function todayMenuDateString(now = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: TZ });
}

export function formatMenuDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}
