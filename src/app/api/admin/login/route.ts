import {
  ADMIN_COOKIE,
  createAdminSessionValue,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return Response.json(
      { error: "ADMIN_PASSWORD not configured on server" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password ?? "";

  if (!verifyAdminPassword(password)) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createAdminSessionValue();
  if (!token) {
    return Response.json({ error: "Session unavailable" }, { status: 503 });
  }

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`,
      },
    },
  );
}
