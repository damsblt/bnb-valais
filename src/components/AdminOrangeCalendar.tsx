"use client";

import { useCallback, useEffect, useState } from "react";
import type { AcceptedStay } from "@/lib/accepted-stays-store";
import type { SiteContent } from "@/lib/content";
import { formatRangeLabel } from "@/lib/typeform-prefill";

type AdminOrangeCalendarProps = {
  content: SiteContent["admin"];
  typeformConfigured: boolean;
};

export default function AdminOrangeCalendar({
  content,
  typeformConfigured,
}: AdminOrangeCalendarProps) {
  const [stays, setStays] = useState<AcceptedStay[]>([]);
  const [typeformResponseIds, setTypeformResponseIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [acceptedRes, responsesRes] = await Promise.all([
      fetch("/api/admin/accepted", { cache: "no-store" }),
      typeformConfigured
        ? fetch("/api/admin/responses", { cache: "no-store" })
        : Promise.resolve(null),
    ]);

    if (responsesRes?.ok) {
      const responsesData = (await responsesRes.json()) as {
        items?: { id: string }[];
      };
      setTypeformResponseIds(
        new Set((responsesData.items ?? []).map((item) => item.id)),
      );
    }

    if (!acceptedRes.ok) {
      setStays([]);
      setLoading(false);
      return;
    }
    const data = (await acceptedRes.json()) as { stays?: AcceptedStay[] };
    setStays(data.stays ?? []);
    setLoading(false);
  }, [typeformConfigured]);

  useEffect(() => {
    void load();
  }, [load]);

  async function release(stay: AcceptedStay) {
    setBusyId(stay.responseId);
    setNotice(null);
    const res = await fetch("/api/admin/release-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responseId: stay.responseId,
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setBusyId(null);
    if (!res.ok) {
      setNotice(data.error ?? "Erreur");
      return;
    }
    setNotice(content.releaseDatesSuccess);
    void load();
  }

  if (loading) {
    return (
      <p className="mt-8 text-sm text-neutral-600">{content.orangeCalendarLoading}</p>
    );
  }

  if (stays.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-orange-200 bg-orange-50/50 p-5">
      <h2 className="text-lg font-semibold text-orange-950">
        {content.orangeCalendarTitle}
      </h2>
      {notice ? (
        <p className="mt-3 rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-900">
          {notice}
        </p>
      ) : null}
      <ul className="mt-4 space-y-3">
        {stays.map((stay) => {
          const orphan = !typeformResponseIds.has(stay.responseId);
          return (
            <li
              key={`${stay.responseId}-${stay.checkIn}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium text-neutral-900">
                  {formatRangeLabel(
                    { checkIn: stay.checkIn, checkOut: stay.checkOut },
                    "fr",
                  )}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {stay.guestLabel ?? stay.responseId}
                  {orphan ? (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-amber-900">
                      {content.orangeCalendarOrphan}
                    </span>
                  ) : null}
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === stay.responseId}
                onClick={() => void release(stay)}
                className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-950 hover:bg-orange-100 disabled:opacity-50"
              >
                {content.releaseDatesButton}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
