import { enumerateNights } from "@/lib/typeform-prefill";
import {
  normalizePromoCode,
  readPromoCodes,
  type PromoCode,
} from "@/lib/promo-codes-store";

export type PromoValidationResult =
  | {
      ok: true;
      code: string;
      label: string;
      percentOff: number;
    }
  | {
      ok: false;
      reason:
        | "invalid_code"
        | "inactive"
        | "expired"
        | "stay_dates"
        | "max_uses";
      message: string;
    };

function stayMatchesWindow(
  checkIn: string,
  checkOut: string,
  from?: string,
  to?: string,
): boolean {
  if (!from && !to) return true;
  const nights = enumerateNights(checkIn, checkOut);
  if (nights.length === 0) return false;
  return nights.every((night) => {
    if (from && night < from) return false;
    if (to && night > to) return false;
    return true;
  });
}

function findCode(codes: PromoCode[], normalized: string): PromoCode | undefined {
  return codes.find((c) => normalizePromoCode(c.code) === normalized);
}

export async function validatePromoForStay(input: {
  code: string;
  checkIn: string;
  checkOut: string;
}): Promise<PromoValidationResult> {
  const normalized = normalizePromoCode(input.code);
  if (!normalized) {
    return {
      ok: false,
      reason: "invalid_code",
      message: "Code promo invalide.",
    };
  }

  const codes = await readPromoCodes();
  const promo = findCode(codes, normalized);
  if (!promo) {
    return {
      ok: false,
      reason: "invalid_code",
      message: "Ce code promo n’existe pas.",
    };
  }

  if (!promo.active) {
    return {
      ok: false,
      reason: "inactive",
      message: "Ce code promo n’est plus actif.",
    };
  }

  if (
    promo.maxUses != null &&
    (promo.usedCount ?? 0) >= promo.maxUses
  ) {
    return {
      ok: false,
      reason: "max_uses",
      message: "Ce code promo a atteint sa limite d’utilisation.",
    };
  }

  if (
    !stayMatchesWindow(
      input.checkIn,
      input.checkOut,
      promo.validStayFrom,
      promo.validStayTo,
    )
  ) {
    return {
      ok: false,
      reason: "stay_dates",
      message:
        "Ce code ne s’applique pas aux dates sélectionnées (vérifiez la période de l’offre).",
    };
  }

  return {
    ok: true,
    code: normalizePromoCode(promo.code),
    label: promo.label,
    percentOff: promo.percentOff,
  };
}
