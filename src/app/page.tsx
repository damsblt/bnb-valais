import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getContent } from "@/lib/content";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: getContent("fr").meta.title,
  description: getContent("fr").meta.description,
  alternates: {
    canonical: BASE_URL,
    languages: {
      "fr-CH": BASE_URL,
      "en": `${BASE_URL}/en`,
    },
  },
  openGraph: {
    title: "BnB Valais — Location appartement vacances Sion Anzère | Hébergement semaine Valais",
    description:
      "Location appartement vacances en Valais à 15 min de Sion et Anzère. Hébergement 2 chambres vue Alpes, location semaine ou week-end. Gîte idéal ski et randonnée.",
    url: BASE_URL,
    locale: "fr_CH",
    type: "website",
  },
};

export default function Page() {
  return <HomePage locale="fr" />;
}
