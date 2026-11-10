import { createHash, timingSafeEqual } from "node:crypto";
import { enumerateNights } from "@/lib/typeform-prefill";

export type PrivateBookingInvite = {
  token: string;
  checkIn: string;
  /** Départ, exclus. */
  checkOut: string;
  /** Nombre de personnes du tarif négocié. */
  guests?: number;
  /** Prix barré, en CHF. */
  listPriceChf?: number;
  /** Montant à payer, en CHF. */
  payPriceChf?: number;
};

export type PrivateStayOffer = {
  checkIn: string;
  checkOut: string;
  guests: number;
  listPriceChf: number;
  payPriceChf: number;
};

/**
 * Liens envoyés à une cliente précise. Le jeton n’est pas devinable :
 * sans lui, les nuits fermées dans l’admin restent bloquées.
 */
const INVITES: PrivateBookingInvite[] = [
  {
    token: "e198e524102d18e00b4a4b9fdbaa1150eee7c5a4d14c2868",
    checkIn: "2026-11-26",
    checkOut: "2026-11-30",
  },
  {
    token: "32ff489183b05cab6552a82674c00b47854ae0baa04fc7a3",
    checkIn: "2026-11-13",
    checkOut: "2026-11-16",
    guests: 2,
    listPriceChf: 390,
    payPriceChf: 350,
  },
];

function sameToken(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function findPrivateBookingInvite(
  token: string | null | undefined,
): PrivateBookingInvite | null {
  const value = token?.trim() ?? "";
  if (!value) return null;
  return INVITES.find((invite) => sameToken(value, invite.token)) ?? null;
}

/** Le séjour demandé doit tenir entièrement dans la période du lien. */
export function inviteCoversStay(
  invite: PrivateBookingInvite,
  checkIn: string,
  checkOut: string,
): boolean {
  const nights = enumerateNights(checkIn, checkOut);
  if (nights.length === 0) return false;
  const allowed = new Set(enumerateNights(invite.checkIn, invite.checkOut));
  return nights.every((night) => allowed.has(night));
}

/** Tarif négocié, seulement pour le séjour et le nombre de personnes du lien. */
export function privateStayOffer(
  token: string | null | undefined,
  checkIn?: string,
  checkOut?: string,
  guests?: number,
): PrivateStayOffer | null {
  const invite = findPrivateBookingInvite(token);
  if (
    !invite?.guests ||
    invite.listPriceChf == null ||
    invite.payPriceChf == null ||
    invite.payPriceChf <= 0 ||
    invite.listPriceChf < invite.payPriceChf
  ) {
    return null;
  }
  const offer: PrivateStayOffer = {
    checkIn: invite.checkIn,
    checkOut: invite.checkOut,
    guests: invite.guests,
    listPriceChf: invite.listPriceChf,
    payPriceChf: invite.payPriceChf,
  };
  if (checkIn == null && checkOut == null && guests == null) return offer;
  if (checkIn !== offer.checkIn || checkOut !== offer.checkOut || guests !== offer.guests) {
    return null;
  }
  return offer;
}

export function releaseInvitedNights(
  occupied: Set<string>,
  token: string | null | undefined,
): void {
  const invite = findPrivateBookingInvite(token);
  if (!invite) return;
  for (const night of enumerateNights(invite.checkIn, invite.checkOut)) {
    occupied.delete(night);
  }
}
