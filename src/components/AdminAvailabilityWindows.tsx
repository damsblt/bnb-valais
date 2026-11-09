"use client";

import { useCallback, useEffect, useState } from "react";
import type { AvailabilityWindow } from "@/lib/availability-windows";
import type { SiteContent } from "@/lib/content";

type SeededOpen = { from: string; to: string };

type AdminAvailabilityWindowsProps = {
  content: SiteContent["admin"];
};

export default function AdminAvailabilityWindows({
  content,
}: AdminAvailabilityWindowsProps) {
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [seeded, setSeeded] = useState<SeededOpen[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/availability-windows", { cache: "no-store" });
      if (res.status === 401) {
        setError(content.promoUnauthorized);
        return;
      }
      const data = (await res.json()) as {
        windows?: AvailabilityWindow[];
        seededOpens?: SeededOpen[];
        storageConfigured?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? content.availabilityError);
        return;
      }
      setWindows(data.windows ?? []);
      setSeeded(data.seededOpens ?? []);
      setStorageConfigured(data.storageConfigured !== false);
    } catch {
      setError(content.availabilityError);
    } finally {
      setLoading(false);
    }
  }, [content.availabilityError, content.promoUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(status: "open" | "closed") {
    setMessage(null);
    setError(null);
    if (!from || !to || from > to) {
      setError(content.availabilityInvalid);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/availability-windows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, status }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? content.availabilityError);
        return;
      }
      setFrom("");
      setTo("");
      setMessage(content.availabilitySaved);
      await load();
    } catch {
      setError(content.availabilityError);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm(content.availabilityDeleteConfirm)) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/availability-windows", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setError(content.availabilityError);
        return;
      }
      setMessage(content.availabilitySaved);
      await load();
    } catch {
      setError(content.availabilityError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <p className="text-sm leading-relaxed text-neutral-600">{content.availabilityHint}</p>

      {!storageConfigured ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {content.promoStorageInactive}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-neutral-500">{content.availabilityLoading}</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-neutral-700">
          {content.availabilityFrom}
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-neutral-700">
          {content.availabilityTo}
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => void add("open")}
          className="rounded-full bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          {content.availabilityOpen}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => void add("closed")}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {content.availabilityClose}
        </button>
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-900">
        {content.availabilityManualTitle}
      </h2>
      {!loading && windows.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">{content.availabilityEmpty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {windows.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"
            >
              <p className="text-sm text-neutral-800">
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.status === "open"
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  {item.status === "open"
                    ? content.availabilityOpenBadge
                    : content.availabilityClosedBadge}
                </span>
                {item.from} → {item.to}
              </p>
              <button
                type="button"
                disabled={saving}
                onClick={() => void remove(item.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {content.availabilityDelete}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-sm font-semibold text-neutral-900">
        {content.availabilitySeededTitle}
      </h2>
      <ul className="mt-3 space-y-2">
        {seeded.map((item) => (
          <li
            key={`${item.from}-${item.to}`}
            className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
          >
            <span className="mr-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">
              {content.availabilitySeededBadge}
            </span>
            {item.from} → {item.to}
          </li>
        ))}
      </ul>
    </section>
  );
}
