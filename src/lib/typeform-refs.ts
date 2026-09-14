/** Paramètres URL / hidden fields Typeform (lisibles) */
export const TYPEFORM_PARAM_ARRIVAL = "date_arrivee";
export const TYPEFORM_PARAM_DEPARTURE = "date_depart";
export const TYPEFORM_PARAM_PROMO_CODE = "code_promo";
export const TYPEFORM_PARAM_PROMO_PERCENT = "reduction_pct";

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

export function getTypeformDateFieldKeys(): { checkIn: string; checkOut: string } {
  return {
    checkIn:
      process.env.TYPEFORM_PARAM_CHECKIN?.trim() || TYPEFORM_PARAM_ARRIVAL,
    checkOut:
      process.env.TYPEFORM_PARAM_CHECKOUT?.trim() || TYPEFORM_PARAM_DEPARTURE,
  };
}
