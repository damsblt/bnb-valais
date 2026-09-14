import { isAdminAuthenticated } from "@/lib/admin-session";
import { fetchReservationRequests } from "@/lib/typeform";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await fetchReservationRequests();
    return Response.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Typeform error";
    return Response.json({ error: message, items: [] }, { status: 502 });
  }
}
