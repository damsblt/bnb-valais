"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatGuestPricesSummary,
  GUEST_COUNTS,
  type GuestCount,
  type GuestNightPrices,
  type NightPricingRule,
  type WeekdayIndex,
} from "@/lib/night-pricing";
import type { SiteContent } from "@/lib/content";

type AdminNightPricingProps = {
  content: SiteContent["admin"];
};

const ALL_WEEKDAYS: WeekdayIndex[] = [0, 1, 2, 3, 4, 5, 6];

function newRuleId(): string {
  return `rule_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emptyPriceDraft(): Record<GuestCount, string> {
  return { 1: "", 2: "", 3: "", 4: "" };
}

export default function AdminNightPricing({ content }: AdminNightPricingProps) {
  const [rules, setRules] = useState<NightPricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [prices, setPrices] = useState(emptyPriceDraft);
  const [weekdays, setWeekdays] = useState<Set<WeekdayIndex>>(
    () => new Set(ALL_WEEKDAYS),
  );

  const guestLabels = useMemo(
    () =>
      ({
        1: content.pricingGuests1,
        2: content.pricingGuests2,
        3: content.pricingGuests3,
        4: content.pricingGuests4,
      }) satisfies Record<GuestCount, string>,
    [content],
  );

  const weekdayOptions = useMemo(
    () => [
      { value: 0 as WeekdayIndex, label: content.pricingWeekdayMon },
      { value: 1 as WeekdayIndex, label: content.pricingWeekdayTue },
      { value: 2 as WeekdayIndex, label: content.pricingWeekdayWed },
      { value: 3 as WeekdayIndex, label: content.pricingWeekdayThu },
      { value: 4 as WeekdayIndex, label: content.pricingWeekdayFri },
      { value: 5 as WeekdayIndex, label: content.pricingWeekdaySat },
      { value: 6 as WeekdayIndex, label: content.pricingWeekdaySun },
    ],
    [content],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/night-pricing", { cache: "no-store" });
      if (res.status === 401) {
        setError(content.pricingUnauthorized);
        return;
      }
      const data = (await res.json()) as {
        rules?: NightPricingRule[];
        storageConfigured?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? content.pricingLoadError);
        return;
      }
      setRules(data.rules ?? []);
      setStorageConfigured(data.storageConfigured !== false);
    } catch {
      setError(content.pricingLoadError);
    } finally {
      setLoading(false);
    }
  }, [content.pricingLoadError, content.pricingUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = async (next: NightPricingRule[]) => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/night-pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        rules?: NightPricingRule[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? content.pricingSaveError);
        return;
      }
      setRules(data.rules ?? next);
      setMessage(content.pricingSaveSuccess);
    } catch {
      setError(content.pricingSaveError);
    } finally {
      setSaving(false);
    }
  };

  function toggleWeekday(day: WeekdayIndex) {
    setWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function parseDraftPrices(): GuestNightPrices | null {
    const out = {} as GuestNightPrices;
    for (const g of GUEST_COUNTS) {
      const v = Math.round(Number(prices[g]));
      if (!Number.isFinite(v) || v <= 0) return null;
      out[g] = v;
    }
    return out;
  }

  function addBatch() {
    const pricesByGuests = parseDraftPrices();
    if (!from || !to || from > to || !pricesByGuests) {
      setError(content.pricingFormIncomplete);
      return;
    }
    if (weekdays.size === 0) {
      setError(content.pricingWeekdaysRequired);
      return;
    }
    const rule: NightPricingRule = {
      id: newRuleId(),
      from,
      to,
      weekdays: [...weekdays].sort((a, b) => a - b),
      pricesByGuests,
      createdAt: new Date().toISOString(),
    };
    void persist([...rules, rule]);
    setFrom("");
    setTo("");
    setPrices(emptyPriceDraft());
    setWeekdays(new Set(ALL_WEEKDAYS));
  }

  function removeRule(id: string) {
    if (!window.confirm(content.pricingDeleteConfirm)) return;
    void persist(rules.filter((r) => r.id !== id));
  }

  async function importPilotageGrid() {
    if (!window.confirm(content.pricingImportPilotageConfirm)) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/night-pricing/import-pilotage", {
        method: "POST",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        rulesCount?: number;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? content.pricingSaveError);
        return;
      }
      setMessage(content.pricingImportPilotageSuccess);
      await load();
    } catch {
      setError(content.pricingSaveError);
    } finally {
      setSaving(false);
    }
  }

  function formatRuleWeekdays(rule: NightPricingRule): string {
    const labels = weekdayOptions
      .filter((w) => rule.weekdays.includes(w.value))
      .map((w) => w.label);
    return labels.join(", ");
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-neutral-600">{content.pricingImportPilotageHint}</p>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => void importPilotageGrid()}
          disabled={loading || saving || !storageConfigured}
          className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {saving ? content.pricingSaving : content.pricingImportPilotageButton}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading || saving}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          {content.pricingRefresh}
        </button>
      </div>

      {!storageConfigured ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {content.pricingStorageInactive}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-neutral-500">{content.pricingLoading}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

      <div className="mt-6 border-t border-neutral-200 pt-6">
        <h2 className="text-sm font-semibold text-neutral-900">
          {content.pricingAddTitle}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-neutral-600">
            {content.pricingFieldFrom}
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600">
            {content.pricingFieldTo}
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <p className="mt-4 text-xs font-medium text-neutral-600">
          {content.pricingFieldPriceByGuests}
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {GUEST_COUNTS.map((g) => (
            <label key={g} className="block text-xs text-neutral-600">
              {guestLabels[g]}
              <input
                type="number"
                min={1}
                step={1}
                value={prices[g]}
                onChange={(e) =>
                  setPrices((prev) => ({ ...prev, [g]: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                placeholder="150"
              />
            </label>
          ))}
        </div>
        <fieldset className="mt-4">
          <legend className="text-xs font-medium text-neutral-600">
            {content.pricingFieldWeekdays}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {weekdayOptions.map((w) => (
              <label
                key={w.value}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium ${
                  weekdays.has(w.value)
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={weekdays.has(w.value)}
                  onChange={() => toggleWeekday(w.value)}
                />
                {w.label}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={addBatch}
          disabled={saving}
          className="mt-4 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? content.pricingSaving : content.pricingAddButton}
        </button>
      </div>

      {!loading && rules.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">{content.pricingEmpty}</p>
      ) : null}

      <ul className="mt-6 space-y-3">
        {rules.map((rule) => (
          <li
            key={rule.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {rule.from} → {rule.to}
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                {formatGuestPricesSummary(rule.pricesByGuests, "fr")}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {formatRuleWeekdays(rule)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeRule(rule.id)}
              disabled={saving}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {content.pricingDelete}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
