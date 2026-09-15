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
      "en": `${BASE_URL}/en`,
    },
  },
  openGraph: {
    title: "BnB Valais — Holiday apartment rental Valais | Alps view accommodation",
    description:
      "Holiday apartment rental in Valais with panoramic Alps view. 2 bedrooms, sunny terrace, near Sion and Anzère. Ideal aparthotel for weekly stays.",
    url: `${BASE_URL}/en`,
    locale: "en_GB",
    type: "website",
  },
};

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
