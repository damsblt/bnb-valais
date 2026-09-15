import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: "Réservation hébergement Sion Anzère — Location semaine Valais | BnB Valais",
  description:
    "Réservez votre hébergement entre Sion et Anzère. Location appartement semaine ou week-end en Valais. Consultez disponibilités et tarifs. Vue Alpes, idéal ski et randonnée. Réservation directe sans commission.",
  alternates: {
    canonical: `${BASE_URL}/reservations`,
    languages: {
      "fr-CH": `${BASE_URL}/reservations`,
      "en": `${BASE_URL}/en/reservations`,
    },
  },
  openGraph: {
    title: "Réservation hébergement Sion Anzère — Location semaine Valais",
    description:
      "Réservez votre location de vacances entre Sion et Anzère. Appartement 2 chambres vue Alpes, location semaine ou week-end. Hébergement idéal ski et randonnée.",
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
