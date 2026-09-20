import type { Locale } from "@/lib/i18n";
import { siteBaseUrl } from "@/lib/site";

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

  const { ensureNewsletterAudience } = await import(
    "@/lib/resend-newsletter-audience"
  );
  const audience = await ensureNewsletterAudience();
  if (!audience.ok) {
    return { ok: false, error: audience.error };
  }

  const segmentId = audience.ids.segmentId;
  const topicId = audience.ids.topicId;
  const body: Record<string, unknown> = {
    email,
    unsubscribed: false,
  };
  if (segmentId) {
    body.segments = [{ id: segmentId }];
  }
  if (topicId) {
    body.topics = [{ id: topicId, subscription: "opt_in" }];
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
    return await patchExistingNewsletterContact(apiKey, email, segmentId, topicId);
  }

  return { ok: false, error: errText || `HTTP ${res.status}` };
}

async function patchExistingNewsletterContact(
  apiKey: string,
  email: string,
  segmentId?: string,
  topicId?: string,
): Promise<{ ok: boolean; error?: string }> {
  const encoded = encodeURIComponent(email);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const patchRes = await fetch(`https://api.resend.com/contacts/${encoded}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ unsubscribed: false }),
  });
  if (!patchRes.ok) {
    return {
      ok: false,
      error: (await patchRes.text()) || `HTTP ${patchRes.status}`,
    };
  }

  if (segmentId) {
    const segRes = await fetch(
      `https://api.resend.com/contacts/${encoded}/segments/${segmentId}`,
      { method: "POST", headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!segRes.ok && segRes.status !== 409) {
      return {
        ok: false,
        error: (await segRes.text()) || `HTTP ${segRes.status}`,
      };
    }
  }

  if (topicId) {
    const topRes = await fetch(
      `https://api.resend.com/contacts/${encoded}/topics`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify([{ id: topicId, subscription: "opt_in" }]),
      },
    );
    if (!topRes.ok) {
      return {
        ok: false,
        error: (await topRes.text()) || `HTTP ${topRes.status}`,
      };
    }
  }

  return { ok: true };
}
