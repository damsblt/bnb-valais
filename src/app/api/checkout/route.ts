import { NextResponse } from "next/server";
import { localePath } from "@/lib/i18n";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { quotePaidStay, stayOverlapsBooked } from "@/lib/paid-stay";
import { siteBaseUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "stripe_unconfigured" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    promoCode?: string;
    locale?: string;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const locale = body.locale === "en" ? "en" : "fr";
  const quoted = await quotePaidStay({
    checkIn: body.checkIn ?? "",
    checkOut: body.checkOut ?? "",
    guests: body.guests,
    promoCode: body.promoCode,
  });

  if (!quoted.ok) {
    return NextResponse.json({ error: quoted.error }, { status: quoted.status });
  }

  const { quote } = quoted;
  if (await stayOverlapsBooked(quote.checkIn, quote.checkOut)) {
    return NextResponse.json({ error: "dates_unavailable" }, { status: 409 });
  }

  const base = siteBaseUrl();
  const successPath = localePath(locale, "/reservations/success");
  const cancelPath = localePath(locale, "/reservations");
  const cancelParams = new URLSearchParams({
    check_in: quote.checkIn,
    check_out: quote.checkOut,
    guests: String(quote.guestCount),
  });

  const stripe = getStripe();
  const automaticTax = process.env.STRIPE_AUTOMATIC_TAX === "true";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: locale === "en" ? "en" : "fr",
    success_url: `${base}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}${cancelPath}?${cancelParams.toString()}`,
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    customer_creation: "always",
    invoice_creation: { enabled: true },
    ...(automaticTax ? { automatic_tax: { enabled: true as const } } : {}),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "chf",
          ...(automaticTax ? { tax_behavior: "exclusive" as const } : {}),
          unit_amount: quote.total * 100,
          product_data: {
            name:
              locale === "en"
                ? "Stay at BnB Valais — Le Nid de la Sittelle"
                : "Séjour BnB Valais — Le Nid de la Sittelle",
            description:
              locale === "en"
                ? `${quote.checkIn} → ${quote.checkOut} · ${quote.guestCount} guest(s) · ${quote.nights.length} night(s)`
                : `${quote.checkIn} → ${quote.checkOut} · ${quote.guestCount} pers. · ${quote.nights.length} nuit(s)`,
          },
        },
      },
    ],
    metadata: {
      checkIn: quote.checkIn,
      checkOut: quote.checkOut,
      guests: String(quote.guestCount),
      promoCode: quote.promoCode ?? "",
      percentOff: String(quote.percentOff),
      locale,
      subtotal: String(quote.subtotal),
      total: String(quote.total),
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "checkout_url_missing" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
