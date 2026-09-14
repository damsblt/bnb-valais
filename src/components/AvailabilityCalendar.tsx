"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type AvailabilityCalendarProps = {
  locale: Locale;
  title: string;
  legendFree: string;
  legendBusy: string;
  latencyNote: string;
  notConfiguredNote: string;
};

type AvailabilityResponse = {
  occupied: string[];
  syncedAt: string;
  configured: boolean;
};

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
  latencyNote,
  notConfiguredNote,
}: AvailabilityCalendarProps) {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    fetch("/api/availability", { cache: "no-store" })
      .then((res) => res.json())
      .then(setData)
      .catch(() =>
        setData({ occupied: [], syncedAt: new Date().toISOString(), configured: false }),
      );
  }, []);

  const occupiedSet = useMemo(
    () => new Set(data?.occupied ?? []),
    [data?.occupied],
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
    const cells: { key: string; day?: number; occupied?: boolean }[] = [];

    for (let i = 0; i < startPad; i++) cells.push({ key: `pad-${i}` });

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ key, day, occupied: occupiedSet.has(key) });
    }

    return cells;
  }, [monthDate, occupiedSet]);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMonthOffset((m) => m - 1)}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
            aria-label={locale === "fr" ? "Mois précédent" : "Previous month"}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset((m) => m + 1)}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50"
            aria-label={locale === "fr" ? "Mois suivant" : "Next month"}
          >
            →
          </button>
        </div>
      </div>

      <p className="mt-2 capitalize text-neutral-600">{monthLabel(monthDate, locale)}</p>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-medium text-neutral-500">
        {weekdayLabels[locale].map((label, index) => (
          <div key={`${label}-${index}`}>{label}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((cell) =>
          cell.day ? (
            <div
              key={cell.key}
              className={`flex aspect-square items-center justify-center rounded-xl text-sm font-medium ${
                cell.occupied
                  ? "bg-rose-200 text-rose-900"
                  : "bg-emerald-100 text-emerald-900"
              }`}
            >
              {cell.day}
            </div>
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
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {data?.configured ? latencyNote : notConfiguredNote}
      </p>
    </div>
  );
}
