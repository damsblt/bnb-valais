import {
  isAcceptedStorageConfigured,
  listAcceptedDayKeys,
} from "@/lib/accepted-stays-store";
import { getOccupiedDates } from "@/lib/calendar";
import { readPublicPricesByNight } from "@/lib/night-pricing-store";
import { privateStayOffer } from "@/lib/private-booking-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = new URL(request.url).searchParams.get("access");
  const [{ occupied, sources, feeds }, accepted, pricing] = await Promise.all([
    getOccupiedDates(access),
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
      privateOffer: privateStayOffer(access),
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
