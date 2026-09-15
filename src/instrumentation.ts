export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.VERCEL_ENV !== "production") return;
  if (!process.env.RESEND_API_KEY?.trim()) return;

  const hasEnvIds =
    process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim() &&
    process.env.RESEND_NEWSLETTER_TOPIC_ID?.trim();
  if (hasEnvIds) return;

  const { ensureNewsletterAudience } = await import(
    "@/lib/resend-newsletter-audience"
  );
  void ensureNewsletterAudience().catch(() => {});

  if (process.env.TYPEFORM_ACCESS_TOKEN?.trim()) {
    const { ensureTypeformPrefillOnForm } = await import(
      "@/lib/typeform-form-setup"
    );
    void ensureTypeformPrefillOnForm()
      .then((result) => {
        if (!result.ok) {
          console.warn("[typeform-sync]", result.detail);
        }
      })
      .catch((err) => {
        console.warn("[typeform-sync]", err instanceof Error ? err.message : err);
      });
  }
}
