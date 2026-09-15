import {
  isAcceptedStorageConfigured,
  listAcceptedDayKeys,
} from "@/lib/accepted-stays-store";
import { getOccupiedDates } from "@/lib/calendar";
import { readPublicPricesByNight } from "@/lib/night-pricing-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [{ occupied, sources, feeds }, accepted, pricing] = await Promise.all([
    getOccupiedDates(),
    listAcceptedDayKeys(),
    readPublicPricesByNight(),
  ]);

  return Response.json(
    {
      occupied,
      accepted,
      acceptedStorageConfigured: isAcceptedStorageConfigured(),
      currency: pricing.currency,
      pricesByNight: pricing.pricesByNight,
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
