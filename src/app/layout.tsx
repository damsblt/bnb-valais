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
    default: "BnB Valais — Location appartement vacances Sion Anzère | Hébergement semaine Valais",
    template: "%s | BnB Valais - Hébergement Valais",
  },
  description:
    "Location appartement vacances en Valais entre Sion et Anzère (15 min). Hébergement 2 chambres vue Alpes, location semaine ou week-end. Gîte idéal ski, randonnée. Apparthotel avec terrasse plein Sud. Réservation directe sans commission.",
  keywords: [
    // Marque
    "BnB Valais",
    "bnb valais",
    "Le Nid de la Sittelle",
    // Hébergement général
    "hébergement Valais",
    "hébergement vacances Valais",
    "hébergement montagne Suisse",
    "logement vacances Valais",
    "logement Valais",
    // Location appartement
    "location appartement Valais",
    "location appartement semaine Valais",
    "location appartement vacances Valais",
    "location appartement Sion",
    "location appartement Anzère",
    "appartement à louer Valais",
    "appartement meublé Valais",
    "appartement vacances Suisse",
    "appartement vue Alpes",
    "appartement montagne Valais",
    // Types d'hébergement
    "apparthotel Valais",
    "appart hôtel Valais",
    "bed and breakfast Valais",
    "chambre d'hôte Valais",
    "gîte Valais",
    "résidence de vacances Valais",
    // Location saisonnière
    "location saisonnière Valais",
    "location courte durée Valais",
    "location à la semaine Valais",
    "location weekend Valais",
    "location vacances Alpes suisses",
    "location vacances montagne Suisse",
    // Villes et régions
    "vacances Sion",
    "vacances Anzère",
    "séjour Sion",
    "séjour Anzère",
    "hébergement Sion",
    "hébergement Anzère",
    "dormir à Sion",
    "dormir à Anzère",
    "où dormir Valais",
    // Activités
    "hébergement ski Valais",
    "hébergement ski Anzère",
    "vacances ski Valais",
    "station ski Anzère hébergement",
    "randonnée Valais hébergement",
    // Séjours
    "séjour Valais",
    "weekend Valais",
    "vacances Valais",
    "vacances Suisse romande",
    "vacances en famille Valais",
    "séjour romantique Valais",
    // Tourisme
    "tourisme Valais",
    "visiter Valais hébergement",
    // English keywords
    "holiday apartment Valais",
    "vacation rental Valais Switzerland",
    "accommodation Valais Switzerland",
    "Valais holiday rental",
    "Anzère accommodation",
    "Sion holiday apartment",
    "Swiss Alps vacation rental",
    "weekly rental Valais",
    "ski accommodation Valais",
    "self-catering apartment Valais",
    "mountain apartment Switzerland",
    "Valais airbnb alternative",
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
    title: "BnB Valais — Location appartement vacances Sion Anzère | Hébergement semaine Valais",
    description:
      "Location appartement vacances au cœur du Valais, à 15 min de Sion et Anzère. Hébergement 2 chambres vue Alpes, location semaine ou week-end. Idéal ski et randonnée. Réservation directe.",
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
    title: "BnB Valais — Location appartement Sion Anzère | Hébergement Valais",
    description:
      "Location appartement vacances en Valais à 15 min de Sion et Anzère. Hébergement 2 chambres vue Alpes, location semaine. Idéal ski et randonnée.",
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
