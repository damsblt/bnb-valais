import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent, roomImages } from "@/lib/content";

type RoomsContentProps = {
  locale: Locale;
};

export default function RoomsContent({ locale }: RoomsContentProps) {
  const { rooms, gallery } = getContent(locale);
  const reservationsHref = localePath(locale, "/reservations");
  const roomAlts = gallery.alt.slice(3, 6);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:px-12 md:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
          {rooms.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-700">
          {rooms.description}
        </p>
      </div>

      <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {roomImages.map((filename, index) => (
          <div
            key={filename}
            className="overflow-hidden rounded-sm bg-neutral-100"
          >
            <Image
              src={`/images/${filename}`}
              alt={roomAlts[index] ?? `BnB Valais ${index + 1}`}
              width={1024}
              height={768}
              className="h-auto w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-neutral-600">{rooms.ctaNote}</p>
        <Link
          href={reservationsHref}
          className="mt-6 inline-block rounded-full bg-neutral-900 px-8 py-3 text-lg font-medium text-white transition hover:bg-neutral-700"
        >
          {rooms.cta}
        </Link>
      </div>
    </div>
  );
}
