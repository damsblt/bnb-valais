import Script from "next/script";
import type { Locale } from "@/lib/i18n";
import { getContent, getPricing } from "@/lib/content";

type ReservationsContentProps = {
  locale: Locale;
};

export default function ReservationsContent({ locale }: ReservationsContentProps) {
  const content = getContent(locale);
  const { reservations } = content;
  const pricing = getPricing(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-16">
      <h1 className="text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
        {reservations.title}
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">
            {reservations.pricingTitle}
          </h2>
          <p className="mt-4 text-neutral-700">{reservations.pricingIntro}</p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <PricingBlock
              title={reservations.lowSeason}
              prices={pricing.lowSeason}
              locale={locale}
            />
            <PricingBlock
              title={reservations.highSeason}
              prices={pricing.highSeason}
              locale={locale}
            />
          </div>

          <div className="mt-8 space-y-2 text-neutral-700">
            {reservations.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">
            {reservations.formTitle}
          </h2>
          <p className="mt-4 text-neutral-700">{reservations.formNote}</p>
          <div className="mt-6 min-h-[500px] overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div data-tf-live="01JN38VBCPQKPJFGQK77ZR4JDG" />
            <Script src="//embed.typeform.com/next/embed.js" strategy="lazyOnload" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingBlock({
  title,
  prices,
  locale,
}: {
  title: string;
  prices: { guests: number; price: number }[];
  locale: Locale;
}) {
  const guestLabel = locale === "fr" ? "personne" : "guest";
  const guestsLabel = locale === "fr" ? "personnes" : "guests";

  return (
    <div className="rounded-lg bg-neutral-100 p-6">
      <p className="font-semibold text-neutral-900">{title}</p>
      <ul className="mt-4 space-y-2 text-neutral-700">
        {prices.map(({ guests, price }) => (
          <li key={guests}>
            {guests} {guests === 1 ? guestLabel : guestsLabel} : {price} CHF
          </li>
        ))}
      </ul>
    </div>
  );
}
