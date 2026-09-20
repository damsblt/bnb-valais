import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import SiteLayout from "@/components/SiteLayout";
import { getCookiesCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const copy = getCookiesCopy("fr");

export const metadata: Metadata = pageMetadata({
  locale: "fr",
  frPath: "/cookies",
  enPath: "/cookies",
  title: "Cookies | BnB Valais",
  description:
    "Cookies utilisés sur bnb-valais.ch : cookies nécessaires, Google Maps et formulaire Typeform.",
});

export default function CookiesFrPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <LegalArticle locale="fr" copy={copy} related="privacy" />
    </SiteLayout>
  );
}
