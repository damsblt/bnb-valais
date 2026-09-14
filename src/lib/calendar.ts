function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function eachDayBetween(start: Date, end: Date): string[] {
  const days: string[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);

  const last = new Date(end);
  last.setHours(0, 0, 0, 0);

  // iCal end dates are often exclusive for all-day events
  while (cursor < last) {
    days.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

async function fetchOccupiedFromUrl(url: string): Promise<string[]> {
  const mod = await import("node-ical");
  const ical = mod.default ?? mod;
  const data = await ical.async.fromURL(url);
  const occupied = new Set<string>();

  for (const item of Object.values(data)) {
    if (!item || typeof item !== "object" || item.type !== "VEVENT") continue;
    const start = item.start;
    const end = item.end;
    if (!start || !end) continue;

    for (const day of eachDayBetween(new Date(start), new Date(end))) {
      occupied.add(day);
    }
  }

  return [...occupied];
}

export async function getOccupiedDates(): Promise<{
  occupied: string[];
  sources: string[];
}> {
  const sources: { name: string; url: string | undefined }[] = [
    { name: "booking", url: process.env.BOOKING_ICAL_URL },
    { name: "airbnb", url: process.env.AIRBNB_ICAL_URL },
  ];

  const active = sources.filter((s) => s.url);
  const occupied = new Set<string>();

  await Promise.all(
    active.map(async (source) => {
      try {
        const dates = await fetchOccupiedFromUrl(source.url!);
        dates.forEach((d) => occupied.add(d));
      } catch {
        // Ignore failing feed — calendar still renders
      }
    }),
  );

  return {
    occupied: [...occupied].sort(),
    sources: active.map((s) => s.name),
  };
}
