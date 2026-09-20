import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import CookieBanner from "./CookieBanner";
import Footer from "./Footer";
import Header from "./Header";

type SiteLayoutProps = {
  locale: Locale;
  children: ReactNode;
  variant?: "hero" | "compact";
};

export default function SiteLayout({
  locale,
  children,
  variant = "hero",
}: SiteLayoutProps) {
  return (
    <>
      <Header locale={locale} variant={variant} />
      <main>{children}</main>
      <Footer locale={locale} />
      <CookieBanner locale={locale} />
    </>
  );
}
