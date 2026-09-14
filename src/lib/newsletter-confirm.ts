import { consumeNewsletterToken } from "@/lib/newsletter-store";
import { addContactToResendNewsletter } from "@/lib/newsletter-mail";

export type ConfirmNewsletterResult =
  | { status: "success"; email: string }
  | { status: "already" }
  | { status: "expired" }
  | { status: "invalid" }
  | { status: "resend_error"; error: string };

export async function confirmNewsletterSignup(
  token: string | undefined,
): Promise<ConfirmNewsletterResult> {
  if (!token?.trim()) return { status: "invalid" };

  const consumed = await consumeNewsletterToken(token);
  if (!consumed.ok) {
    if (consumed.reason === "expired") return { status: "expired" };
    if (consumed.reason === "already") return { status: "already" };
    return { status: "invalid" };
  }

  const resend = await addContactToResendNewsletter(consumed.email);
  if (!resend.ok) {
    return { status: "resend_error", error: resend.error ?? "Resend error" };
  }

  return { status: "success", email: consumed.email };
}
