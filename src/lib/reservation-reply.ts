import type { ReservationRequest } from "@/lib/typeform";

export type ReplyAction = "accept" | "reject";

export function buildReplyEmail(
  request: ReservationRequest,
  action: ReplyAction,
): { subject: string; text: string } {
  const greeting = request.guestName ? `Bonjour ${request.guestName},` : `Bonjour,`;

  const details = request.answers
    .map((a) => `- ${a.label}: ${a.value}`)
    .join("\n");

  if (action === "accept") {
    return {
      subject: "Confirmation de votre demande — Le Nid de la Sittelle",
      text: `${greeting}

Nous avons le plaisir de vous confirmer la disponibilité pour votre séjour au Nid de la Sittelle.

Récapitulatif de votre demande :
${details}

Prochaines étapes : nous vous enverrons les modalités de réservation (acompte ou confirmation définitive) dans un second message.

Au plaisir de vous accueillir en Valais,

Le Nid de la Sittelle
https://www.bnb-valais.ch
`,
    };
  }

  return {
    subject: "Votre demande de séjour — Le Nid de la Sittelle",
    text: `${greeting}

Merci pour votre intérêt pour Le Nid de la Sittelle.

Malheureusement, nous ne sommes pas disponibles aux dates indiquées (ou la demande ne peut pas être acceptée en l'état).

Récapitulatif :
${details}

N'hésitez pas à nous proposer d'autres dates ou à consulter notre calendrier en ligne :
https://www.bnb-valais.ch/reservations

Bien cordialement,

Le Nid de la Sittelle
`,
  };
}

export function buildMailtoUrl(
  to: string,
  subject: string,
  body: string,
): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export async function sendReplyEmail(
  to: string,
  subject: string,
  text: string,
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESERVATION_FROM_EMAIL?.trim() ||
    "Le Nid de la Sittelle <reservations@bnb-valais.ch>";

  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      reply_to: process.env.HOST_CONTACT_EMAIL?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { sent: false, error: err || `HTTP ${res.status}` };
  }

  return { sent: true };
}
