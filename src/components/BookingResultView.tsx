import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import type { PaidBookingReceipt } from "@/lib/paid-booking-receipt";
import PurchaseTracking from "./PurchaseTracking";

type BookingResultViewProps = {
  locale: Locale;
  variant: "success" | "cancel";
  receipt?: PaidBookingReceipt | null;
};

export default function BookingResultView({
  locale,
  variant,
  receipt = null,
}: BookingResultViewProps) {
  const { reservations } = getContent(locale);
  const homeHref = localePath(locale);
  const reservationsHref = localePath(locale, "/reservations");

  if (variant === "success") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center md:py-24">
        {receipt ? <PurchaseTracking receipt={receipt} /> : null}
        <h1 className="text-3xl font-semibold text-neutral-900">
          {reservations.paySuccessTitle}
        </h1>
        <p className="mt-4 text-lg text-neutral-700">
          {reservations.paySuccessBody}
        </p>
        {receipt ? (
          <dl className="mx-auto mt-8 max-w-sm space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-left text-sm text-neutral-800">
            <div>
              <dt className="text-neutral-500">{reservations.paySuccessTransaction}</dt>
              <dd
                id="transaction-id"
                data-transaction-id={receipt.transactionId}
                className="mt-0.5 break-all font-medium"
              >
                {receipt.transactionId}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">{reservations.paySuccessAmount}</dt>
              <dd
                id="conversion-value"
                data-conversion-value={receipt.valueFormatted}
                className="mt-0.5 font-medium"
              >
                {receipt.valueFormatted}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">{reservations.paySuccessCurrency}</dt>
              <dd id="currency-code" data-currency={receipt.currency} className="mt-0.5 font-medium">
                {receipt.currency}
              </dd>
            </div>
            {receipt.email ? (
              <div>
                <dt className="text-neutral-500">{reservations.paySuccessEmail}</dt>
                <dd id="customer-email" data-email={receipt.email} className="mt-0.5 font-medium">
                  {receipt.email}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
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
