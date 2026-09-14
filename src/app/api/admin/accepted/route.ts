import {
  isAcceptedStorageConfigured,
  listAcceptedStays,
  listReservationDecisions,
} from "@/lib/accepted-stays-store";
import { isAdminAuthenticated } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [stays, decisions] = await Promise.all([
    listAcceptedStays(),
    listReservationDecisions(),
  ]);

  return Response.json({
    stays,
    decisions,
    storageConfigured: isAcceptedStorageConfigured(),
  });
}
