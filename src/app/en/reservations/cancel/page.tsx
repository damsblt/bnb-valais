import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false, follow: false },
};

export default function EnglishReservationCancelPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <BookingResultView locale="en" variant="cancel" />
    </SiteLayout>
  );
}
