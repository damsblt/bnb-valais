import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Paiement annulé",
  robots: { index: false, follow: false },
};

export default function ReservationCancelPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <BookingResultView locale="fr" variant="cancel" />
    </SiteLayout>
  );
}
