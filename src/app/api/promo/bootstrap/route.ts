import { ensureDefaultPromoCodes } from "@/lib/promo-codes-store";

export const runtime = "nodejs";

/** Initialise promo/codes.json dans le Blob si vide (ex. NOV2026-10). */
export async function GET() {
  try {
    const codes = await ensureDefaultPromoCodes();
    return Response.json({
      ok: true,
      count: codes.length,
      codes: codes.map((c) => ({
        code: c.code,
        label: c.label,
        percentOff: c.percentOff,
        active: c.active,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
