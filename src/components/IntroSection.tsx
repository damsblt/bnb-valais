import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type IntroSectionProps = {
  locale: Locale;
};

export default function IntroSection({ locale }: IntroSectionProps) {
  const { hero } = getContent(locale);

  return (
    <section className="relative z-20 -mt-20 px-4 pb-4 md:-mt-28 md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/60 bg-white/95 px-8 py-10 shadow-xl shadow-neutral-900/10 backdrop-blur-md md:px-12 md:py-14">
        <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-sky-700">
          Le Nid de la Sittelle
        </p>
        <h1 className="mt-4 text-center text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
          {hero.title}
        </h1>
        <h2 className="mt-5 text-center text-xl font-medium text-neutral-700 md:text-2xl">
          {hero.subtitle}
        </h2>
        <div className="mt-6 space-y-3 text-center text-base leading-relaxed text-neutral-600 md:text-lg">
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
