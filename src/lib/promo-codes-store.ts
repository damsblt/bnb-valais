import { readJsonStore, writeJsonStore } from "@/lib/vercel-blob-json";

export type PromoCode = {
  /** Normalisé MAJUSCULES sans espaces */
  code: string;
  label: string;
  percentOff: number;
  active: boolean;
  /** Première nuitée incluse (YYYY-MM-DD) */
  validStayFrom?: string;
  /** Dernière nuitée incluse (YYYY-MM-DD) */
  validStayTo?: string;
  maxUses?: number;
  usedCount?: number;
};

type PromoCodeStore = {
  codes: PromoCode[];
};

const BLOB_PATH = "promo/codes.json";
const DEV_FILE = "promo-codes.json";

const DEFAULT_CODES: PromoCode[] = [
  {
    code: "OCT2026-10",
    label: "−10 % — séjour en octobre 2026",
    percentOff: 10,
    active: true,
    validStayFrom: "2026-10-01",
    validStayTo: "2026-10-31",
  },
  {
    code: "NOV2026-10",
    label: "−10 % — séjour en novembre 2026",
    percentOff: 10,
    active: true,
    validStayFrom: "2026-11-01",
    validStayTo: "2026-11-30",
  },
];

export async function readPromoCodes(): Promise<PromoCode[]> {
  const store = await readJsonStore<PromoCodeStore>(BLOB_PATH, DEV_FILE, {
    codes: DEFAULT_CODES,
  });
  if (!store.codes?.length) {
    return DEFAULT_CODES;
  }
  return store.codes;
}

export async function writePromoCodes(codes: PromoCode[]): Promise<void> {
  await writeJsonStore(BLOB_PATH, DEV_FILE, { codes });
}

export async function ensureDefaultPromoCodes(): Promise<PromoCode[]> {
  const existing = await readPromoCodes();
  const byCode = new Map(
    existing.map((code) => [normalizePromoCode(code.code), code]),
  );
  let changed = false;
  for (const def of DEFAULT_CODES) {
    const key = normalizePromoCode(def.code);
    if (!byCode.has(key)) {
      byCode.set(key, def);
      changed = true;
    }
  }
  const codes = [...byCode.values()];
  if (changed) {
    await writePromoCodes(codes);
  }
  return codes;
}

export function normalizePromoCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
