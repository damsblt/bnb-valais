import { ensureNewsletterAudience } from "@/lib/resend-newsletter-audience";

export const runtime = "nodejs";

/** Idempotent: creates Resend segment/topic and persists IDs in Blob when missing. */
export async function GET() {
  const result = await ensureNewsletterAudience();
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }
  return Response.json({
    ok: true,
    created: result.created,
    hasSegment: Boolean(result.ids.segmentId),
    hasTopic: Boolean(result.ids.topicId),
  });
}
