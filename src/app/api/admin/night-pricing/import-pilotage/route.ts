import { isAdminAuthenticated } from "@/lib/admin-session";
import {
  loadPilotagePricingRules,
  PILOTAGE_PRICING_META,
} from "@/lib/pilotage-pricing-bundle";
import {
  readNightPricingStore,
  writeNightPricingStore,
} from "@/lib/night-pricing-store";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rules = loadPilotagePricingRules();
  if (!rules?.length) {
    return Response.json(
      { ok: false, error: "Bundled pilotage pricing file invalid or missing" },
      { status: 500 },
    );
  }

  const store = await readNightPricingStore();
  await writeNightPricingStore({ ...store, rules });

  return Response.json({
    ok: true,
    meta: PILOTAGE_PRICING_META,
    rulesCount: rules.length,
    currency: store.currency,
  });
}
