import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put, type PutCommandOptions } from "@vercel/blob";

export function blobCredentials(): {
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

export async function readJsonStore<T>(
  blobPath: string,
  devFileName: string,
  empty: T,
): Promise<T> {
  if (blobCredentials().configured) {
    const raw = await readBlobJson(blobPath);
    return raw ? (raw as T) : empty;
  }
  if (process.env.NODE_ENV === "development") {
    const devFile = path.join(process.cwd(), ".data", devFileName);
    try {
      const raw = await readFile(devFile, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return empty;
    }
  }
  return empty;
}

export async function writeJsonStore<T>(
  blobPath: string,
  devFileName: string,
  data: T,
): Promise<void> {
  if (blobCredentials().configured) {
    await writeBlobJson(blobPath, data);
    return;
  }
  if (process.env.NODE_ENV === "development") {
    const devFile = path.join(process.cwd(), ".data", devFileName);
    await mkdir(path.dirname(devFile), { recursive: true });
    await writeFile(devFile, JSON.stringify(data, null, 2), "utf8");
    return;
  }
  throw new Error("BLOB_READ_WRITE_TOKEN missing");
}

export function isBlobStorageConfigured(): boolean {
  return blobCredentials().configured || process.env.NODE_ENV === "development";
}
