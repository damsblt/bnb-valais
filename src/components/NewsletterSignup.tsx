"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type NewsletterSignupProps = {
  locale: Locale;
  copy: SiteContent["newsletter"];
};

export default function NewsletterSignup({ locale, copy }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale, consent }),
    });

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(copy.errorGeneric);
      return;
    }

    setStatus("sent");
    setEmail("");
    setConsent(false);
  }

  return (
    <div className="md:text-center">
      <p className="mb-3 text-lg font-medium text-neutral-800">{copy.title}</p>
      <p className="mb-4 text-sm text-neutral-600">{copy.description}</p>
      {status === "sent" ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {copy.successInbox}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3 md:mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm"
          />
          <label className="flex items-start gap-2 text-left text-xs text-neutral-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5"
            />
            <span>{copy.consentLabel}</span>
          </label>
          <button
            type="submit"
            disabled={status === "loading" || !consent}
            className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {status === "loading" ? copy.submitting : copy.submitButton}
          </button>
          {status === "error" && errorMsg ? (
            <p className="text-xs text-rose-600">{errorMsg}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
