import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { heroImage } from "@/lib/gallery";
import LanguageSwitcher from "./LanguageSwitcher";

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
            ? "text-base font-medium text-white drop-shadow-md transition hover:text-sky-200"
            : "text-base font-medium text-neutral-700 transition hover:text-sky-500"
        }
      >
        {nav.home}
      </Link>
      <Link
        href={reservationsHref}
        className={
          variant === "hero"
            ? "text-base font-medium text-white drop-shadow-md transition hover:text-sky-200"
            : "text-base font-medium text-neutral-700 transition hover:text-sky-500"
        }
      >
        {nav.reservations}
      </Link>
    </>
  );

  if (variant === "compact") {
    return (
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link href={homeHref}>
            <Image
              src="/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png"
              alt="BnB Valais"
              width={180}
              height={70}
              className="h-auto w-36"
            />
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">{navLinks}</nav>
            <LanguageSwitcher locale={locale} variant="compact" />
          </div>
        </div>
        <nav className="flex justify-center gap-6 border-t border-neutral-100 px-4 py-3 md:hidden">
          {navLinks}
        </nav>
      </header>
    );
  }

  return (
    <header className="relative">
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 mx-auto flex max-w-7xl items-start justify-between px-6 pt-8 md:px-12">
          <Link href={homeHref} className="block">
            <Image
              src="/images/logo-v2-r1zdvr4wx0fvk8au90hylll5skn9p52d7mwt04xwug.png"
              alt="BnB Valais"
              width={316}
              height={120}
              className="hidden h-auto w-48 md:block md:w-72 lg:w-80"
              priority
            />
            <Image
              src="/images/cropped-cropped-Logo-BnB-Valais-blanc-r0h18jixc0gy876orrz8t6tc7sjxfza1pwr5a3v2bs.png"
              alt="BnB Valais"
              width={259}
              height={100}
              className="h-auto w-44 md:hidden"
              priority
            />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 md:flex">{navLinks}</nav>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>

      <nav className="flex justify-center gap-6 border-b border-neutral-200 bg-white px-4 py-4 md:hidden">
        {navLinks}
      </nav>
    </header>
  );
}
