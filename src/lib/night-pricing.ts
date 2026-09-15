import { addDays } from "@/lib/typeform-prefill";

/** Lundi = 0 … Dimanche = 6 */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 4;

export type GuestCount = 1 | 2 | 3 | 4;

export type GuestNightPrices = Record<GuestCount, number>;

export type NightPricingRule = {
  id: string;
  from: string;
  to: string;
  weekdays: WeekdayIndex[];
  /** @deprecated Ancien format — migré vers pricesByGuests à la lecture */
  pricePerNight?: number;
  pricesByGuests: GuestNightPrices;
  createdAt: string;
};

export type NightPricingStore = {
  currency: "CHF";
  rules: NightPricingRule[];
};

export type PricesByNightAndGuests = Record<string, GuestNightPrices>;

export const PRICING_HORIZON_DAYS = 730;

export const GUEST_COUNTS: GuestCount[] = [1, 2, 3, 4];

export function emptyGuestPrices(fallback = 0): GuestNightPrices {
  return { 1: fallback, 2: fallback, 3: fallback, 4: fallback };
}

export function normalizeNightPricingRule(
  rule: NightPricingRule,
): NightPricingRule {
  const fromLegacy =
    rule.pricePerNight != null && Number.isFinite(rule.pricePerNight)
      ? Math.round(rule.pricePerNight)
      : null;
  const raw = rule.pricesByGuests;
  const prices: GuestNightPrices = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let hasAny = false;
  for (const g of GUEST_COUNTS) {
    const v = raw?.[g];
    if (v != null && Number.isFinite(v) && v > 0) {
      prices[g] = Math.round(v);
      hasAny = true;
    } else if (fromLegacy != null && fromLegacy > 0) {
      prices[g] = fromLegacy;
      hasAny = true;
    }
  }
  if (!hasAny && fromLegacy != null && fromLegacy > 0) {
    return {
      ...rule,
      pricesByGuests: emptyGuestPrices(fromLegacy),
      pricePerNight: undefined,
    };
  }
  return { ...rule, pricesByGuests: prices, pricePerNight: undefined };
}

export function emptyNightPricingStore(): NightPricingStore {
  return { currency: "CHF", rules: [] };
}

export function isoWeekdayMondayZero(isoDate: string): WeekdayIndex {
  const [y, m, d] = isoDate.split("-").map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return ((jsDay + 6) % 7) as WeekdayIndex;
}

export function pricingRangeEnd(fromIso: string): string {
  return addDays(fromIso, PRICING_HORIZON_DAYS);
}

export function expandRulesToPricesByGuests(
  rules: NightPricingRule[],
  rangeFrom: string,
  rangeTo: string,
): PricesByNightAndGuests {
  if (rangeFrom > rangeTo) return {};
  const normalized = rules.map(normalizeNightPricingRule);
  const sorted = [...normalized].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
  const prices: PricesByNightAndGuests = {};
  for (let d = rangeFrom; d <= rangeTo; d = addDays(d, 1)) {
    const wd = isoWeekdayMondayZero(d);
    for (const rule of sorted) {
      if (d < rule.from || d > rule.to) continue;
      if (!rule.weekdays.includes(wd)) continue;
      prices[d] = { ...rule.pricesByGuests };
    }
  }
  return prices;
}

export function pickPricesForGuestCount(
  pricesByNight: PricesByNightAndGuests,
  guests: GuestCount,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [night, tiers] of Object.entries(pricesByNight)) {
    const p = tiers[guests];
    if (p != null && p > 0) out[night] = p;
  }
  return out;
}

export function parseGuestCount(raw: unknown, fallback: GuestCount = 2): GuestCount {
  const n = Number(raw);
  if (n >= 1 && n <= 4 && Number.isInteger(n)) return n as GuestCount;
  return fallback;
}

export function computeStayPricing(
  checkIn: string,
  checkOut: string,
  pricesByNight: Record<string, number>,
  percentOff = 0,
): {
  nights: string[];
  subtotal: number;
  discount: number;
  total: number;
  complete: boolean;
} {
  const nights: string[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) {
    nights.push(d);
  }
  let subtotal = 0;
  let complete = nights.length > 0;
  for (const n of nights) {
    const p = pricesByNight[n];
    if (p == null || !Number.isFinite(p) || p <= 0) {
      complete = false;
      continue;
    }
    subtotal += p;
  }
  const discount =
    percentOff > 0 ? Math.round((subtotal * percentOff) / 100) : 0;
  const total = Math.max(0, subtotal - discount);
  return { nights, subtotal, discount, total, complete };
}

export function formatChf(
  amount: number,
  locale: "fr" | "en",
): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-CH" : "en-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatChfCompact(amount: number): string {
  return String(Math.round(amount));
}

export function formatGuestPricesSummary(
  prices: GuestNightPrices,
  locale: "fr" | "en",
): string {
  return GUEST_COUNTS.map((g) => formatChf(prices[g], locale)).join(" · ");
}
