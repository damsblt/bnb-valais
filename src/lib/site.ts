export const SITE_HOST = "www.bnb-valais.ch";
export const SITE_NAME = "Le Nid de la Sittelle";
export const SITE_BRAND = "BnB Valais";
export const SITE_EMAIL = "info@bnb-valais.ch";
export const SITE_PHONE = "+41 79 520 08 85";
export const SITE_OG_IMAGE = "/images/og-header.jpg";
export const SITE_OG_IMAGE_WIDTH = 1200;
export const SITE_OG_IMAGE_HEIGHT = 630;
export const SITE_OG_IMAGE_ALT =
  "Chambre avec vue sur les Alpes — BnB Valais";

export function shareOgImage() {
  return {
    url: SITE_OG_IMAGE,
    width: SITE_OG_IMAGE_WIDTH,
    height: SITE_OG_IMAGE_HEIGHT,
    alt: SITE_OG_IMAGE_ALT,
    type: "image/jpeg" as const,
  };
}

export function siteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return `https://${SITE_HOST}`;
}

export function absoluteUrl(path = "/"): string {
  const base = siteBaseUrl();
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
