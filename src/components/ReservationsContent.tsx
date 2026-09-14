import { Suspense } from "react";
import ReservationsInteractive from "@/components/ReservationsInteractive";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

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

      <Suspense
        fallback={
          <div className="mt-10 text-center text-neutral-600">Chargement…</div>
        }
      >
        <ReservationsInteractive locale={locale} reservations={reservations} />
      </Suspense>
    </div>
  );
}
