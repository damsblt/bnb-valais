export const locales = ["fr", "en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

const privacySlug: Record<Locale, string> = {
  fr: "/protection-des-donnees",
  en: "/privacy",
  de: "/datenschutz",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function parseLocale(value: unknown): Locale {
  return typeof value === "string" && isLocale(value) ? value : defaultLocale;
}

export function localePath(locale: Locale, path = ""): string {
  const base = locale === "fr" ? "" : `/${locale}`;
  return `${base}${path}` || "/";
}

export function htmlLang(locale: Locale): string {
  return locale;
}

export function ogLocale(locale: Locale): string {
  if (locale === "fr") return "fr_CH";
  if (locale === "de") return "de_CH";
  return "en_GB";
}

export function intlLocale(locale: Locale): string {
  if (locale === "fr") return "fr-CH";
  if (locale === "de") return "de-CH";
  return "en-GB";
}

export function hreflangMap(paths: Record<Locale, string>) {
  return {
    "fr-CH": paths.fr,
    en: paths.en,
    "de-CH": paths.de,
    "x-default": paths.fr,
  };
}

function withoutLocalePrefix(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return pathname.slice(3) || "/";
  }
  if (pathname === "/de" || pathname.startsWith("/de/")) {
    return pathname.slice(3) || "/";
  }
  return pathname || "/";
}

function isPrivacySlug(path: string): boolean {
  return Object.values(privacySlug).includes(path);
}

export function hrefForLocale(target: Locale, pathname: string): string {
  const unprefixed = withoutLocalePrefix(pathname);
  if (isPrivacySlug(unprefixed)) {
    return localePath(target, privacySlug[target]);
  }
  return localePath(target, unprefixed === "/" ? "" : unprefixed);
}

export function alternateLocaleHref(locale: Locale, pathname: string): string {
  const target = locale === "fr" ? "en" : "fr";
  return hrefForLocale(target, pathname);
}
