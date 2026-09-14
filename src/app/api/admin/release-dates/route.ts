import {
  isAcceptedStorageConfigured,
  releaseCalendarDates,
} from "@/lib/accepted-stays-store";
import { isAdminAuthenticated } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { responseId?: string };
  const responseId = body.responseId?.trim();
  if (!responseId) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isAcceptedStorageConfigured()) {
    return Response.json(
      { error: "Blob non configuré sur ce serveur." },
      { status: 503 },
    );
  }

  try {
    const released = await releaseCalendarDates(responseId);
    if (!released) {
      return Response.json(
        { error: "Aucune date orange enregistrée pour cette demande." },
        { status: 404 },
      );
    }
    return Response.json({ released: true, responseId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Blob";
    return Response.json({ error: message }, { status: 502 });
  }
}
