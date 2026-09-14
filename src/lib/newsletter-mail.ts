import type { Locale } from "@/lib/i18n";

function siteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://www.bnb-valais.ch";
}

function fromAddress(): string {
  return (
    process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
    process.env.RESERVATION_FROM_EMAIL?.trim() ||
    "Le Nid de la Sittelle <newsletter@bnb-valais.ch>"
  );
}

async function sendEmail(payload: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
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
      from: fromAddress(),
      to: [payload.to],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      reply_to: process.env.HOST_CONTACT_EMAIL?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    return { sent: false, error: await res.text() };
  }
  return { sent: true };
}

export function buildOptInConfirmUrl(token: string, locale: Locale): string {
  const base = siteBaseUrl();
  const prefix = locale === "en" ? "/en" : "";
  return `${base}${prefix}/newsletter/confirm?token=${encodeURIComponent(token)}`;
}

export async function sendNewsletterOptInEmail(input: {
  email: string;
  token: string;
  locale: Locale;
}): Promise<{ sent: boolean; error?: string }> {
  const confirmUrl = buildOptInConfirmUrl(input.token, input.locale);

  if (input.locale === "en") {
    return sendEmail({
      to: input.email,
      subject: "Confirm your subscription — BnB Valais",
      text: `Hello,

Please confirm your subscription to news and updates from Le Nid de la Sittelle (BnB Valais).

Confirm here (link valid 7 days):
${confirmUrl}

If you did not request this, you can ignore this email.

Le Nid de la Sittelle
${siteBaseUrl()}`,
      html: `<p>Hello,</p>
<p>Please confirm your subscription to news and updates from <strong>Le Nid de la Sittelle</strong> (BnB Valais).</p>
<p><a href="${confirmUrl}" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Confirm my subscription</a></p>
<p style="font-size:14px;color:#52525b;">Or copy this link: ${confirmUrl}</p>
<p style="font-size:14px;color:#52525b;">Link valid for 7 days. If you did not request this, ignore this email.</p>
<p>Le Nid de la Sittelle<br/><a href="${siteBaseUrl()}">bnb-valais.ch</a></p>`,
    });
  }

  return sendEmail({
    to: input.email,
    subject: "Confirmez votre inscription — BnB Valais",
    text: `Bonjour,

Merci de confirmer votre inscription aux actualités du Nid de la Sittelle (BnB Valais).

Lien de confirmation (valable 7 jours) :
${confirmUrl}

Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.

Le Nid de la Sittelle
${siteBaseUrl()}`,
    html: `<p>Bonjour,</p>
<p>Merci de confirmer votre inscription aux actualités du <strong>Nid de la Sittelle</strong> (BnB Valais).</p>
<p><a href="${confirmUrl}" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Confirmer mon inscription</a></p>
<p style="font-size:14px;color:#52525b;">Ou copiez ce lien : ${confirmUrl}</p>
<p style="font-size:14px;color:#52525b;">Lien valable 7 jours. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
<p>Le Nid de la Sittelle<br/><a href="${siteBaseUrl()}">bnb-valais.ch</a></p>`,
  });
}

export async function addContactToResendNewsletter(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim();
  const body: Record<string, unknown> = {
    email,
    unsubscribed: false,
  };
  if (segmentId) {
    body.segments = [{ id: segmentId }];
  }

  const res = await fetch("https://api.resend.com/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) return { ok: true };

  const errText = await res.text();
  if (res.status === 409 || /already exists/i.test(errText)) {
    return { ok: true };
  }

  return { ok: false, error: errText || `HTTP ${res.status}` };
}
