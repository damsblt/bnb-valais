import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: `${getContent("en").reservations.title} — BnB Valais`,
  description: getContent("en").meta.description,
};

export default function EnglishReservationsPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <ReservationsContent locale="en" />
    </SiteLayout>
  );
}
