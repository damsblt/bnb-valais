import { isAdminAuthenticated } from "@/lib/admin-session";
import { syncReservationReplyTemplates } from "@/lib/resend-template-sync";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 503 },
    );
  }

  try {
    const result = await syncReservationReplyTemplates(apiKey);
    return Response.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
