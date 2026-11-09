import { isAdminAuthenticated } from "@/lib/admin-session";
import { loadOpenOverrideRanges } from "@/lib/calendar";
import {
  addAvailabilityWindow,
  deleteAvailabilityWindow,
  readAvailabilityWindows,
} from "@/lib/availability-windows-store";
import { isAcceptedStorageConfigured } from "@/lib/accepted-stays-store";
import type { AvailabilityWindowStatus } from "@/lib/availability-windows";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const windows = await readAvailabilityWindows();
  return Response.json({
    windows,
    seededOpens: loadOpenOverrideRanges(),
    storageConfigured: isAcceptedStorageConfigured(),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    from?: string;
    to?: string;
    status?: AvailabilityWindowStatus;
  } | null;

  if (!body || (body.status !== "open" && body.status !== "closed")) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const window = await addAvailabilityWindow({
    from: body.from ?? "",
    to: body.to ?? "",
    status: body.status,
  });
  if (!window) {
    return Response.json({ error: "Invalid dates" }, { status: 400 });
  }

  return Response.json({ ok: true, window });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id?.trim() ?? "";
  if (!id) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const removed = await deleteAvailabilityWindow(id);
  if (!removed) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
