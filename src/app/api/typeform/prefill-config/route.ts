import { ensureTypeformPrefillOnForm } from "@/lib/typeform-form-setup";
import { getTypeformDateFieldKeys } from "@/lib/typeform-refs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const keys = getTypeformDateFieldKeys();
  let setup: { ok: boolean; detail: string } | null = null;

  try {
    setup = await ensureTypeformPrefillOnForm();
  } catch (err) {
    setup = {
      ok: false,
      detail: err instanceof Error ? err.message : "setup failed",
    };
  }

  return Response.json(
    {
      checkIn: keys.checkIn,
      checkOut: keys.checkOut,
      source: "configured",
      setup,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
