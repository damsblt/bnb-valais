import { isAdminAuthenticated } from "@/lib/admin-session";
import {
  ensureNewsletterAudience,
  vercelEnvSuggestions,
} from "@/lib/resend-newsletter-audience";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await ensureNewsletterAudience();
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    created: result.created,
    audience: result.ids,
    vercelProductionEnv: vercelEnvSuggestions(result.ids),
  });
}
