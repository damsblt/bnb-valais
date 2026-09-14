"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import StayDatesSummary from "@/components/StayDatesSummary";
import TypeformEmbed from "@/components/TypeformEmbed";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";
import {
  formatRangeLabel,
  isValidReservationRange,
  meetsMinimumStay,
  type DateRange,
} from "@/lib/typeform-prefill";
import { getTypeformDateFieldKeys } from "@/lib/typeform-refs";

const URL_PARAM_CHECKIN = "check_in";
const URL_PARAM_CHECKOUT = "check_out";

type ReservationsInteractiveProps = {
  locale: Locale;
  reservations: SiteContent["reservations"];
};

export default function ReservationsInteractive({
  locale,
  reservations,
}: ReservationsInteractiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fieldKeys = useMemo(() => getTypeformDateFieldKeys(), []);
  const [range, setRange] = useState<DateRange | null>(null);

  useEffect(() => {
    fetch("/api/typeform/prefill-config", { cache: "no-store" }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const checkIn = searchParams.get(URL_PARAM_CHECKIN);
    const checkOut = searchParams.get(URL_PARAM_CHECKOUT);
    if (
      checkIn &&
      checkOut &&
      checkIn < checkOut &&
      meetsMinimumStay(checkIn, checkOut)
    ) {
      setRange({ checkIn, checkOut });
      return;
    }
    setRange(null);
    if (checkIn || checkOut) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(URL_PARAM_CHECKIN);
      params.delete(URL_PARAM_CHECKOUT);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const syncUrl = useCallback(
    (next: DateRange | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(URL_PARAM_CHECKIN, next.checkIn);
        params.set(URL_PARAM_CHECKOUT, next.checkOut);
      } else {
        params.delete(URL_PARAM_CHECKIN);
        params.delete(URL_PARAM_CHECKOUT);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleRangeChange = useCallback(
    (next: DateRange | null) => {
      setRange(next);
      syncUrl(next);
    },
    [syncUrl],
  );

  const canOpenForm = isValidReservationRange(range);

  const hidden = useMemo(() => {
    if (!canOpenForm || !range) return {};
    return {
      [fieldKeys.checkIn]: range.checkIn,
      [fieldKeys.checkOut]: range.checkOut,
    };
  }, [canOpenForm, range, fieldKeys.checkIn, fieldKeys.checkOut]);

  return (
    <div className="mt-10 space-y-10">
      <AvailabilityCalendar
        locale={locale}
        title={reservations.calendarTitle}
        legendFree={reservations.legendFree}
        legendBusy={reservations.legendBusy}
        legendAccepted={reservations.legendAccepted}
        latencyNote={reservations.latencyNote}
        notConfiguredNote={reservations.notConfiguredNote}
        selectHint={reservations.calendarSelectHint}
        selectedRangeLabel={reservations.selectedRangeLabel}
        clearRangeLabel={reservations.clearRangeLabel}
        rangeInvalidHint={reservations.rangeInvalidHint}
        rangeMinNightsHint={reservations.rangeMinNightsHint}
        selectedRange={range}
        onRangeChange={handleRangeChange}
      />

      <div id="reservation-form">
        <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
          {reservations.formTitle}
        </h2>
        <p className="mt-2 text-neutral-600">
          {canOpenForm ? reservations.formPrefillNote : reservations.formNote}
        </p>
        {canOpenForm && range ? (
          <div className="mt-4 space-y-4">
            <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-950">
              {formatRangeLabel(range, locale)}
            </p>
            <StayDatesSummary locale={locale} range={range} />
          </div>
        ) : null}
        <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          {canOpenForm ? (
            <TypeformEmbed hidden={hidden} />
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 bg-neutral-50 px-8 py-16 text-center">
              <p className="text-lg font-semibold text-neutral-900">
                {reservations.formLockedTitle}
              </p>
              <p className="max-w-md text-sm text-neutral-600">
                {reservations.formLockedHint}
              </p>
              <button
                type="button"
                className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
                onClick={() =>
                  document
                    .getElementById("availability-calendar")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {reservations.formLockedAction}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
