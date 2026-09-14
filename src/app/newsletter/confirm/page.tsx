import NewsletterConfirmView from "@/components/NewsletterConfirmView";
import SiteLayout from "@/components/SiteLayout";

export const dynamic = "force-dynamic";

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
