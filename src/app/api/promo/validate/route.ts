import { validatePromoForStay } from "@/lib/promo-validate";
import { meetsMinimumStay } from "@/lib/typeform-prefill";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    code?: string;
    checkIn?: string;
    checkOut?: string;
  };

  const code = body.code?.trim() ?? "";
  const checkIn = body.checkIn?.trim() ?? "";
  const checkOut = body.checkOut?.trim() ?? "";

  if (!code) {
    return Response.json(
      { ok: false, error: "Code promo requis." },
      { status: 400 },
    );
  }

  if (!checkIn || !checkOut || checkIn >= checkOut) {
    return Response.json(
      { ok: false, error: "Dates de séjour invalides." },
      { status: 400 },
    );
  }

  if (!meetsMinimumStay(checkIn, checkOut)) {
    return Response.json(
      { ok: false, error: "Séjour minimum 2 nuits." },
      { status: 400 },
    );
  }

  const result = await validatePromoForStay({ code, checkIn, checkOut });
  if (!result.ok) {
    return Response.json(
      { ok: false, reason: result.reason, message: result.message },
      { status: 422 },
    );
  }

  return Response.json({ ok: true, promo: result });
}
