"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import TypeformEmbed from "@/components/TypeformEmbed";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";
import type { DateRange } from "@/lib/typeform-prefill";

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
  const [paramKeys, setParamKeys] = useState<{ checkIn: string; checkOut: string }>({
    checkIn: "date_arrivee",
    checkOut: "date_depart",
  });
  const [range, setRange] = useState<DateRange | null>(null);

  useEffect(() => {
    fetch("/api/typeform/prefill-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { checkIn: string; checkOut: string }) => {
        if (data.checkIn && data.checkOut) setParamKeys(data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const checkIn = searchParams.get(paramKeys.checkIn);
    const checkOut = searchParams.get(paramKeys.checkOut);
    if (checkIn && checkOut && checkIn < checkOut) {
      setRange({ checkIn, checkOut });
    }
  }, [searchParams, paramKeys.checkIn, paramKeys.checkOut]);

  const syncUrl = useCallback(
    (next: DateRange | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set(paramKeys.checkIn, next.checkIn);
        params.set(paramKeys.checkOut, next.checkOut);
      } else {
        params.delete(paramKeys.checkIn);
        params.delete(paramKeys.checkOut);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, paramKeys.checkIn, paramKeys.checkOut],
  );

  const handleRangeChange = useCallback(
    (next: DateRange | null) => {
      setRange(next);
      syncUrl(next);
    },
    [syncUrl],
  );

  const hidden = useMemo(() => {
    if (!range) return {};
    return {
      [paramKeys.checkIn]: range.checkIn,
      [paramKeys.checkOut]: range.checkOut,
    };
  }, [range, paramKeys.checkIn, paramKeys.checkOut]);

  return (
    <div className="mt-10 space-y-10">
      <AvailabilityCalendar
        locale={locale}
        title={reservations.calendarTitle}
        legendFree={reservations.legendFree}
        legendBusy={reservations.legendBusy}
        latencyNote={reservations.latencyNote}
        notConfiguredNote={reservations.notConfiguredNote}
        selectHint={reservations.calendarSelectHint}
        selectedRangeLabel={reservations.selectedRangeLabel}
        clearRangeLabel={reservations.clearRangeLabel}
        rangeInvalidHint={reservations.rangeInvalidHint}
        selectedRange={range}
        onRangeChange={handleRangeChange}
      />

      <div id="reservation-form">
        <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
          {reservations.formTitle}
        </h2>
        <p className="mt-2 text-neutral-600">
          {range ? reservations.formPrefillNote : reservations.formNote}
        </p>
        <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <TypeformEmbed
            hidden={hidden}
            paramKeys={[paramKeys.checkIn, paramKeys.checkOut]}
          />
        </div>
      </div>
    </div>
  );
}
