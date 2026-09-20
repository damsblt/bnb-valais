import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import SiteLayout from "@/components/SiteLayout";
import { getCookiesCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const copy = getCookiesCopy("en");

export const metadata: Metadata = pageMetadata({
  locale: "en",
  frPath: "/cookies",
  enPath: "/cookies",
  title: "Cookies | BnB Valais",
  description:
    "Cookies used on bnb-valais.ch: essential cookies, Google Maps and the Typeform booking form.",
});

export default function CookiesEnPage() {
  return (
    <SiteLayout locale="en" variant="compact">
      <LegalArticle locale="en" copy={copy} related="privacy" />
    </SiteLayout>
  );
}
