/** HTML layout for Resend dashboard templates (variables use {{{NAME}}}). */

export const RESEND_TEMPLATE_ALIAS_ACCEPT = "bnb-valais-reservation-accept";
export const RESEND_TEMPLATE_ALIAS_REJECT = "bnb-valais-reservation-decline";

export const RESEND_TEMPLATE_VARIABLE_KEYS = [
  "GREETING",
  "HEADLINE",
  "LEAD",
  "DETAILS_HTML",
  "FOOTER_NOTE",
  "PAYMENT_HTML",
  "ACCENT_COLOR",
] as const;

export type ResendTemplateVariableKey =
  (typeof RESEND_TEMPLATE_VARIABLE_KEYS)[number];

export function reservationEmailLayoutHtml(): string {
  return `<!DOCTYPE html>
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
            <td style="padding:0 28px 8px;">
              {{{PAYMENT_HTML}}}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 32px;">
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
}

export function templateVariableDefinitions(): {
  key: string;
  type: "string";
  fallback_value: string;
}[] {
  return RESEND_TEMPLATE_VARIABLE_KEYS.map((key) => ({
    key,
    type: "string" as const,
    fallback_value: key === "ACCENT_COLOR" ? "#0284c7" : "—",
  }));
}
