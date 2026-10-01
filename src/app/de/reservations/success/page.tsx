import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Buchung bestätigt",
  robots: { index: false, follow: false },
};

export default function GermanReservationSuccessPage() {
  return (
    <SiteLayout locale="de" variant="compact">
      <BookingResultView locale="de" variant="success" />
    </SiteLayout>
  );
}
