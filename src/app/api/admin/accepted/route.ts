import {
  isAcceptedStorageConfigured,
  listAcceptedStays,
} from "@/lib/accepted-stays-store";
import { isAdminAuthenticated } from "@/lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stays = await listAcceptedStays();

  return Response.json({
    stays,
    storageConfigured: isAcceptedStorageConfigured(),
  });
}
