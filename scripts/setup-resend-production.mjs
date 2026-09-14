#!/usr/bin/env node
/**
 * Best-practice Resend setup for bnb-valais.ch
 * - Publish reservation email templates (with IBAN block)
 * - Create newsletter Segment + Topic (opt-in audience)
 *
 * Usage:
 *   RESEND_API_KEY=re_… npm run setup:resend
 *
 * Then add printed IDs to Vercel (Production).
 */

const API = "https://api.resend.com";

const SEGMENT_NAME = "BnB Valais — Newsletter (opt-in)";
const TOPIC_NAME = "Actualités BnB Valais";
const TOPIC_DESCRIPTION =
  "Nouvelles et infos du Nid de la Sittelle (inscription confirmée sur le site).";

async function api(path, options = {}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error("Missing RESEND_API_KEY");
    process.exit(1);
  }
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} → ${res.status}: ${text}`);
  }
  return json;
}

async function listSegments() {
  const res = await api("/segments");
  return res?.data ?? [];
}

async function listTopics() {
  const res = await api("/topics");
  return res?.data ?? [];
}

async function ensureSegment() {
  const existing = (await listSegments()).find((s) => s.name === SEGMENT_NAME);
  if (existing?.id) {
    console.log(`Segment exists: ${SEGMENT_NAME} → ${existing.id}`);
    return existing.id;
  }
  const created = await api("/segments", {
    method: "POST",
    body: JSON.stringify({ name: SEGMENT_NAME }),
  });
  console.log(`Created segment: ${SEGMENT_NAME} → ${created.id}`);
  return created.id;
}

async function ensureTopic() {
  const existing = (await listTopics()).find((t) => t.name === TOPIC_NAME);
  if (existing?.id) {
    console.log(`Topic exists: ${TOPIC_NAME} → ${existing.id}`);
    return existing.id;
  }
  const created = await api("/topics", {
    method: "POST",
    body: JSON.stringify({
      name: TOPIC_NAME,
      description: TOPIC_DESCRIPTION,
      default_subscription: "opt_out",
      visibility: "public",
    }),
  });
  console.log(`Created topic: ${TOPIC_NAME} → ${created.id}`);
  return created.id;
}

async function main() {
  console.log("=== Resend production setup (BnB Valais) ===\n");

  const segmentId = await ensureSegment();
  const topicId = await ensureTopic();

  console.log("\n=== Sync reservation templates ===\n");
  const { spawnSync } = await import("node:child_process");
  const sync = spawnSync("node", ["scripts/sync-resend-templates.mjs"], {
    stdio: "inherit",
    env: process.env,
  });
  if (sync.status !== 0) {
    process.exit(sync.status ?? 1);
  }

  const siteUrl = "https://www.bnb-valais.ch";

  console.log("\n=== Add these on Vercel → Project → Settings → Environment Variables (Production) ===\n");
  console.log(`NEXT_PUBLIC_SITE_URL=${siteUrl}`);
  console.log(`RESEND_NEWSLETTER_SEGMENT_ID=${segmentId}`);
  console.log(`RESEND_NEWSLETTER_TOPIC_ID=${topicId}`);
  console.log(
    "NEWSLETTER_FROM_EMAIL=Le Nid de la Sittelle <newsletter@bnb-valais.ch>",
  );
  console.log(
    "RESERVATION_FROM_EMAIL=Le Nid de la Sittelle <reservations@bnb-valais.ch>",
  );
  console.log("\nKeep separate:");
  console.log("- reservations@… → transactional (accept/refuse, opt-in mail)");
  console.log("- newsletter@…   → optional From for broadcasts in dashboard");
  console.log("\nThen: Vercel → Deployments → Redeploy\n");
  console.log(
    "Broadcasts: Resend dashboard → Broadcasts → segment «",
    SEGMENT_NAME,
    "» + topic «",
    TOPIC_NAME,
    "» + {{{RESEND_UNSUBSCRIBE_URL}}}\n",
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
