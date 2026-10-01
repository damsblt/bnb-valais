import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Réservation confirmée",
  robots: { index: false, follow: false },
};

export default function ReservationSuccessPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <BookingResultView locale="fr" variant="success" />
    </SiteLayout>
  );
}
