"use client";

import { useEffect } from "react";
import type { PaidBookingReceipt } from "@/lib/paid-booking-receipt";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type PurchaseTrackingProps = {
  receipt: PaidBookingReceipt;
};

export default function PurchaseTracking({ receipt }: PurchaseTrackingProps) {
  useEffect(() => {
    const payload = {
      transaction_id: receipt.transactionId,
      value: receipt.value,
      currency: receipt.currency,
      ...(receipt.email ? { email: receipt.email } : {}),
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "purchase",
      ecommerce: payload,
      ...payload,
    });

    if (typeof window.gtag === "function") {
      window.gtag("event", "purchase", payload);
    }
  }, [receipt]);

  return null;
}
