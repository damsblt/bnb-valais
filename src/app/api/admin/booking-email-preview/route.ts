import { sendGuestConfirmationPreview } from "@/lib/paid-booking-mail";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_EMAIL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PREVIEW_TOKEN = "7c1e9a4b2d8f46e0a5c3b91d6e47f208";

export async function POST(request: Request) {
  const token = request.headers.get("x-preview-token") ?? "";
  if (token !== PREVIEW_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const to = SITE_EMAIL;
  let invoiceUrl: string | null = null;
  if (isStripeConfigured()) {
    const invoices = await getStripe().invoices.list({ limit: 10, status: "paid" });
    invoiceUrl =
      invoices.data.find((invoice) => invoice.hosted_invoice_url)?.hosted_invoice_url ??
      null;
  }
  if (!invoiceUrl) {
    return Response.json({ error: "no_invoice" }, { status: 404 });
  }

  const withInvoice = await sendGuestConfirmationPreview({
    to,
    subjectPrefix: "[Test actuel — avec facture]",
    invoiceUrl,
  });
  const withoutInvoice = await sendGuestConfirmationPreview({
    to,
    subjectPrefix: "[Test sans facture automatique]",
    invoiceUrl: null,
  });

  if (!withInvoice.ok || !withoutInvoice.ok) {
    return Response.json(
      {
        error: "send_failed",
        withInvoice,
        withoutInvoice,
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true, to });
}
