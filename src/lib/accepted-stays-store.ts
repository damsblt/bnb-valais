import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put, type PutCommandOptions } from "@vercel/blob";
import { enumerateNights } from "@/lib/typeform-prefill";

type ReplyAction = "accept" | "reject";

export type AcceptedStay = {
  responseId: string;
  checkIn: string;
  checkOut: string;
  acceptedAt: string;
  guestLabel?: string;
};

export type ReservationDecision = {
  responseId: string;
  action: ReplyAction;
  decidedAt: string;
};

type ReservationStateStore = {
  stays: AcceptedStay[];
  decisions: ReservationDecision[];
};

const STATE_BLOB_PATH = "admin/reservation-state.json";
const LEGACY_STAYS_BLOB_PATH = "calendar/accepted-stays.json";
const DEV_FILE = path.join(process.cwd(), ".data/reservation-state.json");
const LEGACY_DEV_FILE = path.join(process.cwd(), ".data/accepted-stays.json");

function blobCredentials(): {
  configured: boolean;
  token?: string;
  storeId?: string;
} {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  return {
    configured: Boolean(token || storeId),
    token: token || undefined,
    storeId: storeId || undefined,
  };
}

function blobPutOptions(): PutCommandOptions {
  const { token, storeId } = blobCredentials();
  return {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
    token,
    storeId,
  };
}

function emptyStore(): ReservationStateStore {
  return { stays: [], decisions: [] };
}

function normalizeStore(raw: Partial<ReservationStateStore>): ReservationStateStore {
  return {
    stays: raw.stays ?? [],
    decisions: raw.decisions ?? [],
  };
}

async function readBlobJson(pathname: string): Promise<unknown | null> {
  try {
    const { token, storeId } = blobCredentials();
    const result = await get(pathname, {
      access: "private",
      token,
      storeId,
      useCache: false,
    });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function writeBlobJson(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), blobPutOptions());
}

async function readFromBlob(): Promise<ReservationStateStore> {
  const stateRaw = await readBlobJson(STATE_BLOB_PATH);
  if (stateRaw) {
    return normalizeStore(stateRaw as Partial<ReservationStateStore>);
  }

  const legacyRaw = await readBlobJson(LEGACY_STAYS_BLOB_PATH);
  if (legacyRaw && typeof legacyRaw === "object" && legacyRaw !== null) {
    const legacy = legacyRaw as { stays?: AcceptedStay[] };
    if (legacy.stays?.length) {
      return { stays: legacy.stays, decisions: [] };
    }
  }

  return emptyStore();
}

async function writeToBlob(store: ReservationStateStore): Promise<void> {
  await writeBlobJson(STATE_BLOB_PATH, store);
}

async function readFromDevFile(): Promise<ReservationStateStore> {
  try {
    const raw = await readFile(DEV_FILE, "utf8");
    return normalizeStore(JSON.parse(raw) as Partial<ReservationStateStore>);
  } catch {
    try {
      const legacy = await readFile(LEGACY_DEV_FILE, "utf8");
      const parsed = JSON.parse(legacy) as { stays?: AcceptedStay[] };
      return { stays: parsed.stays ?? [], decisions: [] };
    } catch {
      return emptyStore();
    }
  }
}

async function writeToDevFile(store: ReservationStateStore): Promise<void> {
  await mkdir(path.dirname(DEV_FILE), { recursive: true });
  await writeFile(DEV_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function readStore(): Promise<ReservationStateStore> {
  if (blobCredentials().configured) return readFromBlob();
  if (process.env.NODE_ENV === "development") return readFromDevFile();
  return emptyStore();
}

async function writeStore(store: ReservationStateStore): Promise<void> {
  if (blobCredentials().configured) {
    await writeToBlob(store);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    await writeToDevFile(store);
    return;
  }
  throw new Error(
    "Stockage Blob non configuré — liez le store « bnb-valais-blob » au projet Vercel (Storage → Connect) pour enregistrer les séjours acceptés, puis redéployez.",
  );
}

export async function listAcceptedStays(): Promise<AcceptedStay[]> {
  const store = await readStore();
  return store.stays;
}

export async function listReservationDecisions(): Promise<ReservationDecision[]> {
  const store = await readStore();
  return store.decisions;
}

export async function listAcceptedDayKeys(): Promise<string[]> {
  const stays = await listAcceptedStays();
  const keys = new Set<string>();
  for (const stay of stays) {
    for (const day of enumerateNights(stay.checkIn, stay.checkOut)) {
      keys.add(day);
    }
  }
  return [...keys].sort();
}

export async function recordReservationOutcome(input: {
  responseId: string;
  action: ReplyAction;
  stay?: {
    checkIn: string;
    checkOut: string;
    guestLabel?: string;
  };
}): Promise<void> {
  const store = await readStore();
  const decidedAt = new Date().toISOString();

  const decisions = store.decisions.filter(
    (d) => d.responseId !== input.responseId,
  );
  decisions.push({
    responseId: input.responseId,
    action: input.action,
    decidedAt,
  });

  let stays = store.stays.filter((s) => s.responseId !== input.responseId);

  if (input.action === "accept" && input.stay) {
    stays.push({
      responseId: input.responseId,
      checkIn: input.stay.checkIn,
      checkOut: input.stay.checkOut,
      acceptedAt: decidedAt,
      guestLabel: input.stay.guestLabel,
    });
  }

  await writeStore({ stays, decisions });
}

/** Retire l’orange du calendrier public sans effacer la décision « acceptée ». */
export async function releaseCalendarDates(responseId: string): Promise<boolean> {
  const store = await readStore();
  const before = store.stays.length;
  const stays = store.stays.filter((s) => s.responseId !== responseId);
  if (stays.length === before) return false;
  await writeStore({ stays, decisions: store.decisions });
  return true;
}

/** @deprecated Use recordReservationOutcome */
export async function recordAcceptedStay(input: {
  responseId: string;
  checkIn: string;
  checkOut: string;
  guestLabel?: string;
}): Promise<void> {
  await recordReservationOutcome({
    responseId: input.responseId,
    action: "accept",
    stay: {
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guestLabel: input.guestLabel,
    },
  });
}

/** @deprecated Use recordReservationOutcome */
export async function removeAcceptedStay(responseId: string): Promise<void> {
  await recordReservationOutcome({ responseId, action: "reject" });
}

export function isAcceptedStorageConfigured(): boolean {
  return blobCredentials().configured || process.env.NODE_ENV === "development";
}
