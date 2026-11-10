import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "bnb_admin_session";

function adminPassword(): string | null {
  return (
    process.env.ADMIN_PASSWORD?.trim() || "bnb-la-sittelle2011!"
  );
}

function sessionToken(): string | null {
  const secret = adminPassword();
  if (!secret) return null;
  return createHmac("sha256", secret).update("bnb-admin-v1").digest("hex");
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(adminPassword());
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = sessionToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createAdminSessionValue(): string | null {
  return sessionToken();
}

export function verifyAdminPassword(password: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}
