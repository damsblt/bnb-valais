import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { heroImage } from "@/lib/gallery";
import LanguageSwitcher from "./LanguageSwitcher";
import ParallaxHero from "./ParallaxHero";

type HeaderProps = {
  locale: Locale;
  variant?: "hero" | "compact";
};

export default function Header({ locale, variant = "hero" }: HeaderProps) {
  const { nav } = getContent(locale);
  const homeHref = localePath(locale);
  const reservationsHref = localePath(locale, "/reservations");

  const navLinks = (
    <>
      <Link
        href={homeHref}
        className={
          variant === "hero"
            ? "rounded-full px-4 py-2 text-sm font-medium text-white/95 backdrop-blur-sm transition hover:bg-white/15"
            : "text-sm font-medium text-neutral-700 transition hover:text-sky-600"
        }
      >
        {nav.home}
      </Link>
      <Link
        href={reservationsHref}
        className={
          variant === "hero"
            ? "rounded-full px-4 py-2 text-sm font-medium text-white/95 backdrop-blur-sm transition hover:bg-white/15"
            : "text-sm font-medium text-neutral-700 transition hover:text-sky-600"
        }
      >
        {nav.reservations}
      </Link>
    </>
  );

  if (variant === "compact") {
    return (
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link href={homeHref}>
            <Image
              src="/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png"
              alt="BnB Valais"
              width={180}
              height={70}
              className="h-auto w-32 md:w-36"
            />
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-2 md:flex">{navLinks}</nav>
            <LanguageSwitcher locale={locale} variant="compact" />
          </div>
        </div>
        <nav className="flex justify-center gap-4 border-t border-neutral-100 px-4 py-3 md:hidden">
          {navLinks}
        </nav>
      </header>
    );
  }

  return (
    <header className="relative">
      <ParallaxHero imageSrc={heroImage} imageAlt="Le Nid de la Sittelle — Valais">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-6 pt-8 md:px-10 md:pt-10">
          <Link href={homeHref} className="block drop-shadow-lg">
            <Image
              src="/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png"
              alt="BnB Valais"
              width={316}
              height={120}
              className="hidden h-auto w-44 md:block md:w-64 lg:w-72"
              priority
            />
            <Image
              src="/images/cropped-cropped-Logo-BnB-Valais-blanc-r0h18jixc0gy876orrz8t6tc7sjxfza1pwr5a3v2bs.png"
              alt="BnB Valais"
              width={259}
              height={100}
              className="h-auto w-40 md:hidden"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </ParallaxHero>

      <nav className="flex justify-center gap-4 border-b border-neutral-200/80 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        {navLinks}
      </nav>
    </header>
  );
}
