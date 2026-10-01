import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { hreflangMap, localePath, ogLocale } from "@/lib/i18n";
import {
  SITE_BRAND,
  SITE_EMAIL,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_PHONE,
  absoluteUrl,
  shareOgImage,
  siteBaseUrl,
} from "@/lib/site";
import { galleryPhotos, heroImages } from "@/lib/gallery";

type PageMetadataInput = {
  locale: Locale;
  frPath: string;
  enPath: string;
  dePath: string;
  title: string;
  description: string;
};

export function pageMetadata({
  locale,
  frPath,
  enPath,
  dePath,
  title,
  description,
}: PageMetadataInput): Metadata {
  const pathFor = (code: Locale) =>
    localePath(code, code === "fr" ? frPath : code === "de" ? dePath : enPath);
  const canonicalPath = pathFor(locale);
  const canonical = absoluteUrl(canonicalPath);
  const frUrl = absoluteUrl(pathFor("fr") || "/");
  const enUrl = absoluteUrl(pathFor("en"));
  const deUrl = absoluteUrl(pathFor("de"));
  const ogImage = shareOgImage();
  const alternateOg =
    locale === "fr"
      ? ["en_GB", "de_CH"]
      : locale === "de"
        ? ["fr_CH", "en_GB"]
        : ["fr_CH", "de_CH"];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath || "/",
      languages: hreflangMap({ fr: frUrl, en: enUrl, de: deUrl }),
    },
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: alternateOg,
      url: canonical,
      siteName: SITE_BRAND,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(SITE_OG_IMAGE)],
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

  const inLanguage =
    locale === "fr" ? "fr-CH" : locale === "de" ? "de-CH" : "en";
  const description =
    locale === "de"
      ? "Wohnung zur Miete im Wallis. Buchung pro Nacht, Woche oder Monat. BnB mit 2 Schlafzimmern und Alpenblick, zwischen Sitten und Anzère."
      : locale === "fr"
        ? "Appartement à louer en Valais. Réservation à la nuit, à la semaine ou au mois. BnB 2 chambres avec vue sur les Alpes, entre Sion et Anzère."
        : "Apartment to rent in Valais. Book by the night, week or month. 2-bedroom BnB with Alpine views, between Sion and Anzère.";

  return {
    "@context": "https://schema.org",
    "@type": "BedAndBreakfast",
    name: SITE_BRAND,
    alternateName: SITE_NAME,
    url,
    image: images,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    inLanguage,
    description,
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
        name:
          locale === "de" ? "Lift" : locale === "fr" ? "Ascenseur" : "Lift",
        value: true,
      },
      { "@type": "LocationFeatureSpecification", name: "TV", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name:
          locale === "de"
            ? "Ausgestattete Küche"
            : locale === "fr"
              ? "Cuisine équipée"
              : "Equipped kitchen",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name:
          locale === "de" ? "Terrasse" : locale === "fr" ? "Terrasse" : "Terrace",
        value: true,
      },
    ],
    numberOfRooms: 2,
  };
}

export function breadcrumbJsonLd(locale: Locale) {
  const home = absoluteUrl(localePath(locale));
  const reservations = absoluteUrl(localePath(locale, "/reservations"));
  const homeName =
    locale === "de" ? "Startseite" : locale === "fr" ? "Accueil" : "Home";
  const reservationsName =
    locale === "de"
      ? "Reservierung"
      : locale === "fr"
        ? "Réservations"
        : "Bookings";

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
