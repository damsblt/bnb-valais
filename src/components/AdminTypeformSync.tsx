"use client";

import { useCallback, useEffect, useState } from "react";

type SyncState = {
  dateQuestions: number;
  guestQuestions?: number;
  hiddenConfigured: boolean;
  missingHidden?: string[];
} | null;

export default function AdminTypeformSync() {
  const [status, setStatus] = useState<SyncState>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/admin/typeform/status", { cache: "no-store" });
    if (res.ok) {
      setStatus((await res.json()) as SyncState);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function runSync() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/typeform/sync-form", { method: "POST" });
    const data = (await res.json()) as {
      ok?: boolean;
      detail?: string;
      dateQuestionsAfter?: number;
    };
    setMessage(data.detail ?? (res.ok ? "OK" : "Erreur"));
    setBusy(false);
    await loadStatus();
  }

  return (
    <section className="mt-10 rounded-xl border border-violet-200 bg-violet-50 p-6">
      <h2 className="font-semibold text-violet-950">Typeform</h2>
      {status ? (
        <div className="mt-2 space-y-1 text-sm text-violet-800">
          <p>
            {status.dateQuestions === 0
              ? "Aucune question date."
              : `${status.dateQuestions} question(s) date.`}
          </p>
          <p>
            {(status.guestQuestions ?? 0) === 0
              ? "Aucune question « nombre de personnes »."
              : `${status.guestQuestions} question(s) personnes (à retirer via sync).`}
          </p>
          <p>
            {status.hiddenConfigured
              ? "Champs hidden : OK"
              : `Champs hidden manquants : ${(status.missingHidden ?? []).join(", ") || "…"}`}
          </p>
        </div>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => void runSync()}
        className="mt-4 rounded-xl bg-violet-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-900 disabled:opacity-50"
      >
        {busy ? "Synchronisation…" : "Synchroniser le formulaire Typeform"}
      </button>
      {message ? (
        <p className="mt-3 text-sm text-violet-950">{message}</p>
      ) : null}
    </section>
  );
}
