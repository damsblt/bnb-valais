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
    title: "BnB Valais — Location appartement vacances Valais | Hébergement vue Alpes",
    description:
      "Location appartement vacances en Valais avec vue panoramique sur les Alpes. 2 chambres, terrasse ensoleillée, proche Sion et Anzère. Apparthotel idéal pour séjour semaine.",
    url: BASE_URL,
    locale: "fr_CH",
    type: "website",
  },
};

export default function Page() {
  return <HomePage locale="fr" />;
}
