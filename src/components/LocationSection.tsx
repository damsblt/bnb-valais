type LocationSectionProps = {
  title: string;
  description: string;
};

export default function LocationSection({
  title,
  description,
}: LocationSectionProps) {
  return (
    <section className="px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
          {title}
        </h2>
        <p className="mt-6 text-lg text-neutral-700 md:text-xl">{description}</p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-lg shadow-md">
        <iframe
          title="BnB La Sittelle — Google Maps"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCF3GqCPfbM6TwJPzs3eENWvWFZjl-Op34&q=bnb%20la%20sittelle&zoom=10"
          className="aspect-video w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
