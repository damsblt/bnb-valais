export const BOOKING_AID = "311984";
export const BOOKING_LABEL = "mkt123sc-a149c0f5-bc10-473d-874d-8111ef4c22d9";

const bookingBase = "https://www.booking.com/hotel/ch/maison-la-sittelle";

export function getBookingHotelUrl(locale: "fr" | "en"): string {
  const lang = locale === "fr" ? "fr" : "en-gb";
  const params = new URLSearchParams({
    aid: BOOKING_AID,
    label: BOOKING_LABEL,
    group_adults: "2",
    group_children: "0",
    no_rooms: "1",
    sb_price_type: "total",
    type: "total",
  });

  return `${bookingBase}.${lang}.html?${params.toString()}`;
}
