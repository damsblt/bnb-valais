import type { ReservationRequest } from "@/lib/typeform";
import {
  RESEND_TEMPLATE_ALIAS_ACCEPT,
  RESEND_TEMPLATE_ALIAS_REJECT,
  reservationEmailLayoutHtml,
} from "@/lib/resend-template-html";

export type ReplyAction = "accept" | "reject";

export type ReplyEmailPayload = {
  subject: string;
  text: string;
  html: string;
  templateVariables: Record<string, string>;
  templateId: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDetailsHtml(request: ReservationRequest): string {
  const rows = request.answers
    .map(
      (a) =>
        `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;color:#3f3f46;"><strong style="color:#18181b;">${escapeHtml(a.label)}</strong><br />${escapeHtml(a.value)}</p>`,
    )
    .join("");
  return rows || `<p style="margin:0;font-size:15px;color:#71717a;">—</p>`;
}

function fillLayout(variables: Record<string, string>): string {
  let html = reservationEmailLayoutHtml();
  for (const [key, value] of Object.entries(variables)) {
    html = html.replaceAll(`{{{${key}}}}`, value);
  }
  return html;
}

export function buildReplyEmail(
  request: ReservationRequest,
  action: ReplyAction,
): ReplyEmailPayload {
  const greeting = request.guestName
    ? `Bonjour ${request.guestName},`
    : "Bonjour,";
  const detailsPlain = request.answers
    .map((a) => `- ${a.label}: ${a.value}`)
    .join("\n");
  const detailsHtml = buildDetailsHtml(request);

  if (action === "accept") {
    const headline = "Votre demande est confirmée";
    const lead =
      "Nous avons le plaisir de vous confirmer la disponibilité pour votre séjour au Nid de la Sittelle.";
    const footerNote =
      "Prochaines étapes : nous vous enverrons les modalités de réservation (acompte ou confirmation définitive) dans un second message. Au plaisir de vous accueillir en Valais.";
    const subject = "Confirmation de votre demande — Le Nid de la Sittelle";
    const text = `${greeting}

${lead}

Récapitulatif de votre demande :
${detailsPlain}

${footerNote}

Le Nid de la Sittelle
https://www.bnb-valais.ch
`;
    const templateVariables = {
      GREETING: escapeHtml(greeting),
      HEADLINE: escapeHtml(headline),
      LEAD: escapeHtml(lead),
      DETAILS_HTML: detailsHtml,
      FOOTER_NOTE: escapeHtml(footerNote),
      ACCENT_COLOR: "#047857",
    };
    return {
      subject,
      text,
      html: fillLayout(templateVariables),
      templateVariables,
      templateId:
        process.env.RESEND_TEMPLATE_ACCEPT?.trim() ||
        RESEND_TEMPLATE_ALIAS_ACCEPT,
    };
  }

  const headline = "Demande non retenue";
  const lead =
    "Merci pour votre intérêt pour Le Nid de la Sittelle. Malheureusement, nous ne sommes pas disponibles aux dates indiquées (ou la demande ne peut pas être acceptée en l'état).";
  const footerNote =
    "N'hésitez pas à nous proposer d'autres dates ou à consulter notre calendrier en ligne : https://www.bnb-valais.ch/reservations";
  const subject = "Votre demande de séjour — Le Nid de la Sittelle";
  const text = `${greeting}

${lead}

Récapitulatif :
${detailsPlain}

${footerNote}

Bien cordialement,

Le Nid de la Sittelle
`;
  const templateVariables = {
    GREETING: escapeHtml(greeting),
    HEADLINE: escapeHtml(headline),
    LEAD: escapeHtml(lead),
    DETAILS_HTML: detailsHtml,
    FOOTER_NOTE: escapeHtml(footerNote),
    ACCENT_COLOR: "#be123c",
  };
  return {
    subject,
    text,
    html: fillLayout(templateVariables),
    templateVariables,
    templateId:
      process.env.RESEND_TEMPLATE_REJECT?.trim() ||
      RESEND_TEMPLATE_ALIAS_REJECT,
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

async function postResendEmail(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<{ sent: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    return { sent: false, error: err || `HTTP ${res.status}` };
  }

  return { sent: true };
}

export async function sendReplyEmail(
  to: string,
  request: ReservationRequest,
  action: ReplyAction,
): Promise<{ sent: boolean; error?: string; via?: "template" | "html" }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESERVATION_FROM_EMAIL?.trim() ||
    "Le Nid de la Sittelle <reservations@bnb-valais.ch>";
  const replyTo = process.env.HOST_CONTACT_EMAIL?.trim() || undefined;

  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const payload = buildReplyEmail(request, action);
  const base = {
    from,
    to: [to],
    subject: payload.subject,
    reply_to: replyTo,
  };

  const useTemplates = process.env.RESEND_USE_TEMPLATES?.trim() !== "false";

  if (useTemplates) {
    const templateResult = await postResendEmail(apiKey, {
      ...base,
      template: {
        id: payload.templateId,
        variables: payload.templateVariables,
      },
    });
    if (templateResult.sent) {
      return { ...templateResult, via: "template" };
    }
  }

  const htmlResult = await postResendEmail(apiKey, {
    ...base,
    text: payload.text,
    html: payload.html,
  });
  return htmlResult.sent
    ? { ...htmlResult, via: "html" }
    : htmlResult;
}
