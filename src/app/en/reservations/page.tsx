import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: "Book apartment Valais — Availability and rates | BnB Valais",
  description:
    "Book your stay at BnB Valais. Check availability and rates for our holiday apartment with Alps view. Direct booking without commission, minimum 2 nights.",
  alternates: {
    canonical: `${BASE_URL}/en/reservations`,
    languages: {
      "fr-CH": `${BASE_URL}/reservations`,
      "en": `${BASE_URL}/en/reservations`,
    },
  },
  openGraph: {
    title: "Book apartment Valais — Availability | BnB Valais",
    description:
      "Check availability and book directly your stay in Valais. 2-bedroom apartment with Alps view, near Sion and Anzère.",
    url: `${BASE_URL}/en/reservations`,
    locale: "en_GB",
    type: "website",
  },
};

export default function EnglishReservationsPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <ReservationsContent locale="en" />
    </SiteLayout>
  );
}
