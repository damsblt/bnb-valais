import ConsentMap from "@/components/ConsentMap";
import type { Locale } from "@/lib/i18n";

type LocationSectionProps = {
  locale: Locale;
  title: string;
  description: string;
};

export default function LocationSection({
  locale,
  title,
  description,
}: LocationSectionProps) {
  return (
    <section className="px-4 py-10 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-3xl bg-neutral-50 px-8 py-10 md:px-12 md:py-14">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {description}
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl shadow-lg shadow-neutral-900/10">
          <ConsentMap locale={locale} />
        </div>
      </div>
    </section>
  );
}
