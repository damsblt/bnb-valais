import { resolvePrefillFieldKeys } from "@/lib/typeform";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const keys = await resolvePrefillFieldKeys();
  return Response.json(keys, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
