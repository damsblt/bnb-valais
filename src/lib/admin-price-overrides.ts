import { randomUUID } from "node:crypto";
import { sanitizeNightPricingRule } from "@/lib/night-pricing-admin";
import type { GuestNightPrices, NightPricingRule } from "@/lib/night-pricing";
import { readJsonStore, writeJsonStore } from "@/lib/vercel-blob-json";

type OverrideStore = {
  rules: NightPricingRule[];
};

const BLOB_PATH = "pricing/admin-night-overrides.json";
const DEV_FILE = "admin-night-overrides.json";

export async function readAdminPriceOverrides(): Promise<NightPricingRule[]> {
  const store = await readJsonStore<OverrideStore>(BLOB_PATH, DEV_FILE, {
    rules: [],
  });
  return (store.rules ?? [])
    .map((rule) => sanitizeNightPricingRule(rule))
    .filter((rule): rule is NightPricingRule => rule !== null);
}

export async function addAdminPriceOverride(input: {
  from: string;
  to: string;
  pricesByGuests: GuestNightPrices;
}): Promise<NightPricingRule | null> {
  const rule = sanitizeNightPricingRule({
    id: `admin-cal-${randomUUID()}`,
    from: input.from,
    to: input.to,
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    pricesByGuests: input.pricesByGuests,
    createdAt: new Date().toISOString(),
  });
  if (!rule) return null;
  const rules = await readAdminPriceOverrides();
  rules.push(rule);
  await writeJsonStore(BLOB_PATH, DEV_FILE, { rules });
  return rule;
}
