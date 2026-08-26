import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type IntroSectionProps = {
  locale: Locale;
};

export default function IntroSection({ locale }: IntroSectionProps) {
  const { hero } = getContent(locale);

  return (
    <section className="bg-neutral-200 px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-semibold text-neutral-900 md:text-4xl lg:text-5xl">
          {hero.title}
        </h1>
        <h2 className="mt-6 text-2xl font-semibold text-neutral-800 md:text-3xl">
          {hero.subtitle}
        </h2>
        <div className="mt-6 space-y-3 text-lg text-neutral-700 md:text-xl">
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
