import { isAdminAuthenticated } from "@/lib/admin-session";
import { sendGuestConfirmationPreview } from "@/lib/paid-booking-mail";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { SITE_EMAIL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const to = process.env.HOST_CONTACT_EMAIL?.trim() || SITE_EMAIL;
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
