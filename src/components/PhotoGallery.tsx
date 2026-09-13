"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { propertyPhotos } from "@/lib/gallery";

type PhotoGalleryProps = {
  locale: Locale;
  title: string;
  showAllLabel: string;
  morePhotosTemplate: string;
};

function photoSrc(path: string) {
  return path.split("/").map(encodeURIComponent).join("/").replace(/^%2F/, "/");
}

export default function PhotoGallery({
  locale,
  title,
  showAllLabel,
  morePhotosTemplate,
}: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const total = propertyPhotos.length;
  const mosaicCount = 5;
  const remaining = total - mosaicCount;

  const close = useCallback(() => setLightboxIndex(null), []);
  const goPrev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + total) % total,
    );
  }, [total]);
  const goNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % total,
    );
  }, [total]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, close, goPrev, goNext]);

  const open = (index: number) => setLightboxIndex(index);

  return (
    <>
      <section className="px-4 py-12 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900 md:text-3xl">
            {title}
          </h2>

          {/* Desktop mosaic — style Booking.com */}
          <div className="hidden h-[28rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl md:grid lg:h-[32rem]">
            {propertyPhotos.slice(0, mosaicCount).map((photo, index) => {
              const isHero = index === 0;
              const isMoreTile = index === mosaicCount - 1 && remaining > 0;

              return (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => open(isMoreTile ? 0 : index)}
                  className={`group relative overflow-hidden bg-neutral-100 ${
                    isHero ? "col-span-2 row-span-2" : ""
                  }`}
                  aria-label={photo.alt[locale]}
                >
                  <Image
                    src={photoSrc(photo.src)}
                    alt={photo.alt[locale]}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes={isHero ? "50vw" : "25vw"}
                    priority={isHero}
                  />
                  {isMoreTile && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-lg font-semibold text-white">
                      {morePhotosTemplate.replace("{count}", String(remaining))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile — hero + grille compacte */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => open(0)}
              className="relative mb-2 block h-56 w-full overflow-hidden rounded-xl bg-neutral-100"
            >
              <Image
                src={photoSrc(propertyPhotos[0].src)}
                alt={propertyPhotos[0].alt[locale]}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </button>
            <div className="grid grid-cols-2 gap-2">
              {propertyPhotos.slice(1, 5).map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => open(index + 1)}
                  className="relative h-28 overflow-hidden rounded-lg bg-neutral-100"
                >
                  <Image
                    src={photoSrc(photo.src)}
                    alt={photo.alt[locale]}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => open(0)}
              className="mt-4 w-full rounded-lg border border-neutral-300 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              {showAllLabel} ({total})
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm tabular-nums md:text-base">
              {lightboxIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label={locale === "fr" ? "Fermer" : "Close"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-16">
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:left-6"
              aria-label={locale === "fr" ? "Photo précédente" : "Previous photo"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="relative h-full w-full max-h-[75vh] max-w-6xl">
              <Image
                src={photoSrc(propertyPhotos[lightboxIndex].src)}
                alt={propertyPhotos[lightboxIndex].alt[locale]}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:right-6"
              aria-label={locale === "fr" ? "Photo suivante" : "Next photo"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnails strip */}
          <div className="border-t border-white/10 px-4 py-3">
            <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1">
              {propertyPhotos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ${
                    index === lightboxIndex ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photoSrc(photo.src)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
