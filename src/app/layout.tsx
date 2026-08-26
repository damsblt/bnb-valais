import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "BnB Valais",
  description: "Votre prochain séjour en Valais",
  icons: {
    icon: "/images/logo_Carte-visite-copie.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${roboto.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-neutral-800 antialiased">
        {children}
      </body>
    </html>
  );
}
