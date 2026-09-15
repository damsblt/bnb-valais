import {
  emptyNightPricingStore,
  expandRulesToPricesByGuests,
  normalizeNightPricingRule,
  pricingRangeEnd,
  type NightPricingStore,
  type PricesByNightAndGuests,
} from "@/lib/night-pricing";
import {
  isBlobStorageConfigured,
  readJsonStore,
  writeJsonStore,
} from "@/lib/vercel-blob-json";

const BLOB_PATH = "pricing/night-rules.json";
const DEV_FILE = "night-pricing.json";

function normalizeStore(raw: NightPricingStore): NightPricingStore {
  return {
    currency: "CHF",
    rules: (raw.rules ?? []).map(normalizeNightPricingRule),
  };
}

export async function readNightPricingStore(): Promise<NightPricingStore> {
  const raw = await readJsonStore<NightPricingStore>(
    BLOB_PATH,
    DEV_FILE,
    emptyNightPricingStore(),
  );
  return normalizeStore(raw);
}

export async function writeNightPricingStore(
  store: NightPricingStore,
): Promise<void> {
  await writeJsonStore(BLOB_PATH, DEV_FILE, normalizeStore(store));
}

export async function readPublicPricesByNight(): Promise<{
  currency: "CHF";
  pricesByNight: PricesByNightAndGuests;
}> {
  const store = await readNightPricingStore();
  const from = new Date().toISOString().slice(0, 10);
  const to = pricingRangeEnd(from);
  return {
    currency: store.currency,
    pricesByNight: expandRulesToPricesByGuests(store.rules, from, to),
  };
}

export function isNightPricingStorageConfigured(): boolean {
  return isBlobStorageConfigured();
}
