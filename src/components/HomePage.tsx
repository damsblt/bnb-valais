import ApartmentGallerySection from "@/components/ApartmentGallerySection";
import IntroSection from "@/components/IntroSection";
import LocationSection from "@/components/LocationSection";
import PhotoGallery from "@/components/PhotoGallery";
import SiteLayout from "@/components/SiteLayout";
import SplitSection from "@/components/SplitSection";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { splitImages } from "@/lib/gallery";

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
        imageSrc={splitImages.alps}
        imageAlt={sections.alps.title}
        imagePosition="left"
        cta={{
          label: sections.alps.cta,
          href: reservationsHref,
        }}
      />

      <ApartmentGallerySection
        title={sections.apartment.title}
        paragraphs={sections.apartment.paragraphs}
        cta={{
          label: sections.apartment.cta,
          href: reservationsHref,
        }}
      />

      <PhotoGallery
        locale={locale}
        title={gallery.title}
        showAllLabel={gallery.showAll}
        morePhotosTemplate={gallery.morePhotos}
      />

      <LocationSection
        title={sections.location.title}
        description={sections.location.description}
      />
    </SiteLayout>
  );
}
