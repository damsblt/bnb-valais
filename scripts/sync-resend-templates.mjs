#!/usr/bin/env node
/**
 * Creates (or recreates) published Resend templates for accept/decline emails.
 * Usage: RESEND_API_KEY=re_… node scripts/sync-resend-templates.mjs
 */

const API = "https://api.resend.com";

const ALIAS_ACCEPT = "bnb-valais-reservation-accept";
const ALIAS_REJECT = "bnb-valais-reservation-decline";

const layoutHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Le Nid de la Sittelle</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Georgia,'Times New Roman',serif;color:#18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
          <tr>
            <td style="height:6px;background:{{{ACCENT_COLOR}}};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px;">
              <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Le Nid de la Sittelle · Valais</p>
              <h1 style="margin:0 0 20px;font-size:22px;font-weight:600;line-height:1.35;color:#18181b;">{{{HEADLINE}}}</h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3f3f46;">{{{GREETING}}}</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#3f3f46;">{{{LEAD}}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:12px;padding:20px;">
                <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.06em;">Récapitulatif</p>
                {{{DETAILS_HTML}}}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 32px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#52525b;">{{{FOOTER_NOTE}}}</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#18181b;">
                Le Nid de la Sittelle<br />
                <a href="https://www.bnb-valais.ch" style="color:#0284c7;text-decoration:none;">www.bnb-valais.ch</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;font-family:system-ui,sans-serif;">BnB Valais · message automatique</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

const variables = [
  "GREETING",
  "HEADLINE",
  "LEAD",
  "DETAILS_HTML",
  "FOOTER_NOTE",
  "ACCENT_COLOR",
].map((key) => ({
  key,
  type: "string",
  fallback_value: key === "ACCENT_COLOR" ? "#0284c7" : "—",
}));

async function api(path, options = {}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error("Missing RESEND_API_KEY");
    process.exit(1);
  }
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} → ${res.status}: ${text}`);
  }
  return json;
}

async function findByAlias(alias) {
  const list = await api("/templates?limit=100");
  const items = list?.data ?? [];
  return items.find((t) => t.alias === alias || t.name === alias);
}

async function createAndPublish(def) {
  const existing = await findByAlias(def.alias);
  if (existing?.id) {
    console.log(`Template "${def.alias}" already exists (${existing.id}, ${existing.status}). Skipping create.`);
    if (existing.status !== "published") {
      await api(`/templates/${existing.id}/publish`, { method: "POST" });
      console.log(`Published ${def.alias}`);
    }
    return existing.id;
  }

  const created = await api("/templates", {
    method: "POST",
    body: JSON.stringify({
      name: def.name,
      alias: def.alias,
      subject: def.subject,
      html: layoutHtml,
      variables,
    }),
  });
  const id = created.id;
  await api(`/templates/${id}/publish`, { method: "POST" });
  console.log(`Created and published ${def.alias} → ${id}`);
  return id;
}

async function main() {
  const acceptId = await createAndPublish({
    name: "BnB Valais — confirmation demande",
    alias: ALIAS_ACCEPT,
    subject: "Confirmation de votre demande — Le Nid de la Sittelle",
  });
  const rejectId = await createAndPublish({
    name: "BnB Valais — refus demande",
    alias: ALIAS_REJECT,
    subject: "Votre demande de séjour — Le Nid de la Sittelle",
  });

  console.log("\nOptional Vercel variables (aliases work without these):");
  console.log(`RESEND_TEMPLATE_ACCEPT=${ALIAS_ACCEPT}`);
  console.log(`RESEND_TEMPLATE_REJECT=${ALIAS_REJECT}`);
  console.log(`\nIDs: accept=${acceptId} reject=${rejectId}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
