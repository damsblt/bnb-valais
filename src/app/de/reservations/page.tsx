import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";
import { shareOgImage } from "@/lib/site";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: "Unterkunft Sitten Anzère buchen — Wochenmiete Wallis | BnB Valais",
  description:
    "Buchen Sie Ihre Unterkunft zwischen Sitten und Anzère. Wohnungsmiete pro Nacht, Woche oder Monat im Wallis. Verfügbarkeit und Tarife prüfen. Alpenblick, ideal für Ski und Wandern. Direktbuchung ohne Kommission.",
  alternates: {
    canonical: `${BASE_URL}/de/reservations`,
    languages: {
      "fr-CH": `${BASE_URL}/reservations`,
      en: `${BASE_URL}/en/reservations`,
      "de-CH": `${BASE_URL}/de/reservations`,
    },
  },
  openGraph: {
    title: "Unterkunft Sitten Anzère buchen — Wochenmiete Wallis",
    description:
      "Buchen Sie Ihre Ferienwohnung zwischen Sitten und Anzère. Wohnung mit 2 Schlafzimmern und Alpenblick, pro Nacht, Woche oder Monat.",
    url: `${BASE_URL}/de/reservations`,
    locale: "de_CH",
    type: "website",
    images: [shareOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    images: [shareOgImage().url],
  },
};

export default function GermanReservationsPage() {
  return (
    <SiteLayout locale="de" variant="compact">
      <ReservationsContent locale="de" />
    </SiteLayout>
  );
}
