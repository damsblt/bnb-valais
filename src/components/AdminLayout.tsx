"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/content";

export type AdminSection = "reservations" | "promo" | "pricing";

type AdminLayoutProps = {
  content: SiteContent["admin"];
  section: AdminSection;
  onLogout: () => void;
  children: React.ReactNode;
};

export default function AdminLayout({
  content,
  section,
  onLogout,
  children,
}: AdminLayoutProps) {
  const title =
    section === "promo"
      ? content.promoPageTitle
      : section === "pricing"
        ? content.pricingPageTitle
        : content.reservationsPageTitle;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-12 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          {content.logoutButton}
        </button>
      </div>

      <nav
        className="mt-8 flex gap-2 border-b border-neutral-200 pb-3"
        aria-label="Admin"
      >
        <Link
          href="/admin/reservations"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            section === "reservations"
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {content.navReservations}
        </Link>
        <Link
          href="/admin/promo"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            section === "promo"
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {content.navPromo}
        </Link>
        <Link
          href="/admin/pricing"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            section === "pricing"
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          {content.navPricing}
        </Link>
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
