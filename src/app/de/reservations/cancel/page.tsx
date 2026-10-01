import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Zahlung abgebrochen",
  robots: { index: false, follow: false },
};

export default function GermanReservationCancelPage() {
  return (
    <SiteLayout locale="de" variant="compact">
      <BookingResultView locale="de" variant="cancel" />
    </SiteLayout>
  );
}
