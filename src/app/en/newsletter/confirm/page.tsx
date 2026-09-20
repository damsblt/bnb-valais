import NewsletterConfirmView from "@/components/NewsletterConfirmView";
import SiteLayout from "@/components/SiteLayout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter confirmation — BnB Valais",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function NewsletterConfirmEnPage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;
  return (
    <SiteLayout locale="en" variant="compact">
      <NewsletterConfirmView locale="en" token={token} />
    </SiteLayout>
  );
}
