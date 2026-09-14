import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type FooterProps = {
  locale: Locale;
};

export default function Footer({ locale }: FooterProps) {
  const { footer, newsletter } = getContent(locale);

  return (
    <footer className="mt-auto border-t border-neutral-200/80 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 md:px-10">
        <div>
          <p className="mb-4 text-lg font-medium text-neutral-800">
            {footer.contact}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="mailto:info@bnb-valais.ch"
              className="text-neutral-600 transition hover:text-sky-400"
            >
              info@bnb-valais.ch
            </Link>
            <Link
              href="tel:+41795200885"
              className="text-neutral-600 transition hover:text-sky-400"
            >
              +41 79 520 08 85
            </Link>
          </div>
        </div>

        <NewsletterSignup locale={locale} copy={newsletter} />

        <div className="text-sm text-neutral-600 md:text-right">
          <p>{footer.copyright}</p>
          <p className="mt-1">{footer.credits}</p>
        </div>
      </div>
    </footer>
  );
}
