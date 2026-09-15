import {
  GUEST_COUNTS,
  type GuestCount,
  type GuestNightPrices,
  type NightPricingRule,
  type WeekdayIndex,
} from "@/lib/night-pricing";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function sanitizeWeekdays(raw: unknown): WeekdayIndex[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const set = new Set<WeekdayIndex>();
  for (const v of raw) {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0 || n > 6) return null;
    set.add(n as WeekdayIndex);
  }
  return [...set].sort((a, b) => a - b);
}

function sanitizeGuestPrices(raw: unknown, legacySingle?: number): GuestNightPrices | null {
  const prices = {} as GuestNightPrices;
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    for (const g of GUEST_COUNTS) {
      const v = Number(o[String(g)]);
      if (!Number.isFinite(v) || v <= 0) return null;
      prices[g] = Math.round(v);
    }
    return prices;
  }
  if (legacySingle != null && legacySingle > 0) {
    for (const g of GUEST_COUNTS) {
      prices[g] = Math.round(legacySingle);
    }
    return prices;
  }
  return null;
}

export function sanitizeNightPricingRule(raw: unknown): NightPricingRule | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id.trim() : "";
  const from = typeof o.from === "string" ? o.from.trim() : "";
  const to = typeof o.to === "string" ? o.to.trim() : "";
  const weekdays = sanitizeWeekdays(o.weekdays);
  const legacy = Number(o.pricePerNight);
  const legacySingle =
    Number.isFinite(legacy) && legacy > 0 ? Math.round(legacy) : undefined;
  const pricesByGuests = sanitizeGuestPrices(o.pricesByGuests, legacySingle);
  const createdAt =
    typeof o.createdAt === "string" && o.createdAt.trim()
      ? o.createdAt.trim()
      : new Date().toISOString();

  if (!id || !ISO_DATE.test(from) || !ISO_DATE.test(to) || from > to) {
    return null;
  }
  if (!weekdays || !pricesByGuests) return null;

  return {
    id,
    from,
    to,
    weekdays,
    pricesByGuests,
    createdAt,
  };
}

export function sanitizeNightPricingRuleList(
  raw: unknown,
): NightPricingRule[] | null {
  if (!Array.isArray(raw)) return null;
  const out: NightPricingRule[] = [];
  const ids = new Set<string>();
  for (const item of raw) {
    const rule = sanitizeNightPricingRule(item);
    if (!rule) return null;
    if (ids.has(rule.id)) return null;
    ids.add(rule.id);
    out.push(rule);
  }
  return out;
}

export function sanitizeGuestCountInput(raw: unknown): GuestCount | null {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 4) return null;
  return n as GuestCount;
}
