import { getOccupiedDates } from "@/lib/calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { occupied, sources } = await getOccupiedDates();

  return Response.json({
    occupied,
    sources,
    syncedAt: new Date().toISOString(),
    configured: sources.length > 0,
  });
}
