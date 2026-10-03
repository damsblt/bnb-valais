import type { Metadata } from "next";
import BookingResultView from "@/components/BookingResultView";
import SiteLayout from "@/components/SiteLayout";
import { loadPaidBookingReceipt } from "@/lib/paid-booking-receipt";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réservation confirmée",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ReservationSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  const receipt = await loadPaidBookingReceipt(session_id);

  return (
    <SiteLayout locale="fr" variant="compact">
      <BookingResultView locale="fr" variant="success" receipt={receipt} />
    </SiteLayout>
  );
}
