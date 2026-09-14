import NewsletterConfirmView from "@/components/NewsletterConfirmView";
import SiteLayout from "@/components/SiteLayout";

export const dynamic = "force-dynamic";

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
