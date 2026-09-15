"use client";

import { GUEST_COUNTS, type GuestCount } from "@/lib/night-pricing";
import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content";

type GuestCountPickerProps = {
  locale: Locale;
  value: GuestCount;
  onChange: (value: GuestCount) => void;
  copy: SiteContent["reservations"];
};

export default function GuestCountPicker({
  locale,
  value,
  onChange,
  copy,
}: GuestCountPickerProps) {
  function labelFor(count: GuestCount): string {
    if (locale === "fr") {
      return count === 1
        ? copy.guestCountOne
        : copy.guestCountMany.replace("{count}", String(count));
    }
    return count === 1
      ? copy.guestCountOne
      : copy.guestCountMany.replace("{count}", String(count));
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-900">{copy.guestCountLabel}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={copy.guestCountLabel}>
        {GUEST_COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => onChange(count)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              value === count
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 text-neutral-800 hover:bg-neutral-50"
            }`}
          >
            {labelFor(count)}
          </button>
        ))}
      </div>
    </div>
  );
}
