#!/usr/bin/env node
/**
 * Push newsletter env vars to Vercel Production (requires Full Account token).
 *
 *   RESEND_API_KEY=re_… VERCEL_TOKEN=… npm run setup:resend
 *   VERCEL_TOKEN=… VERCEL_TEAM_ID=team_… VERCEL_PROJECT=bnb-valais \
 *     node scripts/vercel-set-newsletter-env.mjs --segment=… --topic=…
 */

const TEAM = process.env.VERCEL_TEAM_ID?.trim();
const PROJECT = process.env.VERCEL_PROJECT?.trim() || "bnb-valais";
const TOKEN = process.env.VERCEL_TOKEN?.trim();

function parseArgs() {
  const out = {};
  for (const arg of process.argv.slice(2)) {
    const m = arg.match(/^--(\w+)=(.+)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

async function vercelApi(path, options = {}) {
  const url = new URL(`https://api.vercel.com${path}`);
  if (TEAM) url.searchParams.set("teamId", TEAM);
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} → ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function upsertEnv(key, value, type = "plain") {
  const existing = await vercelApi(
    `/v9/projects/${PROJECT}/env?decrypt=true`,
  );
  const envs = existing?.envs ?? existing ?? [];
  const list = Array.isArray(envs) ? envs : [];
  const found = list.find(
    (e) => e.key === key && (e.target ?? e.targets)?.includes?.("production"),
  );

  if (found?.id) {
    await vercelApi(`/v9/projects/${PROJECT}/env/${found.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        value,
        target: ["production"],
        type,
      }),
    });
    console.log(`Updated ${key}`);
    return;
  }

  await vercelApi(`/v10/projects/${PROJECT}/env`, {
    method: "POST",
    body: JSON.stringify({
      key,
      value,
      type,
      target: ["production"],
    }),
  });
  console.log(`Created ${key}`);
}

async function main() {
  if (!TOKEN) {
    console.error("Missing VERCEL_TOKEN (Full Account scope from vercel.com/account/tokens)");
    process.exit(1);
  }

  const args = parseArgs();
  const segment = args.segment;
  const topic = args.topic;
  if (!segment || !topic) {
    console.error("Usage: --segment=… --topic=…");
    process.exit(1);
  }

  const vars = {
    NEXT_PUBLIC_SITE_URL: "https://www.bnb-valais.ch",
    RESEND_NEWSLETTER_SEGMENT_ID: segment,
    RESEND_NEWSLETTER_TOPIC_ID: topic,
    NEWSLETTER_FROM_EMAIL: "Le Nid de la Sittelle <newsletter@bnb-valais.ch>",
  };

  for (const [key, value] of Object.entries(vars)) {
    await upsertEnv(key, value);
  }

  console.log("\nDone. Redeploy Production on Vercel.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
