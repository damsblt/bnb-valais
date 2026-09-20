import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getContent } from "@/lib/content";
import { shareOgImage } from "@/lib/site";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: getContent("fr").meta.title,
  description: getContent("fr").meta.description,
  alternates: {
    canonical: BASE_URL,
    languages: {
      "fr-CH": BASE_URL,
      en: `${BASE_URL}/en`,
    },
  },
  openGraph: {
    title: "BnB Valais — Location appartement vacances Sion Anzère | Hébergement semaine Valais",
    description:
      "Appartement à louer en Valais à 15 min de Sion et Anzère. Réservation à la nuit, à la semaine ou au mois. 2 chambres, vue Alpes, Wi-Fi, parking, ascenseur.",
    url: BASE_URL,
    locale: "fr_CH",
    type: "website",
    images: [shareOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    images: [shareOgImage().url],
  },
};

export default function Page() {
  return <HomePage locale="fr" />;
}
