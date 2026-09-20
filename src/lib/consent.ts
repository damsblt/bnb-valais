export const CONSENT_STORAGE_KEY = "bnb-valais-cookie-consent";

export type CookieConsent = "all" | "essential";

export const CONSENT_CHANGED_EVENT = "bnb-cookie-consent-changed";

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (value === "all" || value === "essential") return value;
  return null;
}

export function writeCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}
