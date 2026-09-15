import {
  computeStayPricing,
  expandRulesToPricesByGuests,
  formatChf,
  parseGuestCount,
  pickPricesForGuestCount,
  type GuestCount,
} from "@/lib/night-pricing";
import { readNightPricingStore } from "@/lib/night-pricing-store";
import type { ReservationRequest } from "@/lib/typeform";
import { addDays } from "@/lib/typeform-prefill";
import {
  getTypeformGuestCountFieldKey,
  getTypeformPromoFieldKeys,
  getTypeformStayTotalFieldKey,
} from "@/lib/typeform-refs";

export type StayQuote = {
  guestCount: GuestCount;
  nights: number;
  subtotal: number;
  discount: number;
  total: number;
  complete: boolean;
  formattedTotal: string;
  formattedSubtotal: string;
  formattedDiscount: string;
};

function parsePercentOff(hidden: Record<string, string> | undefined): number {
  if (!hidden) return 0;
  const keys = getTypeformPromoFieldKeys();
  const raw = hidden[keys.percent] ?? hidden.reduction_pct;
  if (!raw?.trim()) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

function parseHiddenTotal(hidden: Record<string, string> | undefined): number | null {
  if (!hidden) return null;
  const key = getTypeformStayTotalFieldKey();
  const raw = hidden[key] ?? hidden.montant_total;
  if (!raw?.trim()) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

export async function resolveStayQuote(
  request: ReservationRequest,
): Promise<StayQuote | null> {
  const stay = request.stayDates;
  if (!stay || stay.checkIn >= stay.checkOut) return null;

  const hidden = request.hidden;
  const guestCount = parseGuestCount(
    hidden?.[getTypeformGuestCountFieldKey()] ?? hidden?.nombre_personnes,
    2,
  );
  const percentOff = parsePercentOff(hidden);

  const lastNight = addDays(stay.checkOut, -1);
  const store = await readNightPricingStore();
  const expanded = expandRulesToPricesByGuests(
    store.rules,
    stay.checkIn,
    lastNight >= stay.checkIn ? lastNight : stay.checkIn,
  );
  const nightly = pickPricesForGuestCount(expanded, guestCount);
  let { nights, subtotal, discount, total, complete } = computeStayPricing(
    stay.checkIn,
    stay.checkOut,
    nightly,
    percentOff,
  );

  if (!complete) {
    const fallbackTotal = parseHiddenTotal(hidden);
    if (fallbackTotal != null) {
      total = fallbackTotal;
      complete = true;
      if (subtotal <= 0) subtotal = fallbackTotal + discount;
    }
  }

  return {
    guestCount,
    nights: nights.length,
    subtotal,
    discount,
    total,
    complete,
    formattedTotal: formatChf(total, "fr"),
    formattedSubtotal: formatChf(subtotal, "fr"),
    formattedDiscount: formatChf(discount, "fr"),
  };
}
