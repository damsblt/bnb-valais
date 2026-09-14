import { readJsonStore, writeJsonStore } from "@/lib/vercel-blob-json";

const RESEND_API = "https://api.resend.com";

export const NEWSLETTER_SEGMENT_NAME = "BnB Valais — Newsletter (opt-in)";
export const NEWSLETTER_TOPIC_NAME = "Actualités BnB Valais";
const TOPIC_DESCRIPTION =
  "Nouvelles et infos du Nid de la Sittelle (inscription confirmée sur le site).";

const BLOB_PATH = "admin/resend-newsletter-audience.json";
const DEV_FILE = "resend-newsletter-audience.json";

export type NewsletterAudienceIds = {
  segmentId: string;
  topicId: string;
  ensuredAt: string;
};

type AudienceStore = Partial<NewsletterAudienceIds>;

async function resendFetch<T>(
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}: ${text}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

async function findOrCreateSegment(apiKey: string): Promise<string> {
  const list = await resendFetch<{ data?: { id: string; name: string }[] }>(
    apiKey,
    "/segments",
  );
  const existing = list.data?.find((s) => s.name === NEWSLETTER_SEGMENT_NAME);
  if (existing?.id) return existing.id;

  const created = await resendFetch<{ id: string }>(apiKey, "/segments", {
    method: "POST",
    body: JSON.stringify({ name: NEWSLETTER_SEGMENT_NAME }),
  });
  return created.id;
}

async function findOrCreateTopic(apiKey: string): Promise<string> {
  const list = await resendFetch<{ data?: { id: string; name: string }[] }>(
    apiKey,
    "/topics",
  );
  const existing = list.data?.find((t) => t.name === NEWSLETTER_TOPIC_NAME);
  if (existing?.id) return existing.id;

  const created = await resendFetch<{ id: string }>(apiKey, "/topics", {
    method: "POST",
    body: JSON.stringify({
      name: NEWSLETTER_TOPIC_NAME,
      description: TOPIC_DESCRIPTION,
      default_subscription: "opt_out",
      visibility: "public",
    }),
  });
  return created.id;
}

export async function readStoredNewsletterAudience(): Promise<AudienceStore> {
  return readJsonStore<AudienceStore>(BLOB_PATH, DEV_FILE, {});
}

/** Env vars override Blob (Vercel dashboard is source of truth when set). */
export async function resolveNewsletterAudienceIds(): Promise<{
  segmentId?: string;
  topicId?: string;
  source: "env" | "blob" | "none";
}> {
  const fromEnv = {
    segmentId: process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim(),
    topicId: process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim(),
  };
  if (fromEnv.segmentId && fromEnv.topicId) {
    return { ...fromEnv, source: "env" };
  }

  const stored = await readStoredNewsletterAudience();
  if (stored.segmentId && stored.topicId) {
    return {
      segmentId: stored.segmentId,
      topicId: stored.topicId,
      source: "blob",
    };
  }

  return {
    segmentId: fromEnv.segmentId,
    topicId: fromEnv.topicId,
    source: "none",
  };
}

export async function ensureNewsletterAudience(): Promise<
  | { ok: true; ids: NewsletterAudienceIds; created: boolean }
  | { ok: false; error: string }
> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const envSegment = process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim();
  const envTopic = process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim();
  if (envSegment && envTopic) {
    return {
      ok: true,
      created: false,
      ids: {
        segmentId: envSegment,
        topicId: envTopic,
        ensuredAt: new Date().toISOString(),
      },
    };
  }

  const stored = await readStoredNewsletterAudience();
  if (stored.segmentId && stored.topicId) {
    return {
      ok: true,
      created: false,
      ids: {
        segmentId: stored.segmentId,
        topicId: stored.topicId,
        ensuredAt: stored.ensuredAt ?? new Date().toISOString(),
      },
    };
  }

  try {
    const segmentId = envSegment ?? (await findOrCreateSegment(apiKey));
    const topicId = envTopic ?? (await findOrCreateTopic(apiKey));
    const ids: NewsletterAudienceIds = {
      segmentId,
      topicId,
      ensuredAt: new Date().toISOString(),
    };
    await writeJsonStore(BLOB_PATH, DEV_FILE, ids);
    return { ok: true, ids, created: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

export function vercelEnvSuggestions(ids: NewsletterAudienceIds): Record<
  string,
  string
> {
  return {
    NEXT_PUBLIC_SITE_URL: "https://www.bnb-valais.ch",
    RESEND_NEWSLETTER_SEGMENT_ID: ids.segmentId,
    RESEND_NEWSLETTER_TOPIC_ID: ids.topicId,
    NEWSLETTER_FROM_EMAIL:
      "Le Nid de la Sittelle <newsletter@bnb-valais.ch>",
  };
}
