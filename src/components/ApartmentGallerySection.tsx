import Image from "next/image";
import Link from "next/link";
import { apartmentGalleryImages } from "@/lib/gallery";
import { encodePhotoPath } from "@/lib/photos";

type ApartmentGallerySectionProps = {
  title: string;
  paragraphs: string[];
  cta?: {
    label: string;
    href: string;
  };
};

export default function ApartmentGallerySection({
  title,
  paragraphs,
  cta,
}: ApartmentGallerySectionProps) {
  return (
    <section className="px-4 py-10 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="grid grid-cols-2 gap-3">
          {apartmentGalleryImages.map((src, index) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-2xl bg-neutral-100 ${
                index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
              }`}
            >
              <Image
                src={encodePhotoPath(src)}
                alt=""
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-6 px-2 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {title}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex w-fit items-center rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
