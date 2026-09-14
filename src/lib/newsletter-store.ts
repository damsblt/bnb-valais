import { createHash, randomBytes } from "node:crypto";
import type { Locale } from "@/lib/i18n";
import {
  isBlobStorageConfigured,
  readJsonStore,
  writeJsonStore,
} from "@/lib/vercel-blob-json";

export type NewsletterPending = {
  token: string;
  email: string;
  locale: Locale;
  createdAt: string;
};

type NewsletterStore = {
  pending: NewsletterPending[];
  confirmedEmails: string[];
};

const BLOB_PATH = "newsletter/signups.json";
const DEV_FILE = "newsletter-signups.json";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function emptyStore(): NewsletterStore {
  return { pending: [], confirmedEmails: [] };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function readStore(): Promise<NewsletterStore> {
  const store = await readJsonStore(BLOB_PATH, DEV_FILE, emptyStore());
  return {
    pending: store.pending ?? [],
    confirmedEmails: store.confirmedEmails ?? [],
  };
}

async function writeStore(store: NewsletterStore): Promise<void> {
  await writeJsonStore(BLOB_PATH, DEV_FILE, store);
}

export function isNewsletterStorageConfigured(): boolean {
  return isBlobStorageConfigured();
}

export async function isNewsletterConfirmed(email: string): Promise<boolean> {
  const store = await readStore();
  return store.confirmedEmails.includes(normalizeEmail(email));
}

export async function createNewsletterPending(
  email: string,
  locale: Locale,
): Promise<{ token: string } | { alreadyConfirmed: true }> {
  const normalized = normalizeEmail(email);
  const store = await readStore();

  if (store.confirmedEmails.includes(normalized)) {
    return { alreadyConfirmed: true };
  }

  const now = Date.now();
  store.pending = store.pending.filter(
    (p) => now - new Date(p.createdAt).getTime() < TOKEN_TTL_MS,
  );

  const token = randomBytes(24).toString("hex");
  store.pending = store.pending.filter((p) => p.email !== normalized);
  store.pending.push({
    token,
    email: normalized,
    locale,
    createdAt: new Date().toISOString(),
  });

  await writeStore(store);
  return { token };
}

export async function consumeNewsletterToken(
  token: string,
): Promise<
  | { ok: true; email: string; locale: Locale }
  | { ok: false; reason: "invalid" | "expired" | "already" }
> {
  const trimmed = token.trim();
  if (!trimmed) return { ok: false, reason: "invalid" };

  const store = await readStore();
  const now = Date.now();
  const entry = store.pending.find((p) => p.token === trimmed);

  if (!entry) {
    if (store.confirmedEmails.length) {
      // Token already used after confirm
      return { ok: false, reason: "already" };
    }
    return { ok: false, reason: "invalid" };
  }

  if (now - new Date(entry.createdAt).getTime() > TOKEN_TTL_MS) {
    store.pending = store.pending.filter((p) => p.token !== trimmed);
    await writeStore(store);
    return { ok: false, reason: "expired" };
  }

  if (store.confirmedEmails.includes(entry.email)) {
    store.pending = store.pending.filter((p) => p.token !== trimmed);
    await writeStore(store);
    return { ok: false, reason: "already" };
  }

  store.pending = store.pending.filter((p) => p.token !== trimmed);
  if (!store.confirmedEmails.includes(entry.email)) {
    store.confirmedEmails.push(entry.email);
  }
  await writeStore(store);

  return { ok: true, email: entry.email, locale: entry.locale };
}

/** Idempotent marker if Resend succeeded but store write failed mid-flight */
export function confirmTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
