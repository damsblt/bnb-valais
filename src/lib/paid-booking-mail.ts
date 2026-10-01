import { SITE_BRAND, SITE_EMAIL, siteBaseUrl } from "@/lib/site";
import type { CheckoutQuote } from "@/lib/paid-stay";
import type { Locale } from "@/lib/i18n";
import { formatChf } from "@/lib/night-pricing";

function reservationFrom(): string {
  return (
    process.env.RESERVATION_FROM_EMAIL?.trim() ||
    `Le Nid de la Sittelle <${SITE_EMAIL}>`
  );
}

function hostInbox(): string {
  return process.env.HOST_CONTACT_EMAIL?.trim() || SITE_EMAIL;
}

async function sendEmail(payload: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: reservationFrom(),
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      reply_to: hostInbox(),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(
      "[paid-booking-mail] Resend a refusé l’envoi",
      res.status,
      detail.slice(0, 300),
    );
  }
}

export async function sendPaidBookingEmails(input: {
  locale: Locale;
  guestEmail: string;
  guestName: string;
  quote: CheckoutQuote;
  invoiceUrl?: string | null;
}): Promise<void> {
  const { locale, guestEmail, guestName, quote, invoiceUrl } = input;
  const total = formatChf(quote.total, locale);
  const guests =
    quote.guestCount === 1
      ? locale === "de"
        ? "1 Person"
        : locale === "en"
          ? "1 guest"
          : "1 personne"
      : locale === "de"
        ? `${quote.guestCount} Personen`
        : locale === "en"
          ? `${quote.guestCount} guests`
          : `${quote.guestCount} personnes`;
  const invoiceLine = invoiceUrl
    ? locale === "de"
      ? `\nRechnung: ${invoiceUrl}\n`
      : locale === "en"
        ? `\nInvoice: ${invoiceUrl}\n`
        : `\nFacture : ${invoiceUrl}\n`
    : "";

  const guestCopy =
    locale === "de"
      ? {
          subject: `Buchung bestätigt — ${SITE_BRAND}`,
          text: `Guten Tag ${guestName},

Ihr Aufenthalt im Nid de la Sittelle ist bestätigt und bezahlt.

Anreise: ${quote.checkIn}
Abreise: ${quote.checkOut}
Gäste: ${guests}
Bezahlter Betrag: ${total}
${invoiceLine}
Bis bald,
${SITE_BRAND}
${siteBaseUrl()}`,
          html: `<p>Guten Tag ${guestName},</p><p>Ihr Aufenthalt im <strong>Nid de la Sittelle</strong> ist bestätigt und bezahlt.</p><p>Anreise: ${quote.checkIn}<br/>Abreise: ${quote.checkOut}<br/>Gäste: ${guests}<br/>Bezahlter Betrag: <strong>${total}</strong></p>${invoiceUrl ? `<p><a href="${invoiceUrl}">Rechnung herunterladen</a></p>` : ""}<p>${SITE_BRAND}<br/><a href="${siteBaseUrl()}">${siteBaseUrl()}</a></p>`,
        }
      : locale === "en"
        ? {
            subject: `Booking confirmed — ${SITE_BRAND}`,
            text: `Hello ${guestName},

Your stay at Le Nid de la Sittelle is confirmed and paid.

Arrival: ${quote.checkIn}
Departure: ${quote.checkOut}
Guests: ${guests}
Total paid: ${total}
${invoiceLine}
See you soon,
${SITE_BRAND}
${siteBaseUrl()}`,
            html: `<p>Hello ${guestName},</p><p>Your stay at <strong>Le Nid de la Sittelle</strong> is confirmed and paid.</p><p>Arrival: ${quote.checkIn}<br/>Departure: ${quote.checkOut}<br/>Guests: ${guests}<br/>Total paid: <strong>${total}</strong></p>${invoiceUrl ? `<p><a href="${invoiceUrl}">Download invoice</a></p>` : ""}<p>${SITE_BRAND}<br/><a href="${siteBaseUrl()}">${siteBaseUrl()}</a></p>`,
          }
        : {
            subject: `Réservation confirmée — ${SITE_BRAND}`,
            text: `Bonjour ${guestName},

Votre séjour au Nid de la Sittelle est confirmé et payé.

Arrivée : ${quote.checkIn}
Départ : ${quote.checkOut}
Voyageurs : ${guests}
Montant payé : ${total}
${invoiceLine}
À bientôt,
${SITE_BRAND}
${siteBaseUrl()}`,
            html: `<p>Bonjour ${guestName},</p><p>Votre séjour au <strong>Nid de la Sittelle</strong> est confirmé et payé.</p><p>Arrivée : ${quote.checkIn}<br/>Départ : ${quote.checkOut}<br/>Voyageurs : ${guests}<br/>Montant payé : <strong>${total}</strong></p>${invoiceUrl ? `<p><a href="${invoiceUrl}">Télécharger la facture</a></p>` : ""}<p>${SITE_BRAND}<br/><a href="${siteBaseUrl()}">${siteBaseUrl()}</a></p>`,
          };

  await sendEmail({
    to: guestEmail,
    subject: guestCopy.subject,
    text: guestCopy.text,
    html: guestCopy.html,
  });

  await sendEmail({
    to: hostInbox(),
    subject: `Paiement reçu — ${quote.checkIn} → ${quote.checkOut}`,
    text: `Nouvelle réservation payée via Stripe.

Client : ${guestName} <${guestEmail}>
Arrivée : ${quote.checkIn}
Départ : ${quote.checkOut}
Personnes : ${quote.guestCount}
Total : ${formatChf(quote.total, "fr")}
${quote.promoCode ? `Promo : ${quote.promoCode}\n` : ""}`,
    html: `<p>Nouvelle réservation payée via Stripe.</p><p>Client : <strong>${guestName}</strong> &lt;${guestEmail}&gt;<br/>Arrivée : ${quote.checkIn}<br/>Départ : ${quote.checkOut}<br/>Personnes : ${quote.guestCount}<br/>Total : <strong>${formatChf(quote.total, "fr")}</strong>${quote.promoCode ? `<br/>Promo : ${quote.promoCode}` : ""}</p>`,
  });
}
