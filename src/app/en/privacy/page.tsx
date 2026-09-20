import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import SiteLayout from "@/components/SiteLayout";
import { getPrivacyCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const copy = getPrivacyCopy("en");

export const metadata: Metadata = pageMetadata({
  locale: "en",
  frPath: "/protection-des-donnees",
  enPath: "/privacy",
  title: `${copy.title} | BnB Valais`,
  description:
    "Privacy and data sharing on bnb-valais.ch: bookings, newsletter and service providers.",
});

export default function PrivacyEnPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <LegalArticle locale="en" copy={copy} related="cookies" />
    </SiteLayout>
  );
}
