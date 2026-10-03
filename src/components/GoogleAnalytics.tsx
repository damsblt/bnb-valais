"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  readCookieConsent,
} from "@/lib/consent";
import { GA_MEASUREMENT_ID } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const skipNextPageview = useRef(true);

  useEffect(() => {
    const sync = () => setAllowed(readCookieConsent() === "all");
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!allowed || pathname.startsWith("/admin")) return;
    if (skipNextPageview.current) {
      skipNextPageview.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: pathname });
  }, [allowed, pathname]);

  if (!allowed || pathname.startsWith("/admin")) {
    skipNextPageview.current = true;
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-gtag" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
