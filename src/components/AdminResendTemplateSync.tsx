"use client";

import { useState } from "react";

export default function AdminResendTemplateSync() {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function runSync() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/admin/resend/sync-templates", {
      method: "POST",
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      aliases?: string[];
    };
    if (data.ok) {
      setMessage(
        `Templates publiés : ${(data.aliases ?? []).join(", ") || "OK"}`,
      );
    } else {
      setMessage(data.error ?? "Erreur de synchronisation");
    }
    setBusy(false);
  }

  return (
    <section className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-6">
      <h2 className="font-semibold text-sky-950">Templates e-mail (Resend)</h2>
      <p className="mt-2 text-sm text-sky-900">
        Met à jour les modèles acceptation / refus (Prénom, Nom de famille dans
        le récapitulatif).
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void runSync()}
        className="mt-4 rounded-xl bg-sky-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-900 disabled:opacity-50"
      >
        {busy ? "Publication…" : "Synchroniser les templates Resend"}
      </button>
      {message ? (
        <p className="mt-3 text-sm text-sky-950">{message}</p>
      ) : null}
    </section>
  );
}
