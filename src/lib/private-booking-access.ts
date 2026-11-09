import { createHash, timingSafeEqual } from "node:crypto";
import { enumerateNights } from "@/lib/typeform-prefill";

export type PrivateBookingInvite = {
  token: string;
  checkIn: string;
  /** Départ, exclus. */
  checkOut: string;
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
