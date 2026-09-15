"use client";

import AdminOrangeCalendar from "@/components/AdminOrangeCalendar";
import AdminReservationRequests from "@/components/AdminReservationRequests";
import AdminResendTemplateSync from "@/components/AdminResendTemplateSync";
import AdminTypeformSync from "@/components/AdminTypeformSync";
import { adminLinks } from "@/lib/admin";
import type { SiteContent } from "@/lib/content";

type AdminReservationsDashboardProps = {
  content: SiteContent["admin"];
  typeformConfigured: boolean;
  emailConfigured: boolean;
  calendarStorageConfigured: boolean;
};

export default function AdminReservationsDashboard({
  content,
  typeformConfigured,
  emailConfigured,
  calendarStorageConfigured,
}: AdminReservationsDashboardProps) {
  return (
    <>
      <AdminReservationRequests
        content={content}
        typeformConfigured={typeformConfigured}
        emailConfigured={emailConfigured}
      />

      {calendarStorageConfigured ? (
        <AdminOrangeCalendar
          content={content}
          typeformConfigured={typeformConfigured}
        />
      ) : null}

      {typeformConfigured ? <AdminTypeformSync /> : null}
      {emailConfigured ? <AdminResendTemplateSync /> : null}

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
    </>
  );
}
