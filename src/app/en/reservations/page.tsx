import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";
import { shareOgImage } from "@/lib/site";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: "Book accommodation Sion Anzère — Weekly rental Valais | BnB Valais",
  description:
    "Book your accommodation between Sion and Anzère. Apartment rental by the night, week or month in Valais. Check availability and rates. Alps view, ideal for skiing and hiking. Direct booking without commission.",
  alternates: {
    canonical: `${BASE_URL}/en/reservations`,
    languages: {
      "fr-CH": `${BASE_URL}/reservations`,
      en: `${BASE_URL}/en/reservations`,
    },
  },
  openGraph: {
    title: "Book accommodation Sion Anzère — Weekly rental Valais Switzerland",
    description:
      "Book your holiday rental between Sion and Anzère. 2-bedroom apartment with Alps view, by the night, week or month.",
    url: `${BASE_URL}/en/reservations`,
    locale: "en_GB",
    type: "website",
    images: [shareOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    images: [shareOgImage().url],
  },
};

export default function EnglishReservationsPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <ReservationsContent locale="en" />
    </SiteLayout>
  );
}
