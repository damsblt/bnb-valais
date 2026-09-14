import { syncPromoNov2026TestTemplate } from "@/lib/resend-template-sync";

export const runtime = "nodejs";

/** Publie le template test promo novembre 2026 sur Resend (idempotent). */
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 503 },
    );
  }

  try {
    const result = await syncPromoNov2026TestTemplate(apiKey);
    return Response.json({ ok: true, template: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
