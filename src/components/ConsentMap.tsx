"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  CONSENT_CHANGED_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/consent";
import { getMapConsentCopy } from "@/lib/legal";

type ConsentMapProps = {
  locale: Locale;
};

const MAP_SRC =
  "https://www.google.com/maps/embed/v1/place?key=AIzaSyCF3GqCPfbM6TwJPzs3eENWvWFZjl-Op34&q=bnb%20la%20sittelle&zoom=10";

export default function ConsentMap({ locale }: ConsentMapProps) {
  const [allowed, setAllowed] = useState(false);
  const copy = getMapConsentCopy(locale);

  useEffect(() => {
    const sync = () => setAllowed(readCookieConsent() === "all");
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (!allowed) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-neutral-100 px-6 text-center">
        <p className="max-w-md text-sm text-neutral-600">{copy.message}</p>
        <button
          type="button"
          onClick={() => {
            writeCookieConsent("all");
            setAllowed(true);
          }}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
        >
          {copy.action}
        </button>
      </div>
    );
  }

  return (
    <iframe
      title="Le Nid de la Sittelle — Google Maps"
      src={MAP_SRC}
      className="aspect-video w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
