"use client";

import { useCallback, useEffect, useState } from "react";
import type { PromoCode } from "@/lib/promo-codes-store";
import type { SiteContent } from "@/lib/content";

type AdminPromoCodesProps = {
  content: SiteContent["admin"];
};

const emptyDraft = (): PromoCode => ({
  code: "",
  label: "",
  percentOff: 10,
  active: true,
  validStayFrom: "",
  validStayTo: "",
  maxUses: undefined,
  usedCount: 0,
});

export default function AdminPromoCodes({ content }: AdminPromoCodesProps) {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [draft, setDraft] = useState<PromoCode>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/promo-codes", { cache: "no-store" });
      if (res.status === 401) {
        setError(content.promoUnauthorized);
        return;
      }
      const data = (await res.json()) as {
        codes?: PromoCode[];
        storageConfigured?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? content.promoLoadError);
        return;
      }
      setCodes(data.codes ?? []);
      setStorageConfigured(data.storageConfigured !== false);
    } catch {
      setError(content.promoLoadError);
    } finally {
      setLoading(false);
    }
  }, [content.promoLoadError, content.promoUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = async (next: PromoCode[]) => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codes: next }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        codes?: PromoCode[];
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? content.promoSaveError);
        return;
      }
      setCodes(data.codes ?? next);
      setMessage(content.promoSaveSuccess);
    } catch {
      setError(content.promoSaveError);
    } finally {
      setSaving(false);
    }
  };

  const addDraft = () => {
    const code = draft.code.trim();
    if (!code || !draft.label.trim()) {
      setError(content.promoFormIncomplete);
      return;
    }
    if (codes.some((c) => c.code.toUpperCase() === code.toUpperCase())) {
      setError(content.promoDuplicate);
      return;
    }
    const next: PromoCode = {
      ...draft,
      code: code.toUpperCase().replace(/\s+/g, ""),
      label: draft.label.trim(),
      validStayFrom: draft.validStayFrom?.trim() || undefined,
      validStayTo: draft.validStayTo?.trim() || undefined,
      maxUses: draft.maxUses ? Number(draft.maxUses) : undefined,
      usedCount: draft.usedCount ?? 0,
    };
    void persist([...codes, next]);
    setDraft(emptyDraft());
  };

  const toggleActive = (index: number) => {
    const next = codes.map((c, i) =>
      i === index ? { ...c, active: !c.active } : c,
    );
    void persist(next);
  };

  const removeAt = (index: number) => {
    if (!window.confirm(content.promoDeleteConfirm)) return;
    void persist(codes.filter((_, i) => i !== index));
  };

  return (
    <section className="mt-10 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            {content.promoTitle}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">{content.promoHint}</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading || saving}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          {content.promoRefresh}
        </button>
      </div>

      {!storageConfigured ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {content.promoStorageInactive}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-neutral-500">{content.promoLoading}</p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : null}
      {message ? (
        <p className="mt-4 text-sm text-emerald-700">{message}</p>
      ) : null}

      {!loading && codes.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">{content.promoEmpty}</p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {codes.map((promo, index) => (
          <li
            key={promo.code}
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-neutral-900">
                  {promo.code}
                  {!promo.active ? (
                    <span className="ml-2 rounded bg-neutral-200 px-2 py-0.5 text-xs font-normal text-neutral-600">
                      {content.promoInactiveBadge}
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-sm text-neutral-700">{promo.label}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  −{promo.percentOff} %
                  {promo.validStayFrom || promo.validStayTo
                    ? ` · ${promo.validStayFrom ?? "…"} → ${promo.validStayTo ?? "…"}`
                    : ""}
                  {promo.maxUses != null
                    ? ` · ${promo.usedCount ?? 0}/${promo.maxUses} ${content.promoUsesLabel}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(index)}
                  disabled={saving}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-white disabled:opacity-50"
                >
                  {promo.active
                    ? content.promoDeactivate
                    : content.promoActivate}
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  disabled={saving}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {content.promoDelete}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-neutral-200 pt-6">
        <h3 className="text-sm font-semibold text-neutral-900">
          {content.promoAddTitle}
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-neutral-600">
            {content.promoFieldCode}
            <input
              value={draft.code}
              onChange={(e) =>
                setDraft((d) => ({ ...d, code: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm uppercase"
              placeholder="NOV2026-10"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600">
            {content.promoFieldLabel}
            <input
              value={draft.label}
              onChange={(e) =>
                setDraft((d) => ({ ...d, label: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600">
            {content.promoFieldPercent}
            <input
              type="number"
              min={1}
              max={100}
              value={draft.percentOff}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  percentOff: Number(e.target.value) || 0,
                }))
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600">
            {content.promoFieldMaxUses}
            <input
              type="number"
              min={1}
              value={draft.maxUses ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  maxUses: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              placeholder="—"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600">
            {content.promoFieldStayFrom}
            <input
              type="date"
              value={draft.validStayFrom ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, validStayFrom: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-neutral-600">
            {content.promoFieldStayTo}
            <input
              type="date"
              value={draft.validStayTo ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, validStayTo: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={addDraft}
          disabled={saving}
          className="mt-4 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {saving ? content.promoSaving : content.promoAddButton}
        </button>
      </div>
    </section>
  );
}
