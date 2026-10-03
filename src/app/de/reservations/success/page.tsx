import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";
import { loadPaidBookingReceipt } from "@/lib/paid-booking-receipt";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buchung bestätigt",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function GermanReservationSuccessPage({
  searchParams,
}: PageProps) {
  const { session_id } = await searchParams;
  const receipt = await loadPaidBookingReceipt(session_id);

  return (
    <SiteLayout locale="de" variant="compact">
      <BookingResultView locale="de" variant="success" receipt={receipt} />
    </SiteLayout>
  );
}
