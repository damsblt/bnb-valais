import { isAdminAuthenticated } from "@/lib/admin-session";
import { sanitizePromoCodeList } from "@/lib/promo-codes-admin";
import {
  readPromoCodes,
  writePromoCodes,
  type PromoCode,
} from "@/lib/promo-codes-store";
import { isAcceptedStorageConfigured } from "@/lib/accepted-stays-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const codes = await readPromoCodes();
  return Response.json({
    codes,
    storageConfigured: isAcceptedStorageConfigured(),
  });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { codes?: PromoCode[] };
  const sanitized = sanitizePromoCodeList(body.codes);
  if (!sanitized) {
    return Response.json(
      { error: "Invalid promo codes payload" },
      { status: 400 },
    );
  }

  await writePromoCodes(sanitized);
  return Response.json({ ok: true, codes: sanitized });
}
