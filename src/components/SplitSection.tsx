import Link from "next/link";

type SplitSectionProps = {
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export default function SplitSection({
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition = "left",
  cta,
}: SplitSectionProps) {
  const imageBlock = (
    <div
      className="min-h-[50vh] bg-cover bg-center bg-no-repeat lg:min-h-[80vh]"
      style={{ backgroundImage: `url(${imageSrc})` }}
      role="img"
      aria-label={imageAlt}
    />
  );

  const textBlock = (
    <div className="flex flex-col justify-center gap-6 px-6 py-12 md:px-12 lg:py-16">
      <h2 className="text-center text-2xl font-semibold text-neutral-900 md:text-3xl lg:text-4xl">
        {title}
      </h2>
      <div className="space-y-4 text-center text-base text-neutral-700 md:text-lg">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {cta && (
        <div className="text-center">
          {cta.external ? (
            <a
              href={cta.href}
              className="inline-block text-lg font-medium text-neutral-800 underline decoration-2 underline-offset-4 transition hover:text-sky-500"
            >
              {cta.label}
            </a>
          ) : (
            <Link
              href={cta.href}
              className="inline-block text-lg font-medium text-neutral-800 underline decoration-2 underline-offset-4 transition hover:text-sky-500"
            >
              {cta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="grid lg:grid-cols-2">
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
