export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, path = ""): string {
  const base = locale === "fr" ? "" : "/en";
  return `${base}${path}` || "/";
}

export function alternateLocaleHref(locale: Locale, pathname: string): string {
  if (locale === "fr") {
    if (pathname === "/protection-des-donnees") return "/en/privacy";
    return `/en${pathname === "/" ? "" : pathname}`;
  }

  const withoutEn = pathname.replace(/^\/en/, "") || "/";
  if (withoutEn === "/privacy") return "/protection-des-donnees";
  return withoutEn === "/" ? "/" : withoutEn;
}
