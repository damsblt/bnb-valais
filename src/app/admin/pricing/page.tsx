import type { Metadata } from "next";
import AdminShell from "@/components/AdminShell";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin — Tarifs — BnB Valais",
  robots: { index: false, follow: false },
};

export default function AdminPricingPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <AdminShell content={getContent("fr").admin} section="pricing" />
    </SiteLayout>
  );
}
