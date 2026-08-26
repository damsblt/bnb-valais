import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: `${getContent("fr").reservations.title} — BnB Valais`,
  description: getContent("fr").meta.description,
};

export default function ReservationsPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <ReservationsContent locale="fr" />
    </SiteLayout>
  );
}
