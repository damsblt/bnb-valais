import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { confirmNewsletterSignup } from "@/lib/newsletter-confirm";

type NewsletterConfirmViewProps = {
  locale: Locale;
  token?: string;
};

export default async function NewsletterConfirmView({
  locale,
  token,
}: NewsletterConfirmViewProps) {
  const { newsletterConfirm } = getContent(locale);
  const homeHref = locale === "en" ? "/en" : "/";
  const result = await confirmNewsletterSignup(token);

  let title = newsletterConfirm.invalidTitle;
  let body = newsletterConfirm.invalidBody;

  if (result.status === "success") {
    title = newsletterConfirm.successTitle;
    body = newsletterConfirm.successBody;
  } else if (result.status === "already") {
    title = newsletterConfirm.alreadyTitle;
    body = newsletterConfirm.alreadyBody;
  } else if (result.status === "expired") {
    title = newsletterConfirm.expiredTitle;
    body = newsletterConfirm.expiredBody;
  } else if (result.status === "resend_error") {
    title = newsletterConfirm.errorTitle;
    body = newsletterConfirm.errorBody;
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
      <p className="mt-4 text-neutral-600">{body}</p>
      <Link
        href={homeHref}
        className="mt-8 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        {newsletterConfirm.backHome}
      </Link>
    </div>
  );
}
