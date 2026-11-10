import { isAdminAuthenticated } from "@/lib/admin-session";
import { addAdminPriceOverrides } from "@/lib/admin-price-overrides";
import {
  expandRulesToPricesByGuests,
  GUEST_COUNTS,
  type GuestNightPrices,
} from "@/lib/night-pricing";
import { readNightPricingStore } from "@/lib/night-pricing-store";
import { addDays } from "@/lib/typeform-prefill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MONTH = /^\d{4}-\d{2}$/;

function monthBounds(month: string): { from: string; to: string } | null {
  if (!MONTH.test(month)) return null;
  const [year, m] = month.split("-").map(Number);
  if (m < 1 || m > 12) return null;
  const from = `${month}-01`;
  const next =
    m === 12 ? `${year + 1}-01-01` : `${year}-${String(m + 1).padStart(2, "0")}-01`;
  return { from, to: addDays(next, -1) };
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const month = new URL(request.url).searchParams.get("month") ?? "";
  const bounds = monthBounds(month);
  if (!bounds) {
    return Response.json({ error: "Invalid month" }, { status: 400 });
  }

  const store = await readNightPricingStore();
  return Response.json({
    currency: store.currency,
    pricesByNight: expandRulesToPricesByGuests(store.rules, bounds.from, bounds.to),
  });
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function groupConsecutiveNights(nights: string[]): { from: string; to: string }[] {
  const unique = [...new Set(nights.filter((night) => ISO_DATE.test(night)))].sort();
  const groups: { from: string; to: string }[] = [];
  let from = "";
  let previous = "";
  for (const night of unique) {
    if (!from) {
      from = previous = night;
      continue;
    }
    if (night === addDays(previous, 1)) {
      previous = night;
      continue;
    }
    groups.push({ from, to: previous });
    from = previous = night;
  }
  if (from) groups.push({ from, to: previous });
  return groups;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    nights?: string[];
    from?: string;
    to?: string;
    pricesByGuests?: Partial<GuestNightPrices>;
  } | null;

  const nights = Array.isArray(body?.nights)
    ? body.nights.map((night) => night.slice(0, 10))
    : body?.from && body?.to
      ? expandRange(body.from.slice(0, 10), body.to.slice(0, 10))
      : [];
  const groups = groupConsecutiveNights(nights);
  if (!groups.length || nights.length > 370) {
    return Response.json({ error: "Invalid dates" }, { status: 400 });
  }

  const prices = {} as GuestNightPrices;
  for (const guests of GUEST_COUNTS) {
    const value = Math.round(Number(body?.pricesByGuests?.[guests]));
    if (!Number.isFinite(value) || value < 1 || value > 5000) {
      return Response.json({ error: "Invalid prices" }, { status: 400 });
    }
    prices[guests] = value;
  }

  const rules = await addAdminPriceOverrides(
    groups.map((group) => ({ ...group, pricesByGuests: prices })),
  );
  if (!rules.length) {
    return Response.json({ error: "Invalid prices" }, { status: 400 });
  }

  return Response.json({ ok: true });
}

function expandRange(from: string, to: string): string[] {
  if (!ISO_DATE.test(from) || !ISO_DATE.test(to) || from > to) return [];
  const nights: string[] = [];
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
    nights.push(cursor);
    if (nights.length > 370) return [];
  }
  return nights;
}
