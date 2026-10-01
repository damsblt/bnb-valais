import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getContent } from "@/lib/content";
import { shareOgImage } from "@/lib/site";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: getContent("de").meta.title,
  description: getContent("de").meta.description,
  alternates: {
    canonical: `${BASE_URL}/de`,
    languages: {
      "fr-CH": BASE_URL,
      en: `${BASE_URL}/en`,
      "de-CH": `${BASE_URL}/de`,
    },
  },
  openGraph: {
    title: "BnB Valais — Ferienwohnung Sitten Anzère | Wochenmiete Wallis Schweiz",
    description:
      "Wohnung zur Miete im Wallis, 15 Min. von Sitten und Anzère. Buchung pro Nacht, Woche oder Monat. 2 Schlafzimmer, Alpenblick, WLAN, Parkplatz, Lift.",
    url: `${BASE_URL}/de`,
    locale: "de_CH",
    type: "website",
    images: [shareOgImage()],
  },
  twitter: {
    card: "summary_large_image",
    images: [shareOgImage().url],
  },
};

export default function GermanHomePage() {
  return <HomePage locale="de" />;
}
