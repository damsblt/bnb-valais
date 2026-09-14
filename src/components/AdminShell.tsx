"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout, { type AdminSection } from "@/components/AdminLayout";
import AdminPromoCodes from "@/components/AdminPromoCodes";
import AdminReservationsDashboard from "@/components/AdminReservationsDashboard";
import type { SiteContent } from "@/lib/content";

type AdminShellProps = {
  content: SiteContent["admin"];
  section: AdminSection;
};

type AdminMeta = {
  authenticated: boolean;
  passwordConfigured: boolean;
  typeformConfigured: boolean;
  emailConfigured: boolean;
  calendarStorageConfigured: boolean;
};

export default function AdminShell({ content, section }: AdminShellProps) {
  const [meta, setMeta] = useState<AdminMeta | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMeta = useCallback(async () => {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    const data = (await res.json()) as AdminMeta;
    setMeta(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshMeta();
  }, [refreshMeta]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Mot de passe incorrect.");
      return;
    }
    setPassword("");
    await refreshMeta();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    await refreshMeta();
  }

  if (loading || !meta) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-neutral-600">
        Chargement…
      </div>
    );
  }

  if (!meta.passwordConfigured) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-12">
        <h1 className="text-3xl font-semibold text-neutral-900">{content.title}</h1>
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          {content.setupMissing}
        </p>
      </div>
    );
  }

  if (!meta.authenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 md:px-12">
        <h1 className="text-2xl font-semibold text-neutral-900">{content.loginTitle}</h1>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            placeholder="Mot de passe"
            required
          />
          {loginError ? (
            <p className="text-sm text-rose-600">{loginError}</p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-neutral-900 py-3 font-medium text-white hover:bg-neutral-800"
          >
            {content.loginButton}
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminLayout content={content} section={section} onLogout={handleLogout}>
      {section === "promo" ? (
        <AdminPromoCodes content={content} />
      ) : (
        <AdminReservationsDashboard
          content={content}
          typeformConfigured={meta.typeformConfigured}
          emailConfigured={meta.emailConfigured}
          calendarStorageConfigured={meta.calendarStorageConfigured}
        />
      )}
    </AdminLayout>
  );
}
