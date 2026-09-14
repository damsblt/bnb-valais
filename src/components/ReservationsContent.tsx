import Script from "next/script";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { TYPEFORM_LIVE_EMBED_ID } from "@/lib/typeform";

type ReservationsContentProps = {
  locale: Locale;
};

export default function ReservationsContent({ locale }: ReservationsContentProps) {
  const { reservations } = getContent(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
          {reservations.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
          {reservations.subtitle}
        </p>
      </div>

      <div className="mt-10 space-y-10">
        <AvailabilityCalendar
          locale={locale}
          title={reservations.calendarTitle}
          legendFree={reservations.legendFree}
          legendBusy={reservations.legendBusy}
          latencyNote={reservations.latencyNote}
          notConfiguredNote={reservations.notConfiguredNote}
        />

        <div>
          <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
            {reservations.formTitle}
          </h2>
          <p className="mt-2 text-neutral-600">{reservations.formNote}</p>
          <div className="mt-6 min-h-[500px] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div data-tf-live={TYPEFORM_LIVE_EMBED_ID} />
            <Script src="//embed.typeform.com/next/embed.js" strategy="lazyOnload" />
          </div>
        </div>
      </div>
    </div>
  );
}
