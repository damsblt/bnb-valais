import Image from "next/image";
import { galleryImages } from "@/lib/content";

type ImageGalleryProps = {
  altLabels: string[];
};

export default function ImageGallery({ altLabels }: ImageGalleryProps) {
  return (
    <section className="px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((filename, index) => (
          <div
            key={filename}
            className="overflow-hidden rounded-sm bg-neutral-100"
          >
            <Image
              src={`/images/${filename}`}
              alt={altLabels[index] ?? `BnB Valais ${index + 1}`}
              width={1024}
              height={768}
              className="h-auto w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
