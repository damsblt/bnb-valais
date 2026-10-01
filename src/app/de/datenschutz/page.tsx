import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import SiteLayout from "@/components/SiteLayout";
import { getPrivacyCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const copy = getPrivacyCopy("de");

export const metadata: Metadata = pageMetadata({
  locale: "de",
  frPath: "/protection-des-donnees",
  enPath: "/privacy",
  dePath: "/datenschutz",
  title: `${copy.title} | BnB Valais`,
  description:
    "Datenschutz und Datenweitergabe auf bnb-valais.ch: Buchungen, Newsletter und Dienstleister.",
});

export default function PrivacyDePage() {
  return (
    <SiteLayout locale="de" variant="compact">
      <LegalArticle locale="de" copy={copy} related="cookies" />
    </SiteLayout>
  );
}
