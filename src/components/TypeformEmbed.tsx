"use client";

import { createWidget } from "@typeform/embed";
import "@typeform/embed/build/css/widget.css";
import { useEffect, useMemo, useRef } from "react";
import { TYPEFORM_DEFAULT_API_FORM_ID } from "@/lib/typeform";

type TypeformEmbedProps = {
  hidden: Record<string, string>;
};

export default function TypeformEmbed({ hidden }: TypeformEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenKey = useMemo(
    () =>
      JSON.stringify(
        Object.fromEntries(Object.entries(hidden).filter(([, v]) => v)),
      ),
    [hidden],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hiddenFields = JSON.parse(hiddenKey) as Record<string, string>;
    container.innerHTML = "";

    const widget = createWidget(TYPEFORM_DEFAULT_API_FORM_ID, {
      container,
      hidden: hiddenFields,
    });

    return () => {
      widget.unmount();
    };
  }, [hiddenKey]);

  return <div ref={containerRef} className="min-h-[520px] w-full" />;
}
