import {
  isAcceptedStorageConfigured,
  listAcceptedDayKeys,
} from "@/lib/accepted-stays-store";
import { getOccupiedDates } from "@/lib/calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [{ occupied, sources, feeds }, accepted] = await Promise.all([
    getOccupiedDates(),
    listAcceptedDayKeys(),
  ]);

  return Response.json(
    {
      occupied,
      accepted,
      acceptedStorageConfigured: isAcceptedStorageConfigured(),
      sources,
      feeds,
      syncedAt: new Date().toISOString(),
      configured: sources.length > 0,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
