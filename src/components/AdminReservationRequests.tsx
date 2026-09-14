"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";
import type { ReservationRequest } from "@/lib/typeform";

type AdminReservationRequestsProps = {
  content: SiteContent["admin"];
  typeformConfigured: boolean;
  emailConfigured: boolean;
};

type HandledEntry = {
  action: "accept" | "reject";
  decidedAt: string;
};

type HandledMap = Record<string, HandledEntry>;

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
  const [noticeKind, setNoticeKind] = useState<"success" | "warning" | "error">(
    "success",
  );
  const [mailFallbackHref, setMailFallbackHref] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/responses", { cache: "no-store" });
    const data = (await res.json()) as {
      items?: ReservationRequest[];
      error?: string;
      forms?: { id: string; title: string }[];
    };
    if (!res.ok) {
      let msg = data.error ?? "Impossible de charger Typeform.";
      if (data.forms?.length) {
        msg += ` IDs API possibles : ${data.forms.map((f) => `${f.title} (${f.id})`).join(" · ")}`;
      }
      setError(msg);
      setItems([]);
    } else {
      setItems(data.items ?? []);
    }
    setLoading(false);
  }, []);

  const loadAdminState = useCallback(async () => {
    const res = await fetch("/api/admin/accepted", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as {
      decisions?: { responseId: string; action: "accept" | "reject"; decidedAt: string }[];
    };
    const map: HandledMap = {};
    for (const decision of data.decisions ?? []) {
      map[decision.responseId] = {
        action: decision.action,
        decidedAt: decision.decidedAt,
      };
    }
    setHandled(map);
  }, []);

  useEffect(() => {
    if (typeformConfigured) {
      void load();
      void loadAdminState();
    } else setLoading(false);
  }, [load, loadAdminState, typeformConfigured]);

  async function respond(responseId: string, action: "accept" | "reject") {
    setBusyId(responseId);
    setNotice(null);
    setMailFallbackHref(null);
    const res = await fetch("/api/admin/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responseId, action }),
    });
    const data = (await res.json()) as {
      mailto?: string;
      emailSent?: boolean;
      emailError?: string;
      calendarUpdated?: boolean;
      calendarError?: string;
      calendarWarning?: string;
      stateSaved?: boolean;
      stateError?: string;
      error?: string;
    };
    setBusyId(null);

    if (!res.ok) {
      setNoticeKind("error");
      setNotice(data.error ?? content.noEmailError);
      return;
    }

    if (data.stateSaved) {
      setHandled((prev) => ({
        ...prev,
        [responseId]: {
          action,
          decidedAt: new Date().toISOString(),
        },
      }));
      void loadAdminState();
    }

    const calendarNote =
      action === "accept" && data.calendarUpdated
        ? ` ${content.calendarMarkedOnAccept}`
        : data.calendarWarning
          ? ` ${data.calendarWarning}`
          : data.stateError
            ? ` ${data.stateError}`
            : data.calendarError
              ? ` ${data.calendarError}`
              : "";

    if (data.emailSent) {
      setNoticeKind("success");
      setNotice(`${content.emailSent}${calendarNote}`);
    } else if (data.mailto) {
      setMailFallbackHref(data.mailto);
      if (emailConfigured) {
        setNoticeKind("warning");
        const detail = formatResendError(data.emailError);
        setNotice(
          `${detail ? `${content.emailAutoFailed} (${detail})` : content.emailAutoFailed}${calendarNote}`,
        );
      } else {
        setNoticeKind("warning");
        setNotice(`${content.openMailClient}${calendarNote}`);
        window.location.href = data.mailto;
      }
    } else if (calendarNote.trim()) {
      setNoticeKind(data.calendarError ? "warning" : "success");
      setNotice(calendarNote.trim());
    }
  }

  function formatResendError(raw?: string): string | null {
    if (!raw?.trim()) return null;
    try {
      const parsed = JSON.parse(raw) as { message?: string };
      if (parsed.message) return parsed.message;
    } catch {
      /* plain text */
    }
    return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
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
          onClick={() => {
            void load();
            void loadAdminState();
          }}
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
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            noticeKind === "success"
              ? "bg-emerald-50 text-emerald-900"
              : noticeKind === "warning"
                ? "bg-amber-50 text-amber-950"
                : "bg-rose-50 text-rose-900"
          }`}
        >
          <p>{notice}</p>
          {mailFallbackHref ? (
            <a
              href={mailFallbackHref}
              className="mt-2 inline-block font-medium underline"
            >
              {content.openMailFallback}
            </a>
          ) : null}
        </div>
      ) : null}

      {!loading && !error && typeformConfigured && items.length === 0 ? (
        <p className="mt-4 text-neutral-600">{content.requestsEmpty}</p>
      ) : null}

      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const status = handled[item.id];
          const decidedLabel = status
            ? formatDate(status.decidedAt)
            : null;
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
                  {item.stayDates ? (
                    <p className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-950">
                      Séjour : {item.summaryLine}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-amber-800">
                      Dates du calendrier non enregistrées sur cette demande (test
                      ancien ou sans sélection sur le site).
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    Reçue le {formatDate(item.submittedAt)}
                  </p>
                </div>
                {status ? (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      status.action === "accept"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {status.action === "accept" ? "Acceptée" : "Refusée"}
                    {decidedLabel ? ` · ${decidedLabel}` : null}
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
                  disabled={
                    busyId === item.id || !item.guestEmail || Boolean(status)
                  }
                  onClick={() => void respond(item.id, "accept")}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {content.acceptButton}
                </button>
                <button
                  type="button"
                  disabled={
                    busyId === item.id || !item.guestEmail || Boolean(status)
                  }
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
