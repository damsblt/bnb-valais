import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import SiteLayout from "@/components/SiteLayout";
import { getPrivacyCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const copy = getPrivacyCopy("fr");

export const metadata: Metadata = pageMetadata({
  locale: "fr",
  frPath: "/protection-des-donnees",
  enPath: "/privacy",
  title: `${copy.title} | BnB Valais`,
  description:
    "Protection des données et partage des informations sur bnb-valais.ch : réservations, newsletter, prestataires.",
});

export default function PrivacyFrPage() {
  return (
    <SiteLayout locale="fr" variant="compact">
      <LegalArticle locale="fr" copy={copy} related="cookies" />
    </SiteLayout>
  );
}
