"use client";

import type { Locale } from "@/lib/i18n";
import {
  computeStayPricing,
  formatChf,
  type GuestCount,
} from "@/lib/night-pricing";
import type { DateRange } from "@/lib/typeform-prefill";
import type { SiteContent } from "@/lib/content";

type StayTotalSummaryProps = {
  locale: Locale;
  range: DateRange;
  guestCount: GuestCount;
  pricesByNight: Record<string, number>;
  percentOff?: number;
  copy: SiteContent["reservations"];
};

export default function StayTotalSummary({
  locale,
  range,
  guestCount,
  pricesByNight,
  percentOff = 0,
  copy,
}: StayTotalSummaryProps) {
  const guestLine =
    guestCount === 1
      ? copy.stayTotalForOneGuest
      : copy.stayTotalForGuests.replace("{count}", String(guestCount));
  const { subtotal, discount, total, complete, nights } = computeStayPricing(
    range.checkIn,
    range.checkOut,
    pricesByNight,
    percentOff,
  );

  if (nights.length === 0) return null;

  const anyPriceInMap = Object.keys(pricesByNight).length > 0;
  if (!anyPriceInMap) {
    return null;
  }

  const missingNights = nights.length - nights.filter((n) => pricesByNight[n] > 0).length;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-sm font-semibold text-neutral-900">{copy.stayTotalTitle}</p>
      <p className="mt-1 text-xs text-neutral-600">{guestLine}</p>
      {!complete ? (
        <p className="mt-2 text-sm text-amber-800">
          {missingNights === nights.length
            ? copy.stayTotalNoRatesForDates
            : copy.stayTotalIncomplete.replace("{missing}", String(missingNights))}
        </p>
      ) : (
        <dl className="mt-3 space-y-1 text-sm text-neutral-800">
          <div className="flex justify-between gap-4">
            <dt>
              {copy.stayTotalNights.replace("{count}", String(nights.length))}
            </dt>
            <dd className="font-medium">{formatChf(subtotal, locale)}</dd>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between gap-4 text-orange-900">
              <dt>{copy.stayTotalDiscount}</dt>
              <dd className="font-medium">−{formatChf(discount, locale)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 border-t border-neutral-200 pt-2 text-base font-semibold text-neutral-900">
            <dt>{copy.stayTotalLabel}</dt>
            <dd>{formatChf(total, locale)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
