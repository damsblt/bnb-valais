export const BOOKING_AID = "311984";
export const BOOKING_HOTEL_ID = "484476";

const bookingBase = "https://www.booking.com/hotel/ch/maison-la-sittelle";

export function getBookingHotelUrl(locale: "fr" | "en"): string {
  const lang = locale === "fr" ? "fr" : "en-gb";
  return `${bookingBase}.${lang}.html?aid=${BOOKING_AID}`;
}

export function getBookingWidgetUrl(locale: "fr" | "en"): string {
  const lang = locale === "fr" ? "fr" : "en-gb";
  const params = new URLSearchParams({
    product: "map",
    w: "100%",
    h: "650",
    lang,
    aid: BOOKING_AID,
    target_aid: BOOKING_AID,
    ss_id: BOOKING_HOTEL_ID,
    ss_type: "hotel",
  });

  return `https://www.booking.com/flexiproduct.html?${params.toString()}`;
}
