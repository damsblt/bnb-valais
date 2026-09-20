import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getContent } from "@/lib/content";

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  title: getContent("en").meta.title,
  description: getContent("en").meta.description,
  alternates: {
    canonical: `${BASE_URL}/en`,
    languages: {
      "fr-CH": BASE_URL,
      en: `${BASE_URL}/en`,
    },
  },
  openGraph: {
    title: "BnB Valais — Holiday apartment Sion Anzère | Weekly rental Valais Switzerland",
    description:
      "Apartment to rent in Valais, 15 min from Sion and Anzère. Book by the night, week or month. 2 bedrooms, Alpine views, Wi-Fi, parking, lift.",
    url: `${BASE_URL}/en`,
    locale: "en_GB",
    type: "website",
  },
};

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
