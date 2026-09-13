import Image from "next/image";
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

function encodePhotoPath(path: string) {
  return path
    .split("/")
    .map((part, index) => (index === 0 && part === "" ? "" : encodeURIComponent(part)))
    .join("/");
}

export default function SplitSection({
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imagePosition = "left",
  cta,
}: SplitSectionProps) {
  const imageBlock = (
    <div className="relative min-h-[22rem] overflow-hidden rounded-3xl lg:min-h-[34rem]">
      <Image
        src={encodePhotoPath(imageSrc)}
        alt={imageAlt}
        fill
        className="object-cover transition duration-700 hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center gap-6 px-2 py-6 lg:px-8 lg:py-10">
      <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {cta && (
        <div>
          {cta.external ? (
            <a
              href={cta.href}
              className="inline-flex items-center rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              {cta.label}
            </a>
          ) : (
            <Link
              href={cta.href}
              className="inline-flex items-center rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              {cta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="px-4 py-10 md:px-8 md:py-16 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
      </div>
    </section>
  );
}
