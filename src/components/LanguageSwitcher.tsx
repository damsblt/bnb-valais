"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type LanguageSwitcherProps = {
  locale: Locale;
  variant?: "hero" | "compact";
};

export default function LanguageSwitcher({
  locale,
  variant = "hero",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { language } = getContent(locale);

  const pathWithoutLocale =
    locale === "en" ? pathname.replace(/^\/en/, "") || "" : pathname;

  const targetHref =
    locale === "fr"
      ? `/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`
      : pathWithoutLocale || "/";

  const className =
    variant === "compact"
      ? "rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
      : "rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20";

  return (
    <Link href={targetHref} className={className}>
      {language.switchTo}
    </Link>
  );
}
