"use client";

import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getBookingHotelUrl } from "@/lib/booking";

type BookingPreviewProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  cta: string;
  widgetNote: string;
};

export default function BookingPreview({
  locale,
  title,
  subtitle,
  cta,
  widgetNote,
}: BookingPreviewProps) {
  const bookingUrl = getBookingHotelUrl(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
          {subtitle}
        </p>
      </div>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-sky-300 hover:shadow-md"
      >
        <div className="grid md:grid-cols-5">
          <div className="relative min-h-48 md:col-span-2 md:min-h-80">
            <Image
              src="/images/DJI_0057-scaled-e1737734622186.jpg"
              alt="Maison La Sittelle"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          <div className="flex flex-col justify-center gap-4 p-6 md:col-span-3 md:p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
              Booking.com
            </p>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Maison La Sittelle
            </h2>
            <p className="text-neutral-600">
              {locale === "fr"
                ? "Appartement 2 chambres avec vue sur les Alpes — Valais, Suisse"
                : "2-bedroom apartment with Alpine views — Valais, Switzerland"}
            </p>
            <span className="inline-flex w-fit items-center justify-center rounded-full bg-[#003580] px-6 py-3 text-base font-medium text-white">
              {cta}
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 p-4">
          <p className="text-center text-sm text-neutral-600">{widgetNote}</p>
        </div>
      </a>
    </div>
  );
}
