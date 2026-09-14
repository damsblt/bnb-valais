export type DateRange = {
  checkIn: string;
  checkOut: string;
};

export function getPrefillParamNames(): { checkIn: string; checkOut: string } {
  return {
    checkIn:
      process.env.TYPEFORM_PARAM_CHECKIN?.trim() ||
      process.env.NEXT_PUBLIC_TYPEFORM_PARAM_CHECKIN?.trim() ||
      "date_arrivee",
    checkOut:
      process.env.TYPEFORM_PARAM_CHECKOUT?.trim() ||
      process.env.NEXT_PUBLIC_TYPEFORM_PARAM_CHECKOUT?.trim() ||
      "date_depart",
  };
}

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

export function isRangeAvailable(
  checkIn: string,
  checkOut: string,
  occupied: Set<string>,
): boolean {
  if (checkIn >= checkOut) return false;
  let cursor = checkIn;
  while (cursor < checkOut) {
    if (occupied.has(cursor)) return false;
    cursor = addDays(cursor, 1);
  }
  return true;
}

export function isDayInRange(
  dayKey: string,
  range: DateRange | null,
): "start" | "end" | "middle" | false {
  if (!range) return false;
  if (dayKey === range.checkIn) return "start";
  if (dayKey === range.checkOut) return "end";
  if (dayKey > range.checkIn && dayKey < range.checkOut) return "middle";
  return false;
}

export function formatRangeLabel(
  range: DateRange,
  locale: "fr" | "en",
): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const loc = locale === "fr" ? "fr-CH" : "en-GB";
  const inDate = new Date(`${range.checkIn}T12:00:00`);
  const outDate = new Date(`${range.checkOut}T12:00:00`);
  const a = inDate.toLocaleDateString(loc, opts);
  const b = outDate.toLocaleDateString(loc, opts);
  return locale === "fr" ? `${a} → ${b}` : `${a} → ${b}`;
}
