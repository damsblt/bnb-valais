"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ParallaxHeroProps = {
  imageSrc: string;
  imageSrcMobile?: string;
  imageAlt: string;
  children: React.ReactNode;
};

function encodePhotoPath(path: string) {
  return path
    .split("/")
    .map((part, index) => (index === 0 && part === "" ? "" : encodeURIComponent(part)))
    .join("/");
}

export default function ParallaxHero({
  imageSrc,
  imageSrcMobile,
  imageAlt,
  children,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, -rect.top);
      setOffset(scrollProgress * 0.35);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.08)` }}
        aria-hidden
      >
        {/* Desktop image */}
        <Image
          src={encodePhotoPath(imageSrc)}
          alt={imageAlt}
          fill
          priority
          quality={90}
          className={`object-cover object-left ${imageSrcMobile ? "hidden md:block" : ""}`}
          sizes="100vw"
        />
        {/* Mobile image */}
        {imageSrcMobile && (
          <Image
            src={encodePhotoPath(imageSrcMobile)}
            alt={imageAlt}
            fill
            priority
            quality={90}
            className="object-cover object-center md:hidden"
            sizes="100vw"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/40" />

      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
