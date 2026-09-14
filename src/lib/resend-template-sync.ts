import { promoNov2026TemplateDefinition } from "@/lib/resend-promo-nov2026-template";

const RESEND_API = "https://api.resend.com";

type TemplateDef = ReturnType<typeof promoNov2026TemplateDefinition>;

async function resendApi(
  apiKey: string,
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const res = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function findTemplateByAlias(
  apiKey: string,
  alias: string,
): Promise<{ id: string } | null> {
  const list = (await resendApi(apiKey, "/templates?limit=100")) as {
    data?: { id: string; alias?: string; name?: string }[];
  };
  const items = list.data ?? [];
  return (
    items.find((t) => t.alias === alias || t.name === alias) ?? null
  );
}

export async function upsertAndPublishResendTemplate(
  apiKey: string,
  def: TemplateDef,
): Promise<{ id: string; alias: string; published: true }> {
  const body = {
    name: def.name,
    alias: def.alias,
    subject: def.subject,
    html: def.html,
    variables: def.variables.map((v) => ({
      key: v.key,
      type: v.type,
      fallback_value: v.fallback_value,
    })),
  };

  const existing = await findTemplateByAlias(apiKey, def.alias);
  let id: string;

  if (existing?.id) {
    id = existing.id;
    await resendApi(apiKey, `/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  } else {
    const created = (await resendApi(apiKey, "/templates", {
      method: "POST",
      body: JSON.stringify(body),
    })) as { id: string };
    id = created.id;
  }

  await resendApi(apiKey, `/templates/${id}/publish`, { method: "POST" });

  return { id, alias: def.alias, published: true };
}

export async function syncPromoNov2026TestTemplate(apiKey: string) {
  const def = promoNov2026TemplateDefinition();
  const result = await upsertAndPublishResendTemplate(apiKey, def);
  return {
    ...result,
    subject: def.subject,
    broadcastHint:
      "Resend → Broadcasts → segment newsletter + topic « Actualités BnB Valais » → template alias " +
      def.alias,
  };
}
