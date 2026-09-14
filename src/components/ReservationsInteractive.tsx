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
import {
  getTypeformDateFieldKeys,
  getTypeformPromoFieldKeys,
} from "@/lib/typeform-refs";

type AppliedPromo = {
  code: string;
  label: string;
  percentOff: number;
};

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
  const promoKeys = useMemo(() => getTypeformPromoFieldKeys(), []);
  const [range, setRange] = useState<DateRange | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

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
      setAppliedPromo(null);
      setPromoError(null);
    },
    [syncUrl],
  );

  const promoDraft = promoInput.trim();
  const promoBlocksForm =
    Boolean(promoDraft) &&
    (!appliedPromo ||
      appliedPromo.code.toUpperCase() !== promoDraft.toUpperCase());

  const canOpenForm =
    isValidReservationRange(range) && !promoBlocksForm && !promoLoading;

  const applyPromo = useCallback(async () => {
    if (!range || !promoDraft) {
      setAppliedPromo(null);
      setPromoError(null);
      return;
    }
    setPromoLoading(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoDraft,
          checkIn: range.checkIn,
          checkOut: range.checkOut,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        promo?: AppliedPromo;
      };
      if (!res.ok || !data.ok || !data.promo) {
        setAppliedPromo(null);
        setPromoError(data.message ?? reservations.promoInvalidHint);
        return;
      }
      setAppliedPromo(data.promo);
      setPromoInput(data.promo.code);
    } catch {
      setAppliedPromo(null);
      setPromoError(reservations.promoInvalidHint);
    } finally {
      setPromoLoading(false);
    }
  }, [range, promoDraft, reservations.promoInvalidHint]);

  const clearPromo = useCallback(() => {
    setPromoInput("");
    setAppliedPromo(null);
    setPromoError(null);
  }, []);

  const hidden = useMemo(() => {
    if (!canOpenForm || !range) return {};
    const base: Record<string, string> = {
      [fieldKeys.checkIn]: range.checkIn,
      [fieldKeys.checkOut]: range.checkOut,
    };
    if (appliedPromo) {
      base[promoKeys.code] = appliedPromo.code;
      base[promoKeys.percent] = String(appliedPromo.percentOff);
    }
    return base;
  }, [
    canOpenForm,
    range,
    fieldKeys.checkIn,
    fieldKeys.checkOut,
    appliedPromo,
    promoKeys.code,
    promoKeys.percent,
  ]);

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
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-sm font-medium text-neutral-900">
                {reservations.promoOptionalLabel}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {reservations.promoOptionalHint}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setAppliedPromo(null);
                    setPromoError(null);
                  }}
                  placeholder={reservations.promoPlaceholder}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm uppercase tracking-wide text-neutral-900 placeholder:normal-case placeholder:tracking-normal focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => void applyPromo()}
                  disabled={!promoDraft || promoLoading}
                  className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {promoLoading
                    ? reservations.promoApplying
                    : reservations.promoApplyButton}
                </button>
                {appliedPromo ? (
                  <button
                    type="button"
                    onClick={clearPromo}
                    className="shrink-0 text-sm font-medium text-neutral-600 underline-offset-2 hover:underline"
                  >
                    {reservations.promoClearButton}
                  </button>
                ) : null}
              </div>
              {appliedPromo ? (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-900">
                  {reservations.promoValidBadge} — {appliedPromo.label} (
                  {appliedPromo.code})
                </p>
              ) : null}
              {promoError ? (
                <p className="mt-2 text-sm text-red-600">{promoError}</p>
              ) : null}
              {promoBlocksForm && !promoError ? (
                <p className="mt-2 text-sm text-amber-800">
                  {reservations.promoApplyButton} pour continuer avec ce code.
                </p>
              ) : null}
            </div>
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
