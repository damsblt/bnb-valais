import type { Locale } from "@/lib/i18n";
import { sendNewsletterOptInEmail } from "@/lib/newsletter-mail";
import {
  createNewsletterPending,
  isNewsletterStorageConfigured,
} from "@/lib/newsletter-store";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    locale?: Locale;
    consent?: boolean;
  };

  const email = body.email?.trim() ?? "";
  const locale: Locale = body.locale === "en" ? "en" : "fr";
  const consent = body.consent === true;

  if (!consent || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isNewsletterStorageConfigured()) {
    return Response.json(
      { error: "Newsletter storage not configured" },
      { status: 503 },
    );
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    return Response.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  const pending = await createNewsletterPending(email, locale);

  if ("alreadyConfirmed" in pending) {
    return Response.json({
      ok: true,
      message: "check_inbox",
    });
  }

  const sent = await sendNewsletterOptInEmail({
    email,
    token: pending.token,
    locale,
  });

  if (!sent.sent) {
    return Response.json(
      { error: sent.error ?? "Could not send email" },
      { status: 502 },
    );
  }

  return Response.json({
    ok: true,
    message: "check_inbox",
  });
}
