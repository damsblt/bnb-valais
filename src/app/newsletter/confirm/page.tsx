import NewsletterConfirmView from "@/components/NewsletterConfirmView";
import SiteLayout from "@/components/SiteLayout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmation newsletter — BnB Valais",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function NewsletterConfirmPage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  return (
    <SiteLayout locale="fr" variant="compact">
      <NewsletterConfirmView locale="fr" token={token} />
    </SiteLayout>
  );
}
