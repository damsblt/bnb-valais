const PROPERTY_TIMEZONE = "Europe/Zurich";

function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

/** iCal DATE or DATE-TIME → YYYY-MM-DD (calendar date in property timezone when time is present) */
function parseIcalDateLine(line: string): string | null {
  const value = line.split(":").pop()?.trim();
  if (!value) return null;

  const dateOnly = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateOnly) {
    return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`;
  }

  const dateTime = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (dateTime) {
    const [, y, mo, d, h, mi, s] = dateTime;
    const utc = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)));
    return utc.toLocaleDateString("en-CA", { timeZone: PROPERTY_TIMEZONE });
  }

  return null;
}

function unfoldIcal(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

export function parseOccupiedDaysFromIcal(text: string): string[] {
  const unfolded = unfoldIcal(text);
  const occupied = new Set<string>();

  for (const block of unfolded.split("BEGIN:VEVENT").slice(1)) {
    const startLine = block.match(/^DTSTART[^\n]*/m)?.[0];
    const endLine = block.match(/^DTEND[^\n]*/m)?.[0];
    if (!startLine || !endLine) continue;

    const start = parseIcalDateLine(startLine);
    const end = parseIcalDateLine(endLine);
    if (!start || !end) continue;

    let cursor = start;
    while (cursor < end) {
      occupied.add(cursor);
      cursor = addDays(cursor, 1);
    }
  }

  return [...occupied];
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
  return parseOccupiedDaysFromIcal(text);
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
