import { getOccupiedDates } from "@/lib/calendar";
import { listAcceptedDayKeys } from "@/lib/accepted-stays-store";
import {
  computeStayPricing,
  expandRulesToPricesByGuests,
  parseGuestCount,
  pickPricesForGuestCount,
  type GuestCount,
} from "@/lib/night-pricing";
import { readNightPricingStore } from "@/lib/night-pricing-store";
import { validatePromoForStay } from "@/lib/promo-validate";
import {
  addDays,
  enumerateNights,
  isPastCalendarDate,
  isValidReservationRange,
  meetsMinimumStay,
} from "@/lib/typeform-prefill";

export type CheckoutQuote = {
  checkIn: string;
  checkOut: string;
  guestCount: GuestCount;
  nights: string[];
  subtotal: number;
  discount: number;
  total: number;
  percentOff: number;
  promoCode: string | null;
};

export async function quotePaidStay(input: {
  checkIn: string;
  checkOut: string;
  guests: unknown;
  promoCode?: string | null;
}): Promise<{ ok: true; quote: CheckoutQuote } | { ok: false; error: string; status: number }> {
  const checkIn = String(input.checkIn ?? "").slice(0, 10);
  const checkOut = String(input.checkOut ?? "").slice(0, 10);
  const guestCount = parseGuestCount(input.guests, 2);

  if (
    !isValidReservationRange({ checkIn, checkOut }) ||
    !meetsMinimumStay(checkIn, checkOut) ||
    isPastCalendarDate(checkIn)
  ) {
    return { ok: false, error: "invalid_dates", status: 400 };
  }

  let percentOff = 0;
  let promoCode: string | null = null;
  const rawPromo = input.promoCode?.trim();
  if (rawPromo) {
    const promo = await validatePromoForStay({
      code: rawPromo,
      checkIn,
      checkOut,
    });
    if (!promo.ok) {
      return { ok: false, error: promo.message, status: 400 };
    }
    percentOff = promo.percentOff;
    promoCode = promo.code;
  }

  const lastNight = addDays(checkOut, -1);
  const store = await readNightPricingStore();
  const expanded = expandRulesToPricesByGuests(
    store.rules,
    checkIn,
    lastNight >= checkIn ? lastNight : checkIn,
  );
  const nightly = pickPricesForGuestCount(expanded, guestCount);
  const pricing = computeStayPricing(checkIn, checkOut, nightly, percentOff);

  if (!pricing.complete || pricing.total <= 0) {
    return { ok: false, error: "incomplete_pricing", status: 400 };
  }

  return {
    ok: true,
    quote: {
      checkIn,
      checkOut,
      guestCount,
      nights: pricing.nights,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      total: pricing.total,
      percentOff,
      promoCode,
    },
  };
}

export async function stayOverlapsBooked(
  checkIn: string,
  checkOut: string,
): Promise<boolean> {
  const nights = enumerateNights(checkIn, checkOut);
  const [{ occupied }, accepted] = await Promise.all([
    getOccupiedDates(),
    listAcceptedDayKeys(),
  ]);
  const blocked = new Set([...occupied, ...accepted]);
  return nights.some((night) => blocked.has(night));
}
