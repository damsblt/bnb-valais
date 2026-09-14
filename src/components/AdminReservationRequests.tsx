"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";
import type { ReservationRequest } from "@/lib/typeform";

type AdminReservationRequestsProps = {
  content: SiteContent["admin"];
  typeformConfigured: boolean;
  emailConfigured: boolean;
};

type HandledMap = Record<string, "accept" | "reject">;

export default function AdminReservationRequests({
  content,
  typeformConfigured,
  emailConfigured,
}: AdminReservationRequestsProps) {
  const [items, setItems] = useState<ReservationRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [handled, setHandled] = useState<HandledMap>({});
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/responses", { cache: "no-store" });
    const data = (await res.json()) as {
      items?: ReservationRequest[];
      error?: string;
    };
    if (!res.ok) {
      setError(data.error ?? "Impossible de charger Typeform.");
      setItems([]);
    } else {
      setItems(data.items ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeformConfigured) void load();
    else setLoading(false);
  }, [load, typeformConfigured]);

  async function respond(responseId: string, action: "accept" | "reject") {
    setBusyId(responseId);
    setNotice(null);
    const res = await fetch("/api/admin/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responseId, action }),
    });
    const data = (await res.json()) as {
      mailto?: string;
      emailSent?: boolean;
      emailError?: string;
      error?: string;
    };
    setBusyId(null);

    if (!res.ok) {
      setNotice(data.error ?? content.noEmailError);
      return;
    }

    setHandled((prev) => ({ ...prev, [responseId]: action }));

    if (data.emailSent) {
      setNotice(content.emailSent);
    } else if (data.mailto) {
      window.location.href = data.mailto;
      setNotice(
        emailConfigured
          ? `Envoi auto impossible (${data.emailError ?? "erreur"}). ${content.openMailClient}.`
          : content.openMailClient,
      );
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("fr-CH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-neutral-900">{content.requestsTitle}</h2>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading || !typeformConfigured}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 disabled:opacity-50"
        >
          {content.requestsRefresh}
        </button>
      </div>

      {!typeformConfigured ? (
        <p className="mt-4 text-sm text-amber-800">
          Ajoutez <code className="text-xs">TYPEFORM_ACCESS_TOKEN</code> sur Vercel pour
          afficher les demandes ici.
        </p>
      ) : null}

      {loading ? <p className="mt-4 text-neutral-600">Chargement des demandes…</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      {notice ? (
        <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>
      ) : null}

      {!loading && !error && typeformConfigured && items.length === 0 ? (
        <p className="mt-4 text-neutral-600">{content.requestsEmpty}</p>
      ) : null}

      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const status = handled[item.id];
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-neutral-900">
                    {item.guestName ?? item.guestEmail ?? "Demande sans nom"}
                  </p>
                  <p className="text-sm text-neutral-600">{item.summaryLine}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Reçue le {formatDate(item.submittedAt)}
                  </p>
                </div>
                {status ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      status === "accept"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {status === "accept" ? "Acceptée" : "Refusée"}
                  </span>
                ) : null}
              </div>

              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                {item.answers.map((a) => (
                  <div key={`${item.id}-${a.label}`}>
                    <dt className="text-neutral-500">{a.label}</dt>
                    <dd className="text-neutral-900">{a.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busyId === item.id || !item.guestEmail}
                  onClick={() => void respond(item.id, "accept")}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {content.acceptButton}
                </button>
                <button
                  type="button"
                  disabled={busyId === item.id || !item.guestEmail}
                  onClick={() => void respond(item.id, "reject")}
                  className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-100 disabled:opacity-50"
                >
                  {content.rejectButton}
                </button>
              </div>
              {!item.guestEmail ? (
                <p className="mt-2 text-xs text-amber-700">{content.noEmailError}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
