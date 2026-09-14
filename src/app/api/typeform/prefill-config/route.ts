import { getPrefillParamNames } from "@/lib/typeform-prefill";

export const dynamic = "force-dynamic";

export async function GET() {
  const params = getPrefillParamNames();
  return Response.json(params);
}
