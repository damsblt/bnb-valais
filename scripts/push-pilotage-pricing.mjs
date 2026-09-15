#!/usr/bin/env node
/**
 * Écrit la grille pilotage dans Vercel Blob (pricing/night-rules.json).
 * Usage: BLOB_READ_WRITE_TOKEN=… npm run pricing:push-pilotage
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { put } from "@vercel/blob";

const root = path.dirname(fileURLToPath(import.meta.url));
const bundle = path.join(root, "..", "data/pilotage-prix-2026-2027.rules.json");

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    console.error("Missing BLOB_READ_WRITE_TOKEN");
    process.exit(1);
  }
  const body = readFileSync(bundle, "utf8");
  const store = JSON.parse(body);
  await put("pricing/night-rules.json", body, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
    storeId: process.env.BLOB_STORE_ID?.trim(),
  });
  console.log(
    `OK — ${store.rules?.length ?? 0} rules → pricing/night-rules.json`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
