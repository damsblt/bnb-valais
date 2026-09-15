import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: "Réservation appartement Valais — Disponibilités et tarifs | BnB Valais",
  description:
    "Réservez votre séjour au BnB Valais. Consultez les disponibilités et tarifs de notre appartement de vacances avec vue sur les Alpes. Réservation directe sans commission, minimum 2 nuits.",
  alternates: {
    canonical: `${BASE_URL}/reservations`,
    languages: {
      "fr-CH": `${BASE_URL}/reservations`,
      "en": `${BASE_URL}/en/reservations`,
    },
  },
  openGraph: {
    title: "Réservation appartement Valais — Disponibilités | BnB Valais",
    description:
      "Consultez les disponibilités et réservez directement votre séjour en Valais. Appartement 2 chambres vue Alpes, proche Sion et Anzère.",
    url: `${BASE_URL}/reservations`,
    locale: "fr_CH",
    type: "website",
  },
};

export default function ReservationsPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <ReservationsContent locale="fr" />
    </SiteLayout>
  );
}
