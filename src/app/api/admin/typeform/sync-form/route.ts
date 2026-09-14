import { isAdminAuthenticated } from "@/lib/admin-session";
import { ensureTypeformPrefillOnForm } from "@/lib/typeform-form-setup";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ensureTypeformPrefillOnForm();
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return Response.json({ ok: false, detail: message }, { status: 502 });
  }
}
