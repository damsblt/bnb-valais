import {
  emptyNightPricingStore,
  expandRulesToPricesByGuests,
  normalizeNightPricingRule,
  pricingRangeEnd,
  type NightPricingStore,
  type PricesByNightAndGuests,
} from "@/lib/night-pricing";
import {
  loadPilotagePricingRules,
  PILOTAGE_PRICING_META,
} from "@/lib/pilotage-pricing-bundle";
import {
  blobCredentials,
  isBlobStorageConfigured,
  readJsonStore,
  writeJsonStore,
} from "@/lib/vercel-blob-json";

const BLOB_PATH = "pricing/night-rules.json";
const DEV_FILE = "night-pricing.json";

function normalizeStore(raw: NightPricingStore): NightPricingStore {
  const bundleRevision =
    typeof raw.bundleRevision === "string" && raw.bundleRevision.trim()
      ? raw.bundleRevision.trim()
      : undefined;
  return {
    currency: "CHF",
    rules: (raw.rules ?? []).map(normalizeNightPricingRule),
    bundleRevision,
  };
}

function withBundledRules(store: NightPricingStore): NightPricingStore | null {
  if (store.bundleRevision === PILOTAGE_PRICING_META.revision) return null;
  const rules = loadPilotagePricingRules();
  if (!rules?.length) return null;
  return {
    ...store,
    rules,
    bundleRevision: PILOTAGE_PRICING_META.revision,
  };
}

export async function readNightPricingStore(): Promise<NightPricingStore> {
  const raw = await readJsonStore<NightPricingStore>(
    BLOB_PATH,
    DEV_FILE,
    emptyNightPricingStore(),
  );
  const store = normalizeStore(raw);
  const synced = withBundledRules(store);
  if (!synced) return store;
  // Une lecture Blob ratée ressemble à une grille vide : on affiche la grille
  // Excel, sans écraser un fichier qu’on n’a pas pu lire.
  if (store.rules.length === 0 && blobCredentials().configured) return synced;
  if (!isNightPricingStorageConfigured()) return synced;
  try {
    await writeNightPricingStore(synced);
  } catch (err) {
    console.warn(
      "[night-pricing] grille Excel non publiée",
      err instanceof Error ? err.message : err,
    );
  }
  return synced;
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
