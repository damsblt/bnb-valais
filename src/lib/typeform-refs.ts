/** Block references — Formulaire de réservation (ZD3ppqKS) */
export const TYPEFORM_DATE_ARRIVAL_REF = "27a029a6-7114-41da-91b8-af9a6b227e9c";
export const TYPEFORM_DATE_DEPARTURE_REF = "37840e24-6ae3-4049-9186-e4d75cca1783";

export function getTypeformDateFieldKeys(): { checkIn: string; checkOut: string } {
  return {
    checkIn:
      process.env.TYPEFORM_PARAM_CHECKIN?.trim() || TYPEFORM_DATE_ARRIVAL_REF,
    checkOut:
      process.env.TYPEFORM_PARAM_CHECKOUT?.trim() || TYPEFORM_DATE_DEPARTURE_REF,
  };
}
