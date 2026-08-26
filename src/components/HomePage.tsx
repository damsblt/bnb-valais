import ImageGallery from "@/components/ImageGallery";
import IntroSection from "@/components/IntroSection";
import LocationSection from "@/components/LocationSection";
import SiteLayout from "@/components/SiteLayout";
import SplitSection from "@/components/SplitSection";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";

type HomePageProps = {
  locale: Locale;
};

export default function HomePage({ locale }: HomePageProps) {
  const content = getContent(locale);
  const { sections, gallery } = content;
  const reservationsHref = localePath(locale, "/reservations");

  return (
    <SiteLayout locale={locale}>
      <IntroSection locale={locale} />

      <SplitSection
        title={sections.alps.title}
        paragraphs={sections.alps.paragraphs}
        imageSrc="/images/DJI_0057-scaled-e1737734622186.jpg"
        imageAlt={sections.alps.title}
        imagePosition="left"
        cta={{
          label: sections.alps.cta,
          href: reservationsHref,
        }}
      />

      <SplitSection
        title={sections.apartment.title}
        paragraphs={sections.apartment.paragraphs}
        imageSrc="/images/Chambre-Adulte-Nid_2-1024x768.jpeg"
        imageAlt={sections.apartment.title}
        imagePosition="right"
        cta={{
          label: sections.apartment.cta,
          href: reservationsHref,
        }}
      />

      <ImageGallery altLabels={[...gallery.alt]} />

      <LocationSection
        title={sections.location.title}
        description={sections.location.description}
      />
    </SiteLayout>
  );
}
