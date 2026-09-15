import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { JsonLdOrganization, JsonLdWebSite } from "@/components/JsonLd";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

const BASE_URL = "https://www.bnb-valais.ch";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BnB Valais — Location appartement vacances Valais | Hébergement vue Alpes",
    template: "%s | BnB Valais",
  },
  description:
    "Location appartement vacances en Valais, Suisse. Hébergement 2 chambres avec vue panoramique sur les Alpes, proche Sion et Anzère. Apparthotel idéal pour séjour semaine ou week-end. Réservation directe sans commission.",
  keywords: [
    "BnB Valais",
    "bnb valais",
    "hébergement Valais",
    "location appartement Valais",
    "location appartement semaine Valais",
    "apparthotel Valais",
    "appartement vacances Suisse",
    "bed and breakfast Valais",
    "location vacances Alpes",
    "hébergement montagne Suisse",
    "appartement vue Alpes",
    "location Sion",
    "hébergement Anzère",
    "séjour Valais",
    "weekend Valais",
    "vacances Suisse romande",
    "Le Nid de la Sittelle",
    "holiday apartment Valais",
    "accommodation Valais Switzerland",
  ],
  authors: [{ name: "BnB Valais" }],
  creator: "BnB Valais",
  publisher: "BnB Valais",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logo_Carte-visite-copie.svg",
    apple: "/images/logo_Carte-visite-copie.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    alternateLocale: "en_GB",
    url: BASE_URL,
    siteName: "BnB Valais",
    title: "BnB Valais — Location appartement vacances Valais | Vue panoramique Alpes",
    description:
      "Découvrez notre appartement de vacances au cœur du Valais avec vue imprenable sur les Alpes. 2 chambres, terrasse ensoleillée, proche Sion et Anzère. Réservation directe.",
    images: [
      {
        url: "/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png",
        width: 316,
        height: 120,
        alt: "BnB Valais - Location appartement vacances en Valais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BnB Valais — Appartement vacances vue Alpes",
    description:
      "Location appartement 2 chambres en Valais avec vue panoramique sur les Alpes. Proche Sion et Anzère.",
    images: ["/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "fr-CH": BASE_URL,
      "en": `${BASE_URL}/en`,
    },
  },
  category: "travel",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${roboto.variable} h-full`}>
      <head>
        <JsonLdOrganization />
        <JsonLdWebSite />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans text-neutral-800 antialiased">
        {children}
      </body>
    </html>
  );
}
