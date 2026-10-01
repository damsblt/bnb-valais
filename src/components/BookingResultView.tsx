import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type BookingResultViewProps = {
  locale: Locale;
  variant: "success" | "cancel";
};

export default function BookingResultView({
  locale,
  variant,
}: BookingResultViewProps) {
  const { reservations } = getContent(locale);
  const homeHref = localePath(locale);
  const reservationsHref = localePath(locale, "/reservations");

  if (variant === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
        <h1 className="text-3xl font-semibold text-neutral-900">
          {reservations.paySuccessTitle}
        </h1>
        <p className="mt-4 text-lg text-neutral-700">
          {reservations.paySuccessBody}
        </p>
        <Link
          href={homeHref}
          className="mt-8 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          {reservations.paySuccessHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
      <h1 className="text-3xl font-semibold text-neutral-900">
        {reservations.payCancelTitle}
      </h1>
      <p className="mt-4 text-lg text-neutral-700">
        {reservations.payCancelBody}
      </p>
      <Link
        href={reservationsHref}
        className="mt-8 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        {reservations.payCancelRetry}
      </Link>
    </div>
  );
}
