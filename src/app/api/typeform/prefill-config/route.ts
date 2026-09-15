import { ensureTypeformPrefillOnForm } from "@/lib/typeform-form-setup";
import { getTypeformDateFieldKeys } from "@/lib/typeform-refs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const keys = getTypeformDateFieldKeys();
  let setup: Awaited<ReturnType<typeof ensureTypeformPrefillOnForm>> | null = null;

  try {
    setup = await ensureTypeformPrefillOnForm();
  } catch (err) {
    setup = {
      ok: false,
      detail: err instanceof Error ? err.message : "setup failed",
      dateQuestionsBefore: 0,
      dateQuestionsAfter: 0,
      guestQuestionsBefore: 0,
      guestQuestionsAfter: 0,
      hiddenConfigured: false,
    };
  }

  return Response.json(
    {
      checkIn: keys.checkIn,
      checkOut: keys.checkOut,
      setup,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
