import type { Metadata } from "next";
import ReservationsContent from "@/components/ReservationsContent";
import SiteLayout from "@/components/SiteLayout";
import { shareOgImage } from "@/lib/site";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: "Réservation hébergement Sion Anzère — Location semaine Valais | BnB Valais",
  description:
    "Réservez votre hébergement entre Sion et Anzère. Location appartement à la nuit, à la semaine ou au mois en Valais. Consultez disponibilités et tarifs. Vue Alpes, idéal ski et randonnée. Réservation directe sans commission.",
  alternates: {
    canonical: `${BASE_URL}/reservations`,
    languages: {
      "fr-CH": `${BASE_URL}/reservations`,
      en: `${BASE_URL}/en/reservations`,
    },
  },
  openGraph: {
    title: "Réservation hébergement Sion Anzère — Location semaine Valais",
    description:
      "Réservez votre location de vacances entre Sion et Anzère. Appartement 2 chambres vue Alpes, à la nuit, à la semaine ou au mois.",
    url: `${BASE_URL}/reservations`,
    locale: "fr_CH",
    type: "website",
    images: [shareOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    images: [shareOgImage().url],
  },
};

export default function ReservationsPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <ReservationsContent locale="fr" />
    </SiteLayout>
  );
}
