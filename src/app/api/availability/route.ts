import { getOccupiedDates } from "@/lib/calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { occupied, sources, feeds } = await getOccupiedDates();

  return Response.json(
    {
      occupied,
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
