import { getStripe, isStripeConfigured } from "@/lib/stripe";

export type PaidBookingReceipt = {
  transactionId: string;
  value: number;
  valueFormatted: string;
  currency: string;
  email: string | null;
};

export async function loadPaidBookingReceipt(
  sessionId: string | undefined,
): Promise<PaidBookingReceipt | null> {
  const id = sessionId?.trim() ?? "";
  if (!id.startsWith("cs_") || !isStripeConfigured()) return null;

  try {
    const session = await getStripe().checkout.sessions.retrieve(id);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }
    const cents = session.amount_total;
    if (cents == null || !Number.isFinite(cents) || cents <= 0) return null;
    const value = cents / 100;
    const currency = (session.currency || "chf").toUpperCase();
    return {
      transactionId: session.id,
      value,
      valueFormatted: value.toFixed(2),
      currency,
      email: session.customer_details?.email?.trim() || session.customer_email?.trim() || null,
    };
  } catch {
    return null;
  }
}
