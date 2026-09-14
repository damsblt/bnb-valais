"use client";

import Script from "next/script";
import { useEffect } from "react";
import { TYPEFORM_LIVE_EMBED_ID } from "@/lib/typeform";

type TypeformEmbedProps = {
  hidden: Record<string, string>;
  paramKeys: string[];
};

declare global {
  interface Window {
    tf?: { load: () => void };
  }
}

export default function TypeformEmbed({ hidden, paramKeys }: TypeformEmbedProps) {
  const hiddenPairs = Object.entries(hidden).filter(([, value]) => value);
  const hiddenAttr = hiddenPairs.map(([k, v]) => `${k}=${v}`).join(",");
  const embedKey = `${TYPEFORM_LIVE_EMBED_ID}|${hiddenAttr}|${paramKeys.join(",")}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.tf?.load();
    }, 100);
    return () => window.clearTimeout(timer);
  }, [embedKey]);

  return (
    <>
      <div
        key={embedKey}
        data-tf-live={TYPEFORM_LIVE_EMBED_ID}
        {...(hiddenAttr ? { "data-tf-hidden": hiddenAttr } : {})}
        {...(paramKeys.length
          ? { "data-tf-transitive-search-parameters": paramKeys.join(",") }
          : {})}
        className="min-h-[500px] w-full"
      />
      <Script src="https://embed.typeform.com/next/embed.js" strategy="lazyOnload" />
    </>
  );
}
