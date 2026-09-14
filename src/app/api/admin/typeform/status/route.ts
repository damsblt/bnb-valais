import { isAdminAuthenticated } from "@/lib/admin-session";
import { getTypeformFormDateStatus } from "@/lib/typeform-form-setup";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getTypeformFormDateStatus();
    return Response.json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Typeform error";
    return Response.json({ error: message }, { status: 502 });
  }
}
