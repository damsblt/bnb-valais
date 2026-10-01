"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { hrefForLocale, locales, type Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type LanguageSwitcherProps = {
  locale: Locale;
  variant?: "hero" | "compact";
};

const labels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
};

export default function LanguageSwitcher({
  locale,
  variant = "hero",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const { language } = getContent(locale);

  const wrapClass =
    variant === "compact"
      ? "inline-flex items-center gap-0.5 rounded-full border border-neutral-300 bg-neutral-50 p-1 text-xs font-medium text-neutral-700"
      : "inline-flex items-center gap-0.5 rounded-full border border-white/40 bg-white/10 p-1 text-xs font-medium text-white backdrop-blur-sm";

  const idleClass =
    variant === "compact"
      ? "rounded-full px-2.5 py-1.5 transition hover:bg-neutral-100"
      : "rounded-full px-2.5 py-1.5 transition hover:bg-white/20";

  const activeClass =
    variant === "compact"
      ? "rounded-full bg-neutral-900 px-2.5 py-1.5 text-white"
      : "rounded-full bg-white px-2.5 py-1.5 font-semibold text-neutral-900";

  return (
    <nav className={wrapClass} aria-label={language.label}>
      {locales.map((code) => (
        <Link
          key={code}
          href={hrefForLocale(code, pathname)}
          hrefLang={code}
          className={code === locale ? activeClass : idleClass}
          aria-current={code === locale ? "page" : undefined}
        >
          {labels[code]}
        </Link>
      ))}
    </nav>
  );
}
