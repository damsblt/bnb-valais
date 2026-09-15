"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  formatChfCompact,
  pickPricesForGuestCount,
  type GuestCount,
  type PricesByNightAndGuests,
} from "@/lib/night-pricing";
import {
  formatRangeLabel,
  isDayInRange,
  isRangeAvailable,
  meetsMinimumStay,
  type DateRange,
} from "@/lib/typeform-prefill";

type AvailabilityCalendarProps = {
  locale: Locale;
  title: string;
  legendFree: string;
  legendBusy: string;
  legendAccepted: string;
  latencyNote: string;
  notConfiguredNote: string;
  selectHint: string;
  selectedRangeLabel: string;
  clearRangeLabel: string;
  rangeInvalidHint: string;
  rangeMinNightsHint: string;
  legendPrice?: string;
  guestCount: GuestCount;
  selectedRange: DateRange | null;
  onRangeChange: (range: DateRange | null) => void;
  /** When set (including while loading as `undefined` from parent), skips internal fetch. */
  availability?: AvailabilityPayload | null;
};

export type AvailabilityPayload = {
  occupied: string[];
  accepted?: string[];
  pricesByNight?: PricesByNightAndGuests;
  currency?: string;
  syncedAt: string;
  configured: boolean;
};

type AvailabilityResponse = AvailabilityPayload;

const weekdayLabels = {
  fr: ["L", "M", "M", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
};

function monthLabel(date: Date, locale: Locale) {
  return date.toLocaleDateString(locale === "fr" ? "fr-CH" : "en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function AvailabilityCalendar({
  locale,
  title,
  legendFree,
  legendBusy,
  legendAccepted,
  latencyNote,
  notConfiguredNote,
  selectHint,
  selectedRangeLabel,
  clearRangeLabel,
  rangeInvalidHint,
  rangeMinNightsHint,
  legendPrice,
  guestCount,
  selectedRange,
  onRangeChange,
  availability: availabilityProp,
}: AvailabilityCalendarProps) {
  const [fetchedData, setFetchedData] = useState<AvailabilityResponse | null>(
    null,
  );
  const data =
    availabilityProp !== undefined ? availabilityProp : fetchedData;
  const [monthOffset, setMonthOffset] = useState(0);
  const [pendingStart, setPendingStart] = useState<string | null>(null);
  const [hoverDay, setHoverDay] = useState<string | null>(null);
  const [invalidFlash, setInvalidFlash] = useState<"overlap" | "minNights" | null>(
    null,
  );

  const previewRange = useMemo((): DateRange | null => {
    if (!pendingStart || selectedRange || !hoverDay || hoverDay === pendingStart) {
      return null;
    }
    let checkIn = pendingStart;
    let checkOut = hoverDay;
    if (checkOut < checkIn) {
      [checkIn, checkOut] = [checkOut, checkIn];
    }
    return { checkIn, checkOut };
  }, [pendingStart, hoverDay, selectedRange]);

  useEffect(() => {
    if (availabilityProp !== undefined) return;
    fetch("/api/availability", { cache: "no-store" })
      .then((res) => res.json())
      .then(setFetchedData)
      .catch(() =>
        setFetchedData({
          occupied: [],
          accepted: [],
          syncedAt: new Date().toISOString(),
          configured: false,
        }),
      );
  }, [availabilityProp]);

  const occupiedSet = useMemo(
    () => new Set(data?.occupied ?? []),
    [data?.occupied],
  );

  const acceptedSet = useMemo(
    () => new Set(data?.accepted ?? []),
    [data?.accepted],
  );

  const blockedSet = useMemo(() => {
    const merged = new Set(occupiedSet);
    for (const day of acceptedSet) merged.add(day);
    return merged;
  }, [occupiedSet, acceptedSet]);

  const pricesByNight = useMemo(
    () => pickPricesForGuestCount(data?.pricesByNight ?? {}, guestCount),
    [data?.pricesByNight, guestCount],
  );

  const monthDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const days = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startPad = (firstDay.getDay() + 6) % 7;
    const cells: {
      key: string;
      day?: number;
      occupied?: boolean;
      accepted?: boolean;
      price?: number;
    }[] = [];

    for (let i = 0; i < startPad; i++) cells.push({ key: `pad-${i}` });

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const occupied = occupiedSet.has(key);
      const accepted = !occupied && acceptedSet.has(key);
      const price = pricesByNight[key];
      cells.push({
        key,
        day,
        occupied,
        accepted,
        price: typeof price === "number" ? price : undefined,
      });
    }

    return cells;
  }, [monthDate, occupiedSet, acceptedSet, pricesByNight]);

  function handleDayClick(key: string, blocked: boolean) {
    if (blocked) return;

    if (!pendingStart || selectedRange) {
      setPendingStart(key);
      setHoverDay(null);
      onRangeChange(null);
      return;
    }

    let checkIn = pendingStart;
    let checkOut = key;
    if (checkOut < checkIn) {
      [checkIn, checkOut] = [checkOut, checkIn];
    }

    if (!meetsMinimumStay(checkIn, checkOut)) {
      setInvalidFlash("minNights");
      setPendingStart(key);
      onRangeChange(null);
      window.setTimeout(() => setInvalidFlash(null), 3500);
      return;
    }

    if (!isRangeAvailable(checkIn, checkOut, blockedSet)) {
      setInvalidFlash("overlap");
      setPendingStart(key);
      onRangeChange(null);
      window.setTimeout(() => setInvalidFlash(null), 2500);
      return;
    }

    setInvalidFlash(null);
    setPendingStart(null);
    setHoverDay(null);
    onRangeChange({ checkIn, checkOut });
    document.getElementById("reservation-form")?.scrollIntoView({ behavior: "smooth" });
  }

  function dayClasses(
    key: string,
    occupied: boolean,
    accepted: boolean,
  ): string {
    const inRange = isDayInRange(key, selectedRange);
    const isPending = pendingStart === key;

    if (occupied) {
      return "bg-rose-200 text-rose-900 cursor-not-allowed";
    }
    if (accepted) {
      return "bg-orange-200 text-orange-950 cursor-not-allowed ring-1 ring-orange-300";
    }
    if (inRange === "start" || inRange === "end") {
      return "bg-sky-600 text-white ring-2 ring-sky-800";
    }
    if (inRange === "middle") {
      return "bg-sky-200 text-sky-950";
    }
    if (isPending) {
      return "bg-sky-500 text-white ring-2 ring-sky-700";
    }
    if (previewRange) {
      const inPreview = isDayInRange(key, previewRange);
      if (inPreview === "middle") {
        return "bg-sky-100 text-sky-900 cursor-pointer";
      }
      if (inPreview === "end" && key === hoverDay) {
        return "bg-sky-400 text-white ring-2 ring-sky-500 cursor-pointer";
      }
      if (inPreview === "start" && key === hoverDay) {
        return "bg-sky-400 text-white ring-2 ring-sky-500 cursor-pointer";
      }
    }
    return "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 cursor-pointer";
  }

  return (
    <div
      id="availability-calendar"
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMonthOffset((m) => m - 1);
              setHoverDay(null);
            }}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
            aria-label={locale === "fr" ? "Mois précédent" : "Previous month"}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              setMonthOffset((m) => m + 1);
              setHoverDay(null);
            }}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
            aria-label={locale === "fr" ? "Mois suivant" : "Next month"}
          >
            →
          </button>
        </div>
      </div>

      <p className="mt-2 capitalize text-neutral-600">{monthLabel(monthDate, locale)}</p>
      <p className="mt-3 text-sm text-neutral-600">{selectHint}</p>

      {selectedRange ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <span>
            {selectedRangeLabel}{" "}
            <strong>{formatRangeLabel(selectedRange, locale)}</strong>
          </span>
          <button
            type="button"
            className="rounded-full border border-sky-300 px-3 py-1 text-xs hover:bg-white"
            onClick={() => {
              setPendingStart(null);
              setHoverDay(null);
              onRangeChange(null);
            }}
          >
            {clearRangeLabel}
          </button>
        </div>
      ) : null}

      {invalidFlash === "overlap" ? (
        <p className="mt-2 text-sm text-amber-800">{rangeInvalidHint}</p>
      ) : null}
      {invalidFlash === "minNights" ? (
        <p className="mt-2 text-sm text-amber-800">{rangeMinNightsHint}</p>
      ) : null}

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-medium text-neutral-500">
        {weekdayLabels[locale].map((label, index) => (
          <div key={`${label}-${index}`}>{label}</div>
        ))}
      </div>

      <div
        className="mt-2 grid grid-cols-7 gap-2"
        onMouseLeave={() => setHoverDay(null)}
      >
        {days.map((cell) =>
          cell.day ? (
            <button
              key={cell.key}
              type="button"
              disabled={cell.occupied || cell.accepted}
              onMouseEnter={() => {
                if (pendingStart && !selectedRange) {
                  setHoverDay(cell.key);
                }
              }}
              onClick={() =>
                handleDayClick(
                  cell.key,
                  Boolean(cell.occupied || cell.accepted),
                )
              }
              className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl text-sm font-medium transition ${dayClasses(cell.key, Boolean(cell.occupied), Boolean(cell.accepted))}`}
            >
              <span>{cell.day}</span>
              {cell.price != null ? (
                <span className="text-[10px] font-normal leading-none opacity-90">
                  {formatChfCompact(cell.price)}
                </span>
              ) : null}
            </button>
          ) : (
            <div key={cell.key} />
          ),
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          {legendFree}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          {legendBusy}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-400" />
          {legendAccepted}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sky-500" />
          {locale === "fr" ? "Votre séjour" : "Your stay"}
        </span>
        {legendPrice ? (
          <span className="text-neutral-500">{legendPrice}</span>
        ) : null}
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {data?.configured ? latencyNote : notConfiguredNote}
      </p>
    </div>
  );
}
