import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { recordReservationOutcome, listAcceptedStays } from "@/lib/accepted-stays-store";
import { sendPaidBookingEmails } from "@/lib/paid-booking-mail";
import { stayOverlapsBooked, type CheckoutQuote } from "@/lib/paid-stay";
import { parseGuestCount } from "@/lib/night-pricing";
import { getStripe } from "@/lib/stripe";
import { parseLocale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "webhook_unconfigured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid" || !session.id) {
    return NextResponse.json({ received: true });
  }

  const existing = await listAcceptedStays();
  if (existing.some((stay) => stay.responseId === session.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const checkIn = session.metadata?.checkIn ?? "";
  const checkOut = session.metadata?.checkOut ?? "";
  if (!checkIn || !checkOut) {
    return NextResponse.json({ received: true, skipped: "missing_dates" });
  }

  if (await stayOverlapsBooked(checkIn, checkOut)) {
    if (typeof session.payment_intent === "string") {
      await stripe.refunds.create({ payment_intent: session.payment_intent });
    }
    return NextResponse.json({ received: true, refunded: true });
  }

  const guestEmail =
    session.customer_details?.email || session.customer_email || "";
  const guestName = session.customer_details?.name || guestEmail || "Guest";
  const locale = parseLocale(session.metadata?.locale);
  const guestCount = parseGuestCount(session.metadata?.guests, 2);
  const total = Number(session.metadata?.total ?? 0);
  const subtotal = Number(session.metadata?.subtotal ?? total);
  const percentOff = Number(session.metadata?.percentOff ?? 0);

  await recordReservationOutcome({
    responseId: session.id,
    action: "accept",
    stay: {
      checkIn,
      checkOut,
      guestLabel: guestName,
    },
  });

  const quote: CheckoutQuote = {
    checkIn,
    checkOut,
    guestCount,
    nights: [],
    subtotal,
    discount: Math.max(0, subtotal - total),
    total,
    percentOff,
    promoCode: session.metadata?.promoCode || null,
  };

  const invoiceUrl =
    typeof session.invoice === "string"
      ? null
      : session.invoice && "hosted_invoice_url" in session.invoice
        ? (session.invoice.hosted_invoice_url as string | null)
        : null;

  let hostedInvoice: string | null = invoiceUrl;
  if (!hostedInvoice && session.invoice && typeof session.invoice === "string") {
    const invoice = await stripe.invoices.retrieve(session.invoice);
    hostedInvoice = invoice.hosted_invoice_url ?? null;
  }

  if (guestEmail) {
    await sendPaidBookingEmails({
      locale,
      guestEmail,
      guestName,
      quote,
      invoiceUrl: hostedInvoice,
    });
  }

  return NextResponse.json({ received: true });
}
