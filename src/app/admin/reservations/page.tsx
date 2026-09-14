import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin — Réservations — BnB Valais",
  robots: { index: false, follow: false },
};

export default function AdminReservationsPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <AdminShell content={getContent("fr").admin} section="reservations" />
    </SiteLayout>
  );
}
