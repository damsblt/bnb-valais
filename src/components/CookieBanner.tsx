"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  readCookieConsent,
  writeCookieConsent,
} from "@/lib/consent";
import { cookiesPath, getCookieBannerCopy, privacyPath } from "@/lib/legal";

type CookieBannerProps = {
  locale: Locale;
};

export default function CookieBanner({ locale }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const copy = getCookieBannerCopy(locale);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    setVisible(readCookieConsent() === null);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-900/15 md:flex-row md:items-center md:gap-6">
        <p className="text-sm leading-relaxed text-neutral-700">{copy.text}</p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              writeCookieConsent("all");
              setVisible(false);
            }}
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700"
          >
            {copy.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => {
              writeCookieConsent("essential");
              setVisible(false);
            }}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            {copy.essentialOnly}
          </button>
        </div>
        <div className="flex shrink-0 gap-4 text-sm">
          <Link href={privacyPath(locale)} className="text-sky-800 underline-offset-2 hover:underline">
            {copy.privacy}
          </Link>
          <Link href={cookiesPath(locale)} className="text-sky-800 underline-offset-2 hover:underline">
            {copy.cookies}
          </Link>
        </div>
      </div>
    </div>
  );
}
