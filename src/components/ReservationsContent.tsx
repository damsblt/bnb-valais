import BookingPreview from "@/components/BookingPreview";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type ReservationsContentProps = {
  locale: Locale;
};

export default function ReservationsContent({ locale }: ReservationsContentProps) {
  const { reservations } = getContent(locale);

  return (
    <BookingPreview
      locale={locale}
      title={reservations.title}
      subtitle={reservations.subtitle}
      cta={reservations.cta}
      widgetNote={reservations.widgetNote}
    />
  );
}
