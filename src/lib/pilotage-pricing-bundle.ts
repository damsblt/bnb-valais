import { readFileSync } from "node:fs";
import path from "node:path";
import { sanitizeNightPricingRuleList } from "@/lib/night-pricing-admin";
import type { NightPricingRule } from "@/lib/night-pricing";

const BUNDLE_PATH = path.join(
  process.cwd(),
  "data/pilotage-prix-2026-2027.rules.json",
);

export const PILOTAGE_PRICING_META = {
  label: "Pilotage Excel 2026–2027",
  from: "2026-09-01",
  to: "2027-12-31",
  ruleCount: 101,
} as const;

export function loadPilotagePricingRules(): NightPricingRule[] | null {
  let parsed: { rules?: unknown };
  try {
    parsed = JSON.parse(readFileSync(BUNDLE_PATH, "utf8")) as {
      rules?: unknown;
    };
  } catch {
    return null;
  }
  return sanitizeNightPricingRuleList(parsed.rules);
}
