"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GUEST_COUNTS,
  type GuestCount,
  type GuestNightPrices,
  type PricesByNightAndGuests,
} from "@/lib/night-pricing";
import type { SiteContent } from "@/lib/content";
import { todayIsoDate } from "@/lib/typeform-prefill";

type AdminPriceCalendarProps = {
  content: SiteContent["admin"];
};

const weekdayLabels = ["L", "M", "M", "J", "V", "S", "D"];

function emptyDraft(): Record<GuestCount, string> {
  return { 1: "", 2: "", 3: "", 4: "" };
}

export default function AdminPriceCalendar({ content }: AdminPriceCalendarProps) {
  const today = todayIsoDate();
  const [monthOffset, setMonthOffset] = useState(0);
  const [pricesByNight, setPricesByNight] = useState<PricesByNightAndGuests>({});
  const [guestCount, setGuestCount] = useState<GuestCount>(2);
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const monthDate = useMemo(() => {
    const [year, month] = today.split("-").map(Number);
    return new Date(year, month - 1 + monthOffset, 1);
  }, [monthOffset, today]);

  const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/night-pricing/calendar?month=${monthKey}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        setError(content.pricingUnauthorized);
        return;
      }
      const data = (await res.json()) as {
        pricesByNight?: PricesByNightAndGuests;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? content.pricingLoadError);
        return;
      }
      setPricesByNight(data.pricesByNight ?? {});
    } catch {
      setError(content.pricingLoadError);
    } finally {
      setLoading(false);
    }
  }, [content.pricingLoadError, content.pricingUnauthorized, monthKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const days = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const pad = (first.getDay() + 6) % 7;
    const cells: { key: string; day?: number }[] = [];
    for (let i = 0; i < pad; i++) cells.push({ key: `pad-${i}` });
    for (let day = 1; day <= last.getDate(); day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ key, day });
    }
    return cells;
  }, [monthDate]);

  const selectedNights = useMemo(() => [...selected].sort(), [selected]);

  function fillDraft(night: string) {
    const prices = pricesByNight[night];
    if (!prices) {
      setDraft(emptyDraft());
      return;
    }
    setDraft({
      1: String(prices[1] ?? ""),
      2: String(prices[2] ?? ""),
      3: String(prices[3] ?? ""),
      4: String(prices[4] ?? ""),
    });
  }

  function toggleNight(night: string) {
    setMessage(null);
    setError(null);
    setSelected((current) => {
      if (current.includes(night)) return current.filter((day) => day !== night);
      if (current.length === 0) fillDraft(night);
      return [...current, night];
    });
  }

  async function save() {
    if (selectedNights.length === 0) return;
    const pricesByGuests = {} as GuestNightPrices;
    for (const guests of GUEST_COUNTS) {
      const value = Math.round(Number(draft[guests]));
      if (!Number.isFinite(value) || value < 1) {
        setError(content.pricingFormIncomplete);
        return;
      }
      pricesByGuests[guests] = value;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/night-pricing/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nights: selectedNights,
          pricesByGuests,
        }),
      });
      if (!res.ok) {
        setError(content.pricingSaveError);
        return;
      }
      setMessage(content.pricingSaveSuccess);
      setSelected([]);
      await load();
    } catch {
      setError(content.pricingSaveError);
    } finally {
      setSaving(false);
    }
  }

  const guestLabels: Record<GuestCount, string> = {
    1: content.pricingGuests1,
    2: content.pricingGuests2,
    3: content.pricingGuests3,
    4: content.pricingGuests4,
  };

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-900">Calendrier des tarifs</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Cliquez une case pour la sélectionner, et la même case pour la retirer.
        Les nuits choisies n’ont pas besoin de se suivre. Le montant enregistré
        remplace leur tarif, pour 1 à 4 personnes.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {GUEST_COUNTS.map((guests) => (
          <button
            key={guests}
            type="button"
            onClick={() => setGuestCount(guests)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              guestCount === guests
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 text-neutral-700"
            }`}
          >
            {guestLabels[guests]}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="capitalize text-neutral-800">
          {monthDate.toLocaleDateString("fr-CH", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMonthOffset((value) => value - 1)}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm"
            aria-label="Mois précédent"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setMonthOffset((value) => value + 1)}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm"
            aria-label="Mois suivant"
          >
            →
          </button>
        </div>
      </div>

      {loading ? <p className="mt-4 text-sm text-neutral-500">{content.pricingLoading}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-medium text-neutral-500">
        {weekdayLabels.map((label, index) => (
          <div key={`${label}-${index}`}>{label}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((cell) => {
          if (!cell.day) return <div key={cell.key} />;
          const price = pricesByNight[cell.key]?.[guestCount];
          const selectedNight = selected.includes(cell.key);
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => toggleNight(cell.key)}
              aria-pressed={selectedNight}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium ${
                selectedNight
                  ? "bg-sky-600 text-white"
                  : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              }`}
            >
              <span>{cell.day}</span>
              {price != null ? (
                <span className="text-[10px] font-normal leading-none opacity-90">{price}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedNights.length > 0 ? (
        <div className="mt-6 border-t border-neutral-200 pt-5">
          <p className="text-sm text-neutral-800">
            {selectedNights.length === 1
              ? selectedNights[0]
              : `${selectedNights.length} nuits : ${selectedNights.join(", ")}`}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {GUEST_COUNTS.map((guests) => (
              <label key={guests} className="block text-xs text-neutral-600">
                {guestLabels[guests]}
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={draft[guests]}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [guests]: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="mt-4 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {saving ? content.pricingSaving : "Enregistrer ces nuits"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
