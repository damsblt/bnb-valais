import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin — BnB Valais",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <AdminDashboard content={getContent("fr").admin} />
    </SiteLayout>
  );
}
