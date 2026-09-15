export type BankTransferDetails = {
  accountHolder: string;
  iban: string;
  bic: string;
  paymentReferenceHint: string;
};

export function getBankTransferDetails(): BankTransferDetails {
  return {
    accountHolder:
      process.env.RESERVATION_BANK_ACCOUNT_HOLDER?.trim() ||
      "Damien Balet et Canan Özcan",
    iban:
      process.env.RESERVATION_IBAN?.trim() || "CH46 8080 8002 6049 0052 0",
    bic: process.env.RESERVATION_BIC?.trim() || "RAIFCH22",
    paymentReferenceHint:
      process.env.RESERVATION_PAYMENT_REFERENCE_HINT?.trim() ||
      "Merci d'indiquer votre nom et vos dates de séjour en référence du virement.",
  };
}

export function buildPaymentPlainText(options?: {
  amountChf?: number | null;
}): string {
  const bank = getBankTransferDetails();
  const amountLine =
    options?.amountChf != null && options.amountChf > 0
      ? `\nMontant à virer : ${Math.round(options.amountChf)} CHF\n`
      : "";
  return `Paiement et confirmation définitive

Votre réservation sera définitivement confirmée dès réception du paiement sur notre compte.
${amountLine}
Titulaire : ${bank.accountHolder}
IBAN : ${bank.iban}
SWIFT/BIC : ${bank.bic}

${bank.paymentReferenceHint}`;
}

export function buildPaymentHtml(options?: {
  amountChf?: number | null;
  amountLabel?: string;
}): string {
  const bank = getBankTransferDetails();
  const amountBlock =
    options?.amountChf != null && options.amountChf > 0
      ? `<p style="margin:0 0 16px;padding:14px 16px;border-radius:10px;background:#ecfdf5;border:1px solid #a7f3d0;font-size:17px;line-height:1.4;color:#065f46;"><strong>${escape(options.amountLabel ?? "Montant à virer")} :</strong> ${Math.round(options.amountChf)} CHF</p>`
      : "";
  return `<div style="margin-top:4px;padding:18px;border:1px solid #d4d4d8;border-radius:12px;background:#ffffff;">
  <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#18181b;text-transform:uppercase;letter-spacing:0.05em;">Paiement et confirmation définitive</p>
  <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3f3f46;">Votre réservation sera <strong>définitivement confirmée</strong> une fois le paiement reçu sur notre compte.</p>
  ${amountBlock}
  <table role="presentation" style="width:100%;font-size:15px;line-height:1.6;color:#18181b;">
    <tr><td style="padding:4px 0;color:#52525b;width:38%;">Titulaire</td><td style="padding:4px 0;"><strong>${escape(bank.accountHolder)}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#52525b;">IBAN</td><td style="padding:4px 0;font-family:ui-monospace,monospace;"><strong>${escape(bank.iban)}</strong></td></tr>
    <tr><td style="padding:4px 0;color:#52525b;">SWIFT/BIC</td><td style="padding:4px 0;font-family:ui-monospace,monospace;"><strong>${escape(bank.bic)}</strong></td></tr>
  </table>
  <p style="margin:14px 0 0;font-size:14px;line-height:1.55;color:#52525b;">${escape(bank.paymentReferenceHint)}</p>
</div>`;
}

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
