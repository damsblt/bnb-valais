import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import {
  SITE_BRAND,
  SITE_EMAIL,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PHONE,
  absoluteUrl,
  siteBaseUrl,
} from "@/lib/site";
import { galleryPhotos, heroImages } from "@/lib/gallery";

type PageMetadataInput = {
  locale: Locale;
  frPath: string;
  enPath: string;
  title: string;
  description: string;
};

export function pageMetadata({
  locale,
  frPath,
  enPath,
  title,
  description,
}: PageMetadataInput): Metadata {
  const canonicalPath = localePath(locale, locale === "fr" ? frPath : enPath);
  const canonical = absoluteUrl(canonicalPath);
  const frUrl = absoluteUrl(localePath("fr", frPath) || "/");
  const enUrl = absoluteUrl(localePath("en", enPath));
  const ogImage = absoluteUrl(SITE_OG_IMAGE);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath || "/",
      languages: {
        fr: frUrl,
        en: enUrl,
        "x-default": frUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CH" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_CH"],
      url: canonical,
      siteName: SITE_BRAND,
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: `${SITE_BRAND} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function lodgingJsonLd(locale: Locale) {
  const url = siteBaseUrl();
  const images = [
    absoluteUrl(heroImages.desktop),
    absoluteUrl(galleryPhotos.exterieur[0].src),
    absoluteUrl(galleryPhotos.sejour[0].src),
    absoluteUrl(galleryPhotos.chambres[0].src),
    absoluteUrl(galleryPhotos.batiment[0].src),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BedAndBreakfast",
    name: SITE_BRAND,
    alternateName: SITE_NAME,
    url,
    image: images,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    inLanguage: locale === "fr" ? "fr-CH" : "en",
    description:
      locale === "fr"
        ? "Appartement à louer en Valais. Réservation à la nuit, à la semaine ou au mois. BnB 2 chambres avec vue sur les Alpes, entre Sion et Anzère."
        : "Apartment to rent in Valais. Book by the night, week or month. 2-bedroom BnB with Alpine views, between Sion and Anzère.",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Valais",
      addressCountry: "CH",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name: locale === "fr" ? "Ascenseur" : "Lift",
        value: true,
      },
      { "@type": "LocationFeatureSpecification", name: "TV", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name: locale === "fr" ? "Cuisine équipée" : "Equipped kitchen",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: locale === "fr" ? "Terrasse" : "Terrace",
        value: true,
      },
    ],
    numberOfRooms: 2,
  };
}

export function breadcrumbJsonLd(locale: Locale) {
  const home = absoluteUrl(localePath(locale));
  const reservations = absoluteUrl(localePath(locale, "/reservations"));
  const homeName = locale === "fr" ? "Accueil" : "Home";
  const reservationsName = locale === "fr" ? "Réservations" : "Bookings";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: home },
      {
        "@type": "ListItem",
        position: 2,
        name: reservationsName,
        item: reservations,
      },
    ],
  };
}
