/** Broadcast / test template — −10 % on stays in November 2026. */

export const RESEND_PROMO_NOV2026_ALIAS = "bnb-valais-promo-nov2026-test";

export const RESEND_PROMO_NOV2026_SUBJECT =
  "[Test] −10 % sur votre séjour en novembre 2026 — Le Nid de la Sittelle";

export const RESEND_PROMO_NOV2026_VARIABLE_KEYS = [
  "GREETING",
  "HEADLINE",
  "INTRO",
  "PROMO_CODE",
  "DISCOUNT_LABEL",
  "BOOKING_URL",
  "CONDITIONS",
  "ACCENT_COLOR",
] as const;

export function promoNov2026TemplateHtml(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Offre novembre 2026 — Le Nid de la Sittelle</title>
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
            <td style="padding:28px 28px 12px;text-align:center;">
              <p style="margin:0 0 12px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Le Nid de la Sittelle · BnB Valais</p>
              <p style="margin:0 0 16px;display:inline-block;background:#fff7ed;border:2px solid #ea580c;border-radius:999px;padding:10px 20px;font-size:28px;font-weight:700;color:#c2410c;line-height:1;">{{{DISCOUNT_LABEL}}}</p>
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;line-height:1.35;color:#18181b;">{{{HEADLINE}}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 8px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3f3f46;">{{{GREETING}}}</p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#3f3f46;">{{{INTRO}}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;">
              <div style="background:#fafafa;border:1px dashed #d4d4d8;border-radius:12px;padding:20px;text-align:center;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:0.06em;">Code promo (test)</p>
                <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.12em;color:#18181b;font-family:system-ui,sans-serif;">{{{PROMO_CODE}}}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;text-align:center;">
              <a href="{{{BOOKING_URL}}}" style="display:inline-block;background:#0284c7;color:#ffffff;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:600;font-family:system-ui,sans-serif;">Réserver sur bnb-valais.ch</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;">
              <p style="margin:0;font-size:13px;line-height:1.55;color:#71717a;">{{{CONDITIONS}}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;border-top:1px solid #e4e4e7;">
              <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#18181b;">
                Le Nid de la Sittelle<br />
                <a href="https://www.bnb-valais.ch" style="color:#0284c7;text-decoration:none;">www.bnb-valais.ch</a>
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#a1a1aa;font-family:system-ui,sans-serif;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#71717a;">Se désinscrire</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;font-family:system-ui,sans-serif;">E-mail test · campagne newsletter</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function promoNov2026VariableDefinitions(): {
  key: string;
  type: "string";
  fallback_value: string;
}[] {
  return [
    { key: "GREETING", type: "string", fallback_value: "Bonjour," },
    {
      key: "HEADLINE",
      type: "string",
      fallback_value: "Profitez de l’automne valaisan à prix doux",
    },
    {
      key: "INTRO",
      type: "string",
      fallback_value:
        "Pour vous remercier de votre confiance, nous vous offrons 10 % de réduction sur les séjours dont les dates d’arrivée et de départ tombent en novembre 2026 au Nid de la Sittelle.",
    },
    { key: "PROMO_CODE", type: "string", fallback_value: "NOV2026-10" },
    { key: "DISCOUNT_LABEL", type: "string", fallback_value: "−10 %" },
    {
      key: "BOOKING_URL",
      type: "string",
      fallback_value: "https://www.bnb-valais.ch/reservations",
    },
    {
      key: "CONDITIONS",
      type: "string",
      fallback_value:
        "Offre test valable pour les réservations directes sur bnb-valais.ch, séjour minimum 2 nuits, dates en novembre 2026. Non cumulable. Mentionnez le code lors de votre demande ou répondez à cet e-mail.",
    },
    { key: "ACCENT_COLOR", type: "string", fallback_value: "#ea580c" },
  ];
}

export function promoNov2026TemplateDefinition() {
  return {
    name: "BnB Valais — promo test novembre 2026 (−10 %)",
    alias: RESEND_PROMO_NOV2026_ALIAS,
    subject: RESEND_PROMO_NOV2026_SUBJECT,
    html: promoNov2026TemplateHtml(),
    variables: promoNov2026VariableDefinitions(),
  };
}
