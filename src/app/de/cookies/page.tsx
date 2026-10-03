import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";
import SiteLayout from "@/components/SiteLayout";
import { getCookiesCopy } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const copy = getCookiesCopy("de");

export const metadata: Metadata = pageMetadata({
  locale: "de",
  frPath: "/cookies",
  enPath: "/cookies",
  dePath: "/cookies",
  title: "Cookies | BnB Valais",
  description:
    "Cookies auf bnb-valais.ch: notwendige Cookies, Google Analytics, Google Maps und Zahlungen über Stripe.",
});

export default function CookiesDePage() {
  return (
    <SiteLayout locale="de" variant="compact">
      <LegalArticle locale="de" copy={copy} related="privacy" />
    </SiteLayout>
  );
}
