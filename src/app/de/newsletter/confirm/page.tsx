import NewsletterConfirmView from "@/components/NewsletterConfirmView";
import SiteLayout from "@/components/SiteLayout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter-Bestätigung — BnB Valais",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function NewsletterConfirmDePage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;
  return (
    <SiteLayout locale="de" variant="compact">
      <NewsletterConfirmView locale="de" token={token} />
    </SiteLayout>
  );
}
