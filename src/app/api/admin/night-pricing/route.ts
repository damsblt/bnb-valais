import { isAdminAuthenticated } from "@/lib/admin-session";
import { sanitizeNightPricingRuleList } from "@/lib/night-pricing-admin";
import {
  isNightPricingStorageConfigured,
  readNightPricingStore,
  writeNightPricingStore,
} from "@/lib/night-pricing-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await readNightPricingStore();
  return Response.json({
    currency: store.currency,
    rules: store.rules,
    storageConfigured: isNightPricingStorageConfigured(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { rules?: unknown };
  const rules = sanitizeNightPricingRuleList(body.rules);
  if (!rules) {
    return Response.json({ error: "Invalid pricing rules" }, { status: 400 });
  }

  const store = await readNightPricingStore();
  await writeNightPricingStore({ ...store, rules });
  return Response.json({ ok: true, currency: store.currency, rules });
}
