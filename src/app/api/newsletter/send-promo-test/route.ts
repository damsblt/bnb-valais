import { isAdminAuthenticated } from "@/lib/admin-session";
import { sendPromoNov2026TestEmail } from "@/lib/resend-template-sync";

export const runtime = "nodejs";

function defaultTestRecipient(): string {
  return (
    process.env.HOST_CONTACT_EMAIL?.trim() ||
    "info@bnb-valais.ch"
  );
}

/** Envoie le template promo test (admin connecté ou destinataire par défaut). */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const requestedTo = body.to?.trim();
  const isAdmin = await isAdminAuthenticated();

  if (requestedTo && !isAdmin) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const to = requestedTo || defaultTestRecipient();

  try {
    const sent = await sendPromoNov2026TestEmail(apiKey, to);
    return Response.json({ ok: true, ...sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}

/** Même envoi vers HOST_CONTACT_EMAIL (usage interne après mise en prod). */
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 503 },
    );
  }

  const to = defaultTestRecipient();

  try {
    const sent = await sendPromoNov2026TestEmail(apiKey, to);
    return Response.json({ ok: true, ...sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
