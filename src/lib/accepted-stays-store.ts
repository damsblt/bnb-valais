import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put, type PutCommandOptions } from "@vercel/blob";
import { enumerateNights } from "@/lib/typeform-prefill";

export type AcceptedStay = {
  responseId: string;
  checkIn: string;
  checkOut: string;
  acceptedAt: string;
  guestLabel?: string;
};

type AcceptedStayStore = {
  stays: AcceptedStay[];
};

const BLOB_PATHNAME = "calendar/accepted-stays.json";
const DEV_FILE = path.join(process.cwd(), ".data/accepted-stays.json");

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

async function readFromBlob(): Promise<AcceptedStayStore> {
  try {
    const { token, storeId } = blobCredentials();
    const result = await get(BLOB_PATHNAME, {
      access: "private",
      token,
      storeId,
      useCache: false,
    });
    if (!result?.stream) return { stays: [] };
    const text = await new Response(result.stream).text();
    const json = JSON.parse(text) as AcceptedStayStore;
    return { stays: json.stays ?? [] };
  } catch {
    return { stays: [] };
  }
}

async function writeToBlob(store: AcceptedStayStore): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store), blobPutOptions());
}

async function readFromDevFile(): Promise<AcceptedStayStore> {
  try {
    const raw = await readFile(DEV_FILE, "utf8");
    const json = JSON.parse(raw) as AcceptedStayStore;
    return { stays: json.stays ?? [] };
  } catch {
    return { stays: [] };
  }
}

async function writeToDevFile(store: AcceptedStayStore): Promise<void> {
  await mkdir(path.dirname(DEV_FILE), { recursive: true });
  await writeFile(DEV_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function readStore(): Promise<AcceptedStayStore> {
  if (blobCredentials().configured) return readFromBlob();
  if (process.env.NODE_ENV === "development") return readFromDevFile();
  return { stays: [] };
}

async function writeStore(store: AcceptedStayStore): Promise<void> {
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

export async function listAcceptedResponseIds(): Promise<string[]> {
  const stays = await listAcceptedStays();
  return stays.map((s) => s.responseId);
}

export async function recordAcceptedStay(input: {
  responseId: string;
  checkIn: string;
  checkOut: string;
  guestLabel?: string;
}): Promise<void> {
  const store = await readStore();
  const next: AcceptedStay = {
    responseId: input.responseId,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    acceptedAt: new Date().toISOString(),
    guestLabel: input.guestLabel,
  };
  const stays = store.stays.filter((s) => s.responseId !== input.responseId);
  stays.push(next);
  await writeStore({ stays });
}

export async function removeAcceptedStay(responseId: string): Promise<void> {
  const store = await readStore();
  const stays = store.stays.filter((s) => s.responseId !== responseId);
  if (stays.length === store.stays.length) return;
  await writeStore({ stays });
}

export function isAcceptedStorageConfigured(): boolean {
  return blobCredentials().configured || process.env.NODE_ENV === "development";
}
