import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

export default function EnglishReservationSuccessPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <BookingResultView locale="en" variant="success" />
    </SiteLayout>
  );
}
