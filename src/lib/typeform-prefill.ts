export type DateRange = {
  checkIn: string;
  checkOut: string;
};

/** Séjour minimum sur le site (nuits). */
export const MIN_STAY_NIGHTS = 2;

import { getTypeformDateFieldKeys } from "@/lib/typeform-refs";

export function getPrefillParamNames(): { checkIn: string; checkOut: string } {
  return getTypeformDateFieldKeys();
}

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

/** Nuitées entre arrivée (inclus) et départ (exclus), format YYYY-MM-DD. */
export function enumerateNights(checkIn: string, checkOut: string): string[] {
  if (checkIn >= checkOut) return [];
  const nights: string[] = [];
  let cursor = checkIn;
  while (cursor < checkOut) {
    nights.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return nights;
}

export function countNights(checkIn: string, checkOut: string): number {
  return enumerateNights(checkIn, checkOut).length;
}

export function meetsMinimumStay(
  checkIn: string,
  checkOut: string,
  minNights: number = MIN_STAY_NIGHTS,
): boolean {
  return countNights(checkIn, checkOut) >= minNights;
}

export function isValidReservationRange(
  range: DateRange | null,
): range is DateRange {
  return (
    range !== null &&
    range.checkIn < range.checkOut &&
    meetsMinimumStay(range.checkIn, range.checkOut)
  );
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
