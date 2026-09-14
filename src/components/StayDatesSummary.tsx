import type { DateRange } from "@/lib/typeform-prefill";

type StayDatesSummaryProps = {
  locale: "fr" | "en";
  range: DateRange;
};

function parts(iso: string) {
  const [y, m, d] = iso.split("-");
  return { day: d, month: m, year: y };
}

function DateRow({
  number,
  label,
  iso,
  locale,
}: {
  number: number;
  label: string;
  iso: string;
  locale: "fr" | "en";
}) {
  const { day, month, year } = parts(iso);
  const monthLabel = locale === "fr" ? "Mois" : "Month";
  const dayLabel = locale === "fr" ? "Jour" : "Day";
  const yearLabel = locale === "fr" ? "Année" : "Year";

  return (
    <div className="border-b border-neutral-100 px-6 py-8 last:border-b-0">
      <p className="text-sm font-medium text-neutral-500">{number}</p>
      <h3 className="mt-2 text-xl font-semibold text-neutral-900">{label}</h3>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-neutral-500">{monthLabel}</label>
          <div className="mt-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 text-lg text-neutral-900">
            {month}
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-500">{dayLabel}</label>
          <div className="mt-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 text-lg text-neutral-900">
            {day}
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-500">{yearLabel}</label>
          <div className="mt-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-3 text-lg text-neutral-900">
            {year}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StayDatesSummary({ locale, range }: StayDatesSummaryProps) {
  const arrival = locale === "fr" ? "Date d'arrivée" : "Check-in date";
  const departure = locale === "fr" ? "Date de départ" : "Check-out date";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white">
      <DateRow number={3} label={arrival} iso={range.checkIn} locale={locale} />
      <DateRow number={4} label={departure} iso={range.checkOut} locale={locale} />
    </div>
  );
}
