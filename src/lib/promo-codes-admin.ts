import {
  normalizePromoCode,
  type PromoCode,
} from "@/lib/promo-codes-store";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function sanitizePromoCode(input: Partial<PromoCode>): PromoCode | null {
  const code = normalizePromoCode(input.code ?? "");
  if (!code || code.length > 40) return null;

  const percentOff = Math.round(Number(input.percentOff));
  if (!Number.isFinite(percentOff) || percentOff < 1 || percentOff > 100) {
    return null;
  }

  const label = (input.label ?? "").trim().slice(0, 120);
  if (!label) return null;

  const validStayFrom = input.validStayFrom?.trim();
  const validStayTo = input.validStayTo?.trim();

  if (validStayFrom && !ISO_DATE.test(validStayFrom)) return null;
  if (validStayTo && !ISO_DATE.test(validStayTo)) return null;
  if (validStayFrom && validStayTo && validStayFrom > validStayTo) return null;

  let maxUses: number | undefined;
  if (input.maxUses != null && String(input.maxUses).trim() !== "") {
    const n = Math.round(Number(input.maxUses));
    if (!Number.isFinite(n) || n < 1) return null;
    maxUses = n;
  }

  const usedCount =
    input.usedCount != null ? Math.max(0, Math.round(Number(input.usedCount))) : 0;

  return {
    code,
    label,
    percentOff,
    active: Boolean(input.active),
    validStayFrom: validStayFrom || undefined,
    validStayTo: validStayTo || undefined,
    maxUses,
    usedCount,
  };
}

export function sanitizePromoCodeList(raw: unknown): PromoCode[] | null {
  if (!Array.isArray(raw)) return null;
  const out: PromoCode[] = [];
  const seen = new Set<string>();

  for (const item of raw) {
    const sanitized = sanitizePromoCode(item as Partial<PromoCode>);
    if (!sanitized) return null;
    if (seen.has(sanitized.code)) return null;
    seen.add(sanitized.code);
    out.push(sanitized);
  }
  return out;
}
