import {
  promoNov2026TemplateDefinition,
  RESEND_PROMO_NOV2026_ALIAS,
  RESEND_PROMO_NOV2026_SUBJECT,
} from "@/lib/resend-promo-nov2026-template";

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

function newsletterFromAddress(): string {
  return (
    process.env.NEWSLETTER_FROM_EMAIL?.trim() ||
    process.env.RESERVATION_FROM_EMAIL?.trim() ||
    "Le Nid de la Sittelle <newsletter@bnb-valais.ch>"
  );
}

export async function sendPromoNov2026TestEmail(
  apiKey: string,
  to: string,
): Promise<{ id: string; to: string }> {
  const def = promoNov2026TemplateDefinition();
  const variables = Object.fromEntries(
    def.variables.map((v) => [v.key, v.fallback_value]),
  );

  const result = (await resendApi(apiKey, "/emails", {
    method: "POST",
    body: JSON.stringify({
      from: newsletterFromAddress(),
      to: [to],
      subject: RESEND_PROMO_NOV2026_SUBJECT,
      reply_to: process.env.HOST_CONTACT_EMAIL?.trim() || undefined,
      template: {
        id: RESEND_PROMO_NOV2026_ALIAS,
        variables,
      },
    }),
  })) as { id: string };

  return { id: result.id, to };
}
