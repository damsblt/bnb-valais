import IntroSection from "@/components/IntroSection";
import LocationSection from "@/components/LocationSection";
import PhotoGallery from "@/components/PhotoGallery";
import SiteLayout from "@/components/SiteLayout";
import {
  JsonLdAccommodation,
  JsonLdBreadcrumb,
  JsonLdFAQ,
  JsonLdPricing,
} from "@/components/JsonLd";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { galleryPhotos } from "@/lib/gallery";

type HomePageProps = {
  locale: Locale;
};

export default function HomePage({ locale }: HomePageProps) {
  const content = getContent(locale);
  const { sections, gallery } = content;
  const reservationsHref = localePath(locale, "/reservations");

  return (
    <SiteLayout locale={locale}>
      <JsonLdAccommodation locale={locale} />
      <JsonLdBreadcrumb locale={locale} />
      <JsonLdFAQ locale={locale} />
      <JsonLdPricing locale={locale} />
      <IntroSection locale={locale} />

      <PhotoGallery
        locale={locale}
        title={sections.alps.title}
        paragraphs={sections.alps.paragraphs}
        photos={[...galleryPhotos.exterieur]}
        showAllLabel={gallery.showAll}
        morePhotosTemplate={gallery.morePhotos}
        cta={{
          label: sections.alps.cta,
          href: reservationsHref,
        }}
      />

      <PhotoGallery
        locale={locale}
        title={sections.apartment.title}
        paragraphs={sections.apartment.paragraphs}
        photos={[...galleryPhotos.sejour]}
        showAllLabel={gallery.showAll}
        morePhotosTemplate={gallery.morePhotos}
        tone="muted"
      />

      <PhotoGallery
        locale={locale}
        title={sections.bedrooms.title}
        paragraphs={sections.bedrooms.paragraphs}
        photos={[...galleryPhotos.chambres]}
        showAllLabel={gallery.showAll}
        morePhotosTemplate={gallery.morePhotos}
        cta={{
          label: sections.bedrooms.cta,
          href: reservationsHref,
        }}
      />

      <PhotoGallery
        locale={locale}
        title={sections.building.title}
        paragraphs={sections.building.paragraphs}
        photos={[...galleryPhotos.batiment]}
        showAllLabel={gallery.showAll}
        morePhotosTemplate={gallery.morePhotos}
        tone="muted"
      />

      <LocationSection
        locale={locale}
        title={sections.location.title}
        description={sections.location.description}
      />
    </SiteLayout>
  );
}
