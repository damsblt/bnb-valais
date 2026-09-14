const PROPERTY_TIMEZONE = "Europe/Zurich";

function toDateKey(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: PROPERTY_TIMEZONE });
}

function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

/** iCal end is exclusive for all-day / blocked periods */
function eachOccupiedDay(start: Date, end: Date): string[] {
  const days: string[] = [];
  let cursor = toDateKey(start);
  const endKey = toDateKey(end);

  while (cursor < endKey) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}

async function fetchIcalText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      Accept: "text/calendar,text/plain,*/*",
      "User-Agent":
        "Mozilla/5.0 (compatible; LeNidDeLaSittelle/1.0; +https://www.bnb-valais.ch)",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.text();
}

async function fetchOccupiedFromUrl(url: string): Promise<string[]> {
  const text = await fetchIcalText(url);
  const mod = await import("node-ical");
  const ical = mod.default ?? mod;
  const data = ical.parseICS(text);
  const occupied = new Set<string>();

  for (const item of Object.values(data)) {
    if (!item || typeof item !== "object" || item.type !== "VEVENT") continue;
    const start = item.start;
    const end = item.end;
    if (!start || !end) continue;

    for (const day of eachOccupiedDay(new Date(start), new Date(end))) {
      occupied.add(day);
    }
  }

  return [...occupied];
}

export type FeedSyncResult = {
  name: string;
  ok: boolean;
  error?: string;
  count?: number;
};

export async function getOccupiedDates(): Promise<{
  occupied: string[];
  sources: string[];
  feeds: FeedSyncResult[];
}> {
  const sources: { name: string; url: string | undefined }[] = [
    { name: "booking", url: process.env.BOOKING_ICAL_URL?.trim() },
    { name: "airbnb", url: process.env.AIRBNB_ICAL_URL?.trim() },
  ];

  const active = sources.filter((s) => s.url);
  const occupied = new Set<string>();
  const feeds: FeedSyncResult[] = [];

  await Promise.all(
    active.map(async (source) => {
      try {
        const dates = await fetchOccupiedFromUrl(source.url!);
        dates.forEach((d) => occupied.add(d));
        feeds.push({ name: source.name, ok: true, count: dates.length });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Sync failed";
        feeds.push({ name: source.name, ok: false, error: message });
      }
    }),
  );

  return {
    occupied: [...occupied].sort(),
    sources: active.map((s) => s.name),
    feeds,
  };
}
