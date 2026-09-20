import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { cookiesPath, privacyPath, type LegalPageCopy } from "@/lib/legal";

type LegalArticleProps = {
  locale: Locale;
  copy: LegalPageCopy;
  related: "cookies" | "privacy";
};

export default function LegalArticle({ locale, copy, related }: LegalArticleProps) {
  const relatedHref = related === "cookies" ? cookiesPath(locale) : privacyPath(locale);
  const relatedLabel =
    related === "cookies"
      ? locale === "fr"
        ? "Page cookies"
        : "Cookies page"
      : locale === "fr"
        ? "Protection des données"
        : "Privacy";

  return (
    <article className="px-4 py-12 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-3 text-sm text-neutral-500">{copy.updated}</p>
        <p className="mt-6 text-base leading-relaxed text-neutral-700 md:text-lg">{copy.intro}</p>

        <div className="mt-10 space-y-8">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-neutral-900">{section.title}</h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-neutral-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-neutral-600">
          <Link href={relatedHref} className="font-medium text-sky-800 underline-offset-2 hover:underline">
            {relatedLabel}
          </Link>
        </p>
      </div>
    </article>
  );
}
