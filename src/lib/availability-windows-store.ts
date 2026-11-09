import { randomUUID } from "node:crypto";
import {
  sanitizeAvailabilityWindow,
  type AvailabilityWindow,
  type AvailabilityWindowStatus,
} from "@/lib/availability-windows";
import { readJsonStore, writeJsonStore } from "@/lib/vercel-blob-json";

type AvailabilityWindowStore = {
  windows: AvailabilityWindow[];
};

const BLOB_PATH = "calendar/availability-windows.json";
const DEV_FILE = "availability-windows.json";

export async function readAvailabilityWindows(): Promise<AvailabilityWindow[]> {
  const store = await readJsonStore<AvailabilityWindowStore>(BLOB_PATH, DEV_FILE, {
    windows: [],
  });
  return (store.windows ?? [])
    .map((window) => sanitizeAvailabilityWindow(window))
    .filter((window): window is AvailabilityWindow => window !== null);
}

async function writeAvailabilityWindows(windows: AvailabilityWindow[]): Promise<void> {
  await writeJsonStore(BLOB_PATH, DEV_FILE, { windows });
}

export async function addAvailabilityWindow(input: {
  from: string;
  to: string;
  status: AvailabilityWindowStatus;
}): Promise<AvailabilityWindow | null> {
  const window = sanitizeAvailabilityWindow({
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  });
  if (!window) return null;
  const windows = await readAvailabilityWindows();
  windows.push(window);
  await writeAvailabilityWindows(windows);
  return window;
}

export async function deleteAvailabilityWindow(id: string): Promise<boolean> {
  const windows = await readAvailabilityWindows();
  const next = windows.filter((window) => window.id !== id);
  if (next.length === windows.length) return false;
  await writeAvailabilityWindows(next);
  return true;
}
