import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin — Ouverture — BnB Valais",
  robots: { index: false, follow: false },
};

export default function AdminAvailabilityPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <AdminShell content={getContent("fr").admin} section="availability" />
    </SiteLayout>
  );
}
