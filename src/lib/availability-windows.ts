import { addDays } from "@/lib/typeform-prefill";

export type AvailabilityWindowStatus = "open" | "closed";

export type AvailabilityWindow = {
  id: string;
  /** Première nuit incluse (YYYY-MM-DD). */
  from: string;
  /** Dernière nuit incluse (YYYY-MM-DD). */
  to: string;
  status: AvailabilityWindowStatus;
  createdAt: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizeAvailabilityWindow(
  input: Partial<AvailabilityWindow>,
): AvailabilityWindow | null {
  const from = input.from?.trim().slice(0, 10) ?? "";
  const to = input.to?.trim().slice(0, 10) ?? "";
  if (!ISO_DATE.test(from) || !ISO_DATE.test(to) || from > to) return null;

  const status = input.status === "closed" ? "closed" : input.status === "open" ? "open" : null;
  if (!status) return null;

  const id = (input.id ?? "").trim();
  if (!id || id.length > 80) return null;

  const createdAt = input.createdAt?.trim() || new Date().toISOString();
  return { id, from, to, status, createdAt };
}

/** Les fenêtres s’appliquent dans l’ordre de création : la plus récente gagne. */
export function applyAvailabilityWindows(
  occupied: Set<string>,
  windows: AvailabilityWindow[],
): void {
  const sorted = [...windows].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
  for (const window of sorted) {
    for (let night = window.from; night <= window.to; night = addDays(night, 1)) {
      if (window.status === "open") occupied.delete(night);
      else occupied.add(night);
    }
  }
}
