"use client";

import AdminReservationRequests from "@/components/AdminReservationRequests";
import AdminTypeformSync from "@/components/AdminTypeformSync";
import { adminLinks } from "@/lib/admin";
import type { SiteContent } from "@/lib/content";

type AdminDashboardProps = {
  content: SiteContent["admin"];
  typeformConfigured: boolean;
  emailConfigured: boolean;
  calendarStorageConfigured: boolean;
  onLogout: () => void;
};

export default function AdminDashboard({
  content,
  typeformConfigured,
  emailConfigured,
  calendarStorageConfigured,
  onLogout,
}: AdminDashboardProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:px-12 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">{content.title}</h1>
          <p className="mt-3 text-lg text-neutral-600">{content.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          {content.logoutButton}
        </button>
      </div>

      <p
        className={`mt-6 rounded-xl border p-4 text-sm ${
          emailConfigured
            ? "border-emerald-200 bg-emerald-50 text-emerald-950"
            : "border-amber-200 bg-amber-50 text-amber-950"
        }`}
      >
        {emailConfigured ? content.emailAutoActive : content.emailAutoInactive}
      </p>

      <p
        className={`mt-4 rounded-xl border p-4 text-sm ${
          calendarStorageConfigured
            ? "border-orange-200 bg-orange-50 text-orange-950"
            : "border-amber-200 bg-amber-50 text-amber-950"
        }`}
      >
        {calendarStorageConfigured
          ? content.calendarStorageActive
          : content.calendarStorageInactive}
      </p>

      <AdminReservationRequests
        content={content}
        typeformConfigured={typeformConfigured}
        emailConfigured={emailConfigured}
      />

      {typeformConfigured ? <AdminTypeformSync /> : null}

      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-900">{content.checklistTitle}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-amber-950">
          {content.checklist.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">
          {content.linksTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={adminLinks.bookingCalendar}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl bg-[#003580] px-6 py-5 text-center font-medium text-white transition hover:bg-[#00224f]"
          >
            {content.bookingLabel}
          </a>
          <a
            href={adminLinks.airbnbCalendar}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl bg-[#FF5A5F] px-6 py-5 text-center font-medium text-white transition hover:bg-[#e0484d]"
          >
            {content.airbnbLabel}
          </a>
        </div>
      </div>

      <p className="mt-8 rounded-lg bg-neutral-100 p-4 text-sm text-neutral-600">
        {content.tip}
        {!emailConfigured ? (
          <>
            {" "}
            Sans <code className="text-xs">RESEND_API_KEY</code>, les boutons accepter/refuser
            ouvrent votre messagerie avec un e-mail pré-rempli.
          </>
        ) : null}
      </p>
    </div>
  );
}
