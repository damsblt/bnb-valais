import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export type PaidBookingReceipt = {
  transactionId: string;
  value: number;
  valueFormatted: string;
  currency: string;
  email: string | null;
};

async function orderNumberForSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<string> {
  let invoice = session.invoice;
  if (typeof invoice === "string") {
    invoice = await stripe.invoices.retrieve(invoice);
  }
  if (invoice && typeof invoice === "object" && invoice.number?.trim()) {
    return invoice.number.trim();
  }
  const checkIn = session.metadata?.checkIn?.replaceAll("-", "") ?? "";
  const tail = session.id.slice(-6).toUpperCase();
  return checkIn ? `BNB-${checkIn}-${tail}` : `BNB-${tail}`;
}

export async function loadPaidBookingReceipt(
  sessionId: string | undefined,
): Promise<PaidBookingReceipt | null> {
  const id = sessionId?.trim() ?? "";
  if (!id.startsWith("cs_") || !isStripeConfigured()) return null;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["invoice"],
    });
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }
    const cents = session.amount_total;
    if (cents == null || !Number.isFinite(cents) || cents <= 0) return null;
    const value = cents / 100;
    const currency = (session.currency || "chf").toUpperCase();
    return {
      transactionId: await orderNumberForSession(stripe, session),
      value,
      valueFormatted: value.toFixed(2),
      currency,
      email: session.customer_details?.email?.trim() || session.customer_email?.trim() || null,
    };
  } catch {
    return null;
  }
}
