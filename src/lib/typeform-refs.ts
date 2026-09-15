/** Paramètres URL / hidden fields Typeform (lisibles) */
export const TYPEFORM_PARAM_ARRIVAL = "date_arrivee";
export const TYPEFORM_PARAM_DEPARTURE = "date_depart";
export const TYPEFORM_PARAM_PROMO_CODE = "code_promo";
export const TYPEFORM_PARAM_PROMO_PERCENT = "reduction_pct";
export const TYPEFORM_PARAM_GUEST_COUNT = "nombre_personnes";
export const TYPEFORM_PARAM_STAY_TOTAL = "montant_total";

export function getTypeformPromoFieldKeys(): {
  code: string;
  percent: string;
} {
  return {
    code:
      process.env.TYPEFORM_PARAM_PROMO_CODE?.trim() ||
      TYPEFORM_PARAM_PROMO_CODE,
    percent:
      process.env.TYPEFORM_PARAM_PROMO_PERCENT?.trim() ||
      TYPEFORM_PARAM_PROMO_PERCENT,
  };
}

/** Anciennes refs de blocs (conservées pour référence) */
export const TYPEFORM_DATE_ARRIVAL_REF = "27a029a6-7114-41da-91b8-af9a6b227e9c";
export const TYPEFORM_DATE_DEPARTURE_REF = "37840e24-6ae3-4049-9186-e4d75cca1783";

export function getTypeformGuestCountFieldKey(): string {
  return (
    process.env.TYPEFORM_PARAM_GUESTS?.trim() || TYPEFORM_PARAM_GUEST_COUNT
  );
}

export function getTypeformStayTotalFieldKey(): string {
  return (
    process.env.TYPEFORM_PARAM_STAY_TOTAL?.trim() || TYPEFORM_PARAM_STAY_TOTAL
  );
}

export function getTypeformDateFieldKeys(): { checkIn: string; checkOut: string } {
  return {
    checkIn:
      process.env.TYPEFORM_PARAM_CHECKIN?.trim() || TYPEFORM_PARAM_ARRIVAL,
    checkOut:
      process.env.TYPEFORM_PARAM_CHECKOUT?.trim() || TYPEFORM_PARAM_DEPARTURE,
  };
}

/** Hidden fields à déclarer sur le formulaire Typeform (prefill site → réponses). */
export function getRequiredTypeformHiddenFields(): string[] {
  const promo = getTypeformPromoFieldKeys();
  return [
    getTypeformDateFieldKeys().checkIn,
    getTypeformDateFieldKeys().checkOut,
    getTypeformGuestCountFieldKey(),
    getTypeformStayTotalFieldKey(),
    promo.code,
    promo.percent,
  ];
}
